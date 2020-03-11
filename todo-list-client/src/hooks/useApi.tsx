import React from 'react';
import queryString from "query-string";

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
    fetchOneTodo: (id: string) => Promise<ITodo | null>;
    submitNewTodo: (title: string, description: string, priority: string) => Promise<ITodo | null>;
    updateTodo: (title: string, description: string, priority: string) => Promise<ITodo | null>;
    downloadTodos: (searchValue?: string, user?: string) => void;
    changeTodoStatus: (url: string) => Promise<ITodo | null>;
    resetPaginations: () => void;
    getUserInfo: () => void;
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
        userInfoEndpoint = process.env.REACT_APP_TODO_LIST_API + '/user-info',
        authorizeEndpoint = process.env.REACT_APP_OAUTH_SERVER_AUTHORIZE,
        getTokenEndpoint = process.env.REACT_APP_OAUTH_SERVER_TOKEN;

    const [{todo: todoState, auth: authState}, _] = useStateValue();
    const authActions = AuthActionCreater();
    const todoActions = TodoActionCreater();

    const authenticate = () => {
        const randomString = Math.random().toString(36).substring(7);
        sessionStorage.setItem('code_challenge', randomString);
        sessionStorage.setItem('redirect_path', window.location.pathname + window.location.search);

        const url = queryString.stringifyUrl({
            url: authorizeEndpoint as string,
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
            url: getTokenEndpoint as string,
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

        window.location.href = redirectPath;
    }

    async function getUserInfo() {
        getNewTokenIfNeeded();

        let headers = getHeaders();

        const response = await fetch(userInfoEndpoint, {
            credentials: 'include',
            method: 'GET',
            headers
        })
        if (response.ok) {
            const res = await response.json();
            authActions.setLoggedInUser(res.username);
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


    async function fetchOneTodo(id: string): Promise<ITodo | null> {
        getNewTokenIfNeeded();

        let url = `${fetchOneTodoEndpoint}/${id}`;
        let headers = getHeaders();
        const response = await fetch(url, {
            credentials: 'include',
            method: 'GET',
            headers
        });

        if (response.ok) {
            return await response.json();
        } else {
            return null;
        }
    }

    async function fetchTodos(url: string) {
        getNewTokenIfNeeded();

        if (url.length > 0) {
            try {
                todoActions.loadTodosRequest();
                let headers = getHeaders();

                const response = await fetch(url, {
                    credentials: 'include',
                    method: 'GET',
                    headers
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

    async function submitNewTodo(title: string, description: string, priority: string): Promise<ITodo | null> {
        getNewTokenIfNeeded();

        try {
            todoActions.submitTodoRequest()
            let headers = getHeaders('application/json');

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

        return Promise.resolve(null);
    }

    async function updateTodo(title: string, description: string, priority: string): Promise<ITodo | null> {
        if (todoState.activeTodo !== undefined) {
            getNewTokenIfNeeded();

            try {
                todoActions.submitTodoRequest();
                let headers = getHeaders('application/json');

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
        return Promise.resolve(null);
    }

    async function changeTodoStatus(link: string): Promise<ITodo | null> {
        getNewTokenIfNeeded();

        let todo = null;
        try {
            todoActions.submitTodoRequest();
            let headers = getHeaders('application/json');

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

        return todo;
    }

    const downloadTodos = (searchValue = "", user?: string) => {
        getNewTokenIfNeeded();

        let url = downloadTodosEndPoint + `?q=${searchValue.toLowerCase()}`;
        if (user !== undefined) url += `&user=${user}`
        window.location.assign(url);
    }

    function resetPaginations() {
        setPaginations(null);
    }

    async function getErrorMessage(response: Response): Promise<string> {
        if (response.status.toString() === "401") {
            return UNAUTHORIZED_MESSAGE;
        } else if (response.status.toString().startsWith("4")) {
            const res = await response.json();
            return res.message || DEFAULT_ERROR_MESSAGE;
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

    function getHeaders(contentType?: string) {
        const headers = new Headers();
        const token = sessionStorage.getItem('token');
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }
        if (contentType) {
            headers.append('Content-Type', contentType);
        }

        return headers;
    }

    function getNewTokenIfNeeded() {
        const token = sessionStorage.getItem('token');
        if (token) {
            const expiry = parseInt(sessionStorage.getItem('expiry') as string);
            if (isNaN(expiry) || expiry < Date.now()) {
                console.info('Token expired. Fetching new token');
                authenticate();
            }
        }
    }

    return {
        authenticate,
        getToken,
        fetchUserTodos,
        fetchAllTodos,
        fetchOneTodo,
        searchTodos,
        fetchTodos,
        submitNewTodo,
        downloadTodos,
        updateTodo,
        changeTodoStatus,
        resetPaginations,
        getUserInfo,
    }

}

export default useApi;