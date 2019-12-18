import React from 'react';
import ITodoItem from '../models/ITodo';
import safeGet from '../util/safeGet';

interface ITodos {
    todos: ITodoItem[];
    fetchUserTodos: (username: string) => void;
    fetchAllTodos: () => void;
    searchTodos: (searchValue: string, user?: string) => void;
    submitNewTodo: (title: string, description: string, priority: string) => Promise<ITodoItem | null>;
    updateTodo: (title: string, description: string, priority: string) => Promise<ITodoItem | null>;
    submitError: boolean;
    fetchError: boolean;
    editTodo: (todo: ITodoItem | undefined) => void;
    activeTodo: ITodoItem | undefined;
    errorMessage: string;
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again later.";

const useTodo = (
    fetchAllTodosEndpoint: string,
    fetchUserTodosEndpoint: string,
    sumbitNewTodoEndpoint: string,
    searchTodosEndpoint: string): ITodos => {
    const [todos, setTodos] = React.useState([])
    const [activeTodo, setActiveTodo] = React.useState<ITodoItem | undefined>(undefined);
    const [submitError, setSubmitError] = React.useState(false);
    const [fetchError, setFetchError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(DEFAULT_ERROR_MESSAGE);

    async function fetchUserTodos(username: string) {
        try {
            setFetchError(false);
            let url = `${fetchUserTodosEndpoint}/${username}`;
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const todos = await response.json();
                setTodos(safeGet(['_embedded', 'todoList'], todos, []));
            } else {
                setFetchError(true);
                _setErrorMessage(response);
            }
        } catch (e) {
            console.error(e);
            setFetchError(true);
            setErrorMessage(DEFAULT_ERROR_MESSAGE);
        }
    }

    async function fetchAllTodos() {
        try {
            setFetchError(false);
            let url = fetchAllTodosEndpoint;
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const todos = await response.json();
                setTodos(safeGet(['_embedded', 'todoList'], todos, []));
            } else {
                setFetchError(true);
                _setErrorMessage(response);
            }
        } catch (e) {
            console.error(e);
            setFetchError(true);
            setErrorMessage(DEFAULT_ERROR_MESSAGE);
        }
    }

    async function searchTodos(searchValue: string, user?: string) {
        try {
            setFetchError(false);
            let url = searchTodosEndpoint + `?q=${searchValue.toLowerCase()}`;
            if (user !== undefined) url += `&user=${user}`
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const todos = await response.json();
                setTodos(safeGet(['_embedded', 'todoList'], todos, []));
            } else {
                setFetchError(true);
                _setErrorMessage(response);
            }
        } catch (e) {
            console.error(e);
            setFetchError(true);
            setErrorMessage(DEFAULT_ERROR_MESSAGE);
        }
    }

    async function submitNewTodo(title: string, description: string, priority: string): Promise<ITodoItem | null> {
        try {
            setSubmitError(false);
            const response = await fetch(sumbitNewTodoEndpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    priority,
                })
            });

            if (response.ok) {
                if (activeTodo !== undefined) setActiveTodo(undefined);
                return await response.json();
            } else {
                setSubmitError(true);
                _setErrorMessage(response);
            }

        } catch (e) {
            console.error(e);
            setSubmitError(true);
            setErrorMessage(DEFAULT_ERROR_MESSAGE);
        }
        return Promise.resolve(null);
    }

    async function updateTodo(title: string, description: string, priority: string): Promise<ITodoItem | null> {
        if (activeTodo !== undefined) {
            try {
                setSubmitError(false);
                const response = await fetch(activeTodo._links.edit.href, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        priority,
                    })
                });

                if (response.ok) {
                    if (activeTodo !== undefined) setActiveTodo(undefined);
                    return await response.json();
                } else {
                    setSubmitError(true);
                    _setErrorMessage(response);
                }

            } catch (e) {
                console.error(e);
                setSubmitError(true);
                setErrorMessage(DEFAULT_ERROR_MESSAGE);
            }
        }
        return Promise.resolve(null);
    }

    const editTodo = (todo: ITodoItem | undefined) => {
        setActiveTodo(todo);
    }

    async function _setErrorMessage(response: Response) {
        setSubmitError(true);
        if (response.status.toString().startsWith("4")) {
            const error = await response.json();
            setErrorMessage(error.message);
        } else {
            setErrorMessage(DEFAULT_ERROR_MESSAGE);
        }
    }

    return {
        todos,
        fetchUserTodos,
        fetchAllTodos,
        searchTodos,
        submitNewTodo,
        submitError,
        fetchError,
        editTodo,
        activeTodo,
        updateTodo,
        errorMessage,
    }

}

export default useTodo;