import React from 'react';
import ITodo from '../models/ITodo';
import safeGet from '../util/safeGet';
import {AuthActionCreater, TodoActionCreater} from "../actions";
import {useStateValue} from "../state";
import {IPagingInfo} from "../models/IPagingInfo";

interface ITodoApis {
    fetchUserTodos: (username: string) => void;
    fetchAllTodos: () => void;
    searchTodos: (searchValue: string, user?: string) => void;
    fetchTodos: (url: string) => void;
    submitNewTodo: (title: string, description: string, priority: string) => Promise<ITodo | null>;
    updateTodo: (title: string, description: string, priority: string) => Promise<ITodo | null>;
    downloadTodos: (searchValue?: string, user?: string) => void;
    changeTodoStatus: (url: string) => Promise<ITodo | null>;
    resetPaginations: () => void;
    getUserInfo: () => void;
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again later.";


const useApi = (
    fetchAllTodosEndpoint: string,
    fetchUserTodosEndpoint: string,
    sumbitNewTodoEndpoint: string,
    searchTodosEndpoint: string,
    downloadTodosEndPoint: string,
    userInfoEndpoint: string): ITodoApis => {

    const token = sessionStorage.getItem('token');

    const [{todo: todoState}, _] = useStateValue();
    const authActions = AuthActionCreater();
    const todoActions = TodoActionCreater();

    async function getUserInfo() {
        let headers = _getHeaders();

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

    async function fetchUserTodos(username: string) {
        let url = `${fetchUserTodosEndpoint}/${username}?page=0&size=${todoState.pageSize}`;
        await fetchTodos(url);
    }

    async function fetchAllTodos() {
        let url = `${fetchAllTodosEndpoint}?page=0&size=${todoState.pageSize}`;
        await fetchTodos(url);
    }

    async function searchTodos(searchValue: string, user?: string) {
        let url = searchTodosEndpoint + `?q=${searchValue.toLowerCase()}&page=0&size=${todoState.pageSize}`;
        if (user !== undefined) url += `&user=${user}`
        await fetchTodos(url);
    }

    async function fetchTodos(url: string) {
        if (url.length > 0) {
            try {
                todoActions.loadTodosRequest();
                let headers = _getHeaders();

                const response = await fetch(url, {
                    credentials: 'include',
                    method: 'GET',
                    headers
                });

                if (response.ok) {
                    const res = await response.json();
                    const todos = safeGet(['_embedded', 'todoList'], res, []);
                    todoActions.loadTodos(todos);
                    _setPaginations(res);
                } else {
                    const errorMessage = await _getErrorMessage(response);
                    todoActions.loadTodosFailure(errorMessage);
                }
            } catch (e) {
                console.error(e);
                todoActions.loadTodosFailure(DEFAULT_ERROR_MESSAGE);
            }
        }
    }

    async function submitNewTodo(title: string, description: string, priority: string): Promise<ITodo | null> {
        try {
            todoActions.submitTodoRequest()
            let headers = _getHeaders('application/json');

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
                const errorMessage = await _getErrorMessage(response);
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
            try {
                todoActions.submitTodoRequest();
                let headers = _getHeaders('application/json');

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
                    const errorMessage = await _getErrorMessage(response);
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
        let todo = null;
        try {
            todoActions.submitTodoRequest();
            let headers = _getHeaders('application/json');

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
        let url = downloadTodosEndPoint + `?q=${searchValue.toLowerCase()}`;
        if (user !== undefined) url += `&user=${user}`
        window.location.assign(url);
    }

    async function _getErrorMessage(response: Response): Promise<string> {
        if (response.status.toString().startsWith("4")) {
            const res = await response.json();
            return res.message || res.error_description || res.error || DEFAULT_ERROR_MESSAGE;
        } else {
            return DEFAULT_ERROR_MESSAGE;
        }
    }

    function _setPaginations(res: any) {
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

    function _getHeaders(contentType?: string) {
        const headers = new Headers();
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }
        if (contentType) {
            headers.append('Content-Type', contentType);
        }

        return headers;
    }

    function resetPaginations() {
        _setPaginations(null);
    }

    return {
        fetchUserTodos,
        fetchAllTodos,
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