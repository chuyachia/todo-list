import React from 'react';
import ITodoItem from '../models/ITodo';
import safeGet from '../util/safeGet';

interface ITodos {
    todos: ITodoItem[];
    fetchUserTodos: (username: string) => void;
    fetchAllTodos: () => void;
    submitNewTodo: (title: string, description: string, priority: string) => Promise<ITodoItem | null>;
    updateTodo: (title: string, description: string, priority: string) => Promise<ITodoItem | null>;
    submitError: boolean;
    fetchError: boolean;
    editTodo: (todo: ITodoItem | undefined) => void;
    activeTodo: ITodoItem | undefined;
}

const useTodo = (fetchAllTodosEndpoint: string, fetchUserTodosEndpoint: string, sumbitNewTodoEndpoint: string): ITodos => {
    const [todos, setTodos] = React.useState([])
    const [activeTodo, setActiveTodo] = React.useState<ITodoItem | undefined>(undefined);
    const [submitError, setSubmitError] = React.useState(false);
    const [fetchError, setFetchError] = React.useState(false);

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
            }
        } catch (e) {
            console.error(e);
            setFetchError(true);
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
            }
        } catch (e) {
            console.error(e);
            setFetchError(true);
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
            }

        } catch (e) {
            console.error(e);
            setSubmitError(true);
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
                }

            } catch (e) {
                console.error(e);
                setSubmitError(true);
            }
        }
        return Promise.resolve(null);
    }

    const editTodo = (todo: ITodoItem | undefined) => {
        setActiveTodo(todo);
    }

    return {
        todos,
        fetchUserTodos,
        fetchAllTodos,
        submitNewTodo,
        submitError,
        fetchError,
        editTodo,
        activeTodo,
        updateTodo,
    }

}

export default useTodo;