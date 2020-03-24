import queryString from "query-string";
import {useHistory} from "react-router-dom";

import ITodo from '../models/ITodo';
import safeGet from '../util/safeGet';
import {AuthActionCreater, TodoActionCreater} from "../actions";
import {useStateValue} from "../state";
import {IPagingInfo} from "../models/IPagingInfo";

interface ITodoApis {
    authenticate: () => void;
    getToken: (code: string) => void;
    fetchUserTodos: (username: string, page: number) => void;
    fetchAllTodos: (page: number) => void;
    searchTodos: (searchValue: string, user?: string) => void;
    fetchTodos: (url: string) => void;
    fetchOneTodoForEdit: (id: string) => Promise<ITodo | void>;
    submitNewTodo: (title: string, description: string, priority: string) => Promise<ITodo | void>;
    updateTodo: (title: string, description: string, priority: string) => Promise<ITodo | void>;
    downloadTodos: (searchValue?: string, user?: string) => void;
    changeTodoStatus: (url: string) => Promise<ITodo | void>;
    resetPaginations: () => void;
    getUserInfo: () => void;
    revokeToken: () => void;
    deleteTodo: (id: number) => Promise<boolean>;
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again later.";
const UNAUTHORIZED_MESSAGE = "Unauthorized operation.";

const useApi = (): ITodoApis => {
    const fetchAllTodosEndpoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos',
        fetchOneTodoEndpoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos/id',
        fetchUserTodosEndpoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos/user',
        sumbitNewTodoEndpoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos',
        searchTodosEndpoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos/search',
        downloadTodosEndPoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos/file',
        deleteTodoEndpoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos',
        userInfoEndpoint = process.env.REACT_APP_TODO_LIST_API + '/user-info',
        authorizeEndpoint = process.env.REACT_APP_OAUTH_SERVER + '/oauth/authorize',
        getTokenEndpoint = process.env.REACT_APP_OAUTH_SERVER + '/oauth/token',
        revokeTokenEndpoint = process.env.REACT_APP_OAUTH_SERVER + '/oauth/revoke-token';

    const authActions = AuthActionCreater();
    const todoActions = TodoActionCreater();
    const [{todo: todoState, auth: authState}, _] = useStateValue();
    const history = useHistory();

    const authenticate = () => {
        const randomString = Math.random().toString(36).substring(7);
        sessionStorage.setItem('code_challenge', randomString);
        sessionStorage.setItem('redirect_path', window.location.pathname + window.location.search);

        const url = queryString.stringifyUrl({
            url: authorizeEndpoint,
            query: {
                client_id: process.env.REACT_APP_CLIENT_ID,
                grant_type: 'authorization_code',
                response_type: 'code',
                scope: 'any',
                code_challenge: randomString,
            }
        });

        window.location.assign(url);
    }

    const getToken = async (code: string) => {
        const codeChallenge = sessionStorage.getItem('code_challenge');
        sessionStorage.removeItem('code_challenge');

        const url = queryString.stringifyUrl({
            url: getTokenEndpoint,
            query: {
                code,
                grant_type: 'authorization_code',
                scope: 'any',
                code_verifier: codeChallenge,
            }
        })
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(process.env.REACT_APP_CLIENT_ID + ':'));

        const response = await fetch(url, {method: 'POST', headers});
        const tokenResponse = await response.json();
        sessionStorage.setItem('token', tokenResponse.access_token);
        const expiry = Date.now() + tokenResponse.expires_in * 1000;
        sessionStorage.setItem('expiry', expiry.toString());
        const redirectPath = sessionStorage.getItem('redirect_path') || "/";
        sessionStorage.removeItem('redirect_path');
        authActions.userLoggedIn();

        history.push(redirectPath);
    }

    const revokeToken = async () => {
        let headers = getHeaders(true);

        const response = await fetch(revokeTokenEndpoint, {
            credentials: 'include',
            method: 'DELETE',
            mode: 'cors',
            headers
        })

        if (response.ok) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('expiry');
            authActions.userLoggedOut();
        }
    }

    async function getUserInfo() {
        let headers = getHeaders(true);

        const response = await fetch(userInfoEndpoint, {
            credentials: 'include',
            method: 'GET',
            headers
        })
        if (response.ok) {
            const res = await response.json();
            await authActions.setLoggedInUser(res.username);
        } else {
            await authActions.setAnonymousUser();
        }
    }

    async function fetchUserTodos(username: string, page: number) {
        let url = `${fetchUserTodosEndpoint}/${username}?page=${page}&size=${todoState.pageSize}`;
        await fetchTodos(url);
    }

    async function fetchAllTodos(page: number) {
        let url = `${fetchAllTodosEndpoint}?page=${page}&size=${todoState.pageSize}`;
        await fetchTodos(url);
    }


    async function searchTodos(searchValue: string, user?: string) {
        let url = searchTodosEndpoint + `?q=${searchValue.toLowerCase()}&page=0&size=${todoState.pageSize}`;
        if (user !== undefined) url += `&user=${user}`
        await fetchTodos(url);
    }


    async function fetchOneTodoForEdit(id: string): Promise<ITodo | void> {
        if (!tokenIsPresent() || tokenIsExpired()) {
            authenticate();
        } else {
            const headers = getHeaders(authState.authenticated);

            let url = `${fetchOneTodoEndpoint}/${id}`;
            const response = await fetch(url, {
                credentials: 'include',
                method: 'GET',
                headers,
            });

            if (response.ok) {
                return await response.json();
            }
        }
    }

    async function fetchTodos(url: string) {
        if (url.length > 0) {
            if (authState.authenticated && (!tokenIsPresent() || tokenIsExpired())) {
                authenticate();
            } else {
                try {
                    todoActions.loadTodosRequest();

                    const headers = getHeaders(authState.authenticated);
                    const response = await fetch(url, {
                        credentials: 'include',
                        method: 'GET',
                        headers,
                    });

                    if (response.ok) {
                        const res = await response.json();
                        const todos = safeGet(['_embedded', 'todoList'], res, []);
                        todoActions.loadTodos(todos);
                        setPaginations(res);
                    } else {
                        const errorMessage = await getErrorMessage(response);
                        todoActions.loadTodosFailure(errorMessage);
                    }
                } catch (e) {
                    console.error(e);
                    todoActions.loadTodosFailure(DEFAULT_ERROR_MESSAGE);
                }
            }
        }
    }

    async function submitNewTodo(title: string, description: string, priority: string): Promise<ITodo | void> {
        if (!tokenIsPresent() || tokenIsExpired()) {
            authenticate();
        } else {
            try {
                todoActions.submitTodoRequest()
                let headers = getHeaders(true, 'application/json');

                const response = await fetch(sumbitNewTodoEndpoint, {
                    credentials: 'include',
                    method: 'POST',
                    mode: 'cors',
                    body: JSON.stringify({
                        title,
                        description,
                        priority,
                    }),
                    headers
                });

                if (response.ok) {
                    const todo = await response.json();
                    todoActions.submitTodoSuccess(todo);
                    return todo;
                } else {
                    const errorMessage = await getErrorMessage(response);
                    todoActions.submitTodoFailure(errorMessage);
                }

            } catch (e) {
                console.error(e);
                todoActions.submitTodoFailure(DEFAULT_ERROR_MESSAGE);
            }
        }
    }

    async function updateTodo(title: string, description: string, priority: string): Promise<ITodo | void> {
        if (todoState.activeTodo !== undefined) {
            if (!tokenIsPresent() || tokenIsExpired()) {
                authenticate();
            } else {

                try {
                    todoActions.submitTodoRequest();
                    let headers = getHeaders(true, 'application/json');

                    const response = await fetch(todoState.activeTodo._links.edit.href, {
                        credentials: 'include',
                        method: 'PUT',
                        mode: 'cors',
                        body: JSON.stringify({
                            title,
                            description,
                            priority,
                        }),
                        headers
                    });

                    if (response.ok) {
                        const todo = await response.json();
                        todoActions.submitTodoSuccess(todo);
                        return todo;
                    } else {
                        const errorMessage = await getErrorMessage(response);
                        todoActions.submitTodoFailure(errorMessage);
                    }

                } catch (e) {
                    console.error(e);
                    todoActions.submitTodoFailure(DEFAULT_ERROR_MESSAGE);
                }
            }
        }
    }

    async function changeTodoStatus(link: string): Promise<ITodo | void> {
        if (!tokenIsPresent() || tokenIsExpired()) {
            authenticate();
        } else {
            try {
                todoActions.submitTodoRequest();
                let headers = getHeaders(true, 'application/json');

                const response = await fetch(link, {
                    credentials: 'include',
                    method: 'POST',
                    mode: 'cors',
                    headers
                })

                if (response.ok) {
                    const todo = await response.json();
                    todoActions.submitTodoSuccess(todo);
                    return todo;
                }
            } catch (e) {
                console.error(e);
                todoActions.submitTodoFailure(DEFAULT_ERROR_MESSAGE);
            }
        }
    }

    async function deleteTodo(id: number): Promise<boolean> {
        if (!tokenIsPresent() || tokenIsExpired()) {
            authenticate();
        } else {
            try {
                let headers = getHeaders(true, 'application/json');

                const response = await fetch(`${deleteTodoEndpoint}/${id}`, {
                    credentials: 'include',
                    method: 'DELETE',
                    mode: 'cors',
                    headers
                })

                if (response.ok) {
                    return true;
                }
            } catch (e) {
                return false;
            }
        }

        return false;
    }

    const downloadTodos = (searchValue = "", user?: string) => {
        let url = downloadTodosEndPoint + `?q=${searchValue.toLowerCase()}`;
        if (user !== undefined) url += `&user=${user}`
        window.location.assign(url);
    }

    function resetPaginations() {
        setPaginations(null);
    }

    async function getErrorMessage(response: Response): Promise<string> {
        const responseJson = await response.json();
        console.error(responseJson);

        if (response.status.toString() === "401") {
            return UNAUTHORIZED_MESSAGE;
        } else if (response.status.toString().startsWith("4")) {
            return responseJson.message || DEFAULT_ERROR_MESSAGE;
        } else {
            return DEFAULT_ERROR_MESSAGE;
        }
    }

    function setPaginations(res: any) {
        const pagingInfo: IPagingInfo = {
            first: safeGet(['_links', 'first', 'href'], res, ""),
            prev: safeGet(['_links', 'prev', 'href'], res, ""),
            self: safeGet(['_links', 'self', 'href'], res, ""),
            next: safeGet(['_links', 'next', 'href'], res, ""),
            last: safeGet(['_links', 'last', 'href'], res, ""),
            currentPage: safeGet(['page', 'number'], res, 0),
            totalPages: safeGet(['page', 'totalPages'], res, 0),
        }
        todoActions.setTodoPagingInfo(pagingInfo);
    }

    function getHeaders(addToken: boolean, contentType?: string) {
        const headers = new Headers();
        if (addToken) {
            const token = sessionStorage.getItem('token');
            if (token) {
                headers.append('Authorization', `Bearer ${token}`);
            }
        }
        if (contentType) {
            headers.append('Content-Type', contentType);
        }

        return headers;
    }

    function tokenIsPresent() {
        const token = sessionStorage.getItem('token');

        return token !== undefined;
    }

    function tokenIsExpired() {
        const expiry = parseInt(sessionStorage.getItem('expiry') as string);

        return isNaN(expiry) || expiry < Date.now();
    }

    return {
        authenticate,
        getToken,
        fetchUserTodos,
        fetchAllTodos,
        fetchOneTodoForEdit,
        searchTodos,
        fetchTodos,
        submitNewTodo,
        downloadTodos,
        updateTodo,
        changeTodoStatus,
        resetPaginations,
        getUserInfo,
        revokeToken,
        deleteTodo,
    }

}

export default useApi;