import React from 'react';
import ITodo from '../models/ITodo';

interface ITodos {
    todos: ITodo[];
    fetchUserTodos: (username: string) => void;
    fetchAllTodos: () => void;
    submitNewTodo: (title: string, description: string, priority: string) => Promise<ITodo | null>;
    submitError: boolean;
    fetchError: boolean;
}

const useTodo = (fetchAllTodosEndpoint: string, fetchUserTodosEndpoint: string, sumbitNewTodoEndpoint: string): ITodos => {
    const [todos, setTodos] = React.useState([]);
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
                setTodos(todos._embedded.todoList);
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
                setTodos(todos._embedded.todoList);
            } else {
                setFetchError(true);
            }
        } catch (e) {
            console.error(e);
            setFetchError(true);
        }
    }

    async function submitNewTodo(title: string, description: string, priority: string): Promise<ITodo | null> {
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

    return {
        todos,
        fetchUserTodos,
        fetchAllTodos,
        submitNewTodo,
        submitError,
        fetchError,
    }

}

export default useTodo;