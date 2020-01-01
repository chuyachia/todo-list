import React, {Dispatch} from 'react';
import ITodo from '../models/ITodo';
import safeGet from '../util/safeGet';

interface ITodos {
    todos: ITodo[];
    fetchUserTodos: (username: string) => void;
    fetchAllTodos: () => void;
    searchTodos: (searchValue: string, user?: string) => void;
    fetchTodos: (url: string) => void;
    submitNewTodo: (title: string, description: string, priority: string) => Promise<ITodo | null>;
    updateTodo: (title: string, description: string, priority: string) => Promise<ITodo | null>;
    submitError: boolean;
    fetchError: boolean;
    editTodo: (todo: ITodo | undefined) => void;
    activeTodo: ITodo | undefined;
    errorMessage: string;
    size: number;
    setSize: Dispatch<number>;
    currentPage: number;
    totalPages: number;
    nextPageUrl: string;
    prevPageUrl: string;
    firstPageUrl: string;
    lastPageUrl: string;
    currentPageUrl: string;
    downloadTodos: (searchValue?: string, user?: string) => void;
    loading: boolean;
    changeTodoStatus: (url:string)=> Promise<ITodo|null>;
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again later.";
const fetchOptions: RequestInit = {credentials: 'include', mode: 'cors'};

const useTodo = (
    fetchAllTodosEndpoint: string,
    fetchUserTodosEndpoint: string,
    sumbitNewTodoEndpoint: string,
    searchTodosEndpoint: string,
    downloadTodosEndPoint: string,
    defaultDisplaySize?: number): ITodos => {
    const [todos, setTodos] = React.useState([])
    const [activeTodo, setActiveTodo] = React.useState<ITodo | undefined>(undefined);
    const [submitError, setSubmitError] = React.useState(false);
    const [fetchError, setFetchError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(DEFAULT_ERROR_MESSAGE);
    const [size, setSize] = React.useState(defaultDisplaySize || 5);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [currentPageUrl, setCurrentPageUrl] = React.useState("");
    const [nextPageUrl, setNextPageUrl] = React.useState("");
    const [prevPageUrl, setPrevPageUrl] = React.useState("");
    const [firstPageUrl, setFirstPageUrl] = React.useState("");
    const [lastPageUrl, setLastPageUrl] = React.useState("");
    const [loading, setLoading] = React.useState(false);



    async function fetchUserTodos(username: string) {
        try {
            setLoading(true);
            setFetchError(false);
            let url = `${fetchUserTodosEndpoint}/${username}?page=0&size=${size}`;
            const response = await fetch(url, {
                ...fetchOptions,
                method: 'GET',
            });

            if (response.ok) {
                const todos = await response.json();
                setTodos(safeGet(['_embedded', 'todoList'], todos, []));
                _setPaginations(todos);
            } else {
                setFetchError(true);
                _setErrorMessage(response);
            }
        } catch (e) {
            console.error(e);
            setFetchError(true);
            setErrorMessage(DEFAULT_ERROR_MESSAGE);
        } finally {
            setLoading(false);
        }
    }

    async function fetchAllTodos() {
        try {
            setLoading(true);
            setFetchError(false);
            let url = `${fetchAllTodosEndpoint}?page=0&size=${size}`;
            const response = await fetch(url, {
                ...fetchOptions,
                method: 'GET',
            });

            if (response.ok) {
                const todos = await response.json();
                setTodos(safeGet(['_embedded', 'todoList'], todos, []));
                _setPaginations(todos);
            } else {
                setFetchError(true);
                _setErrorMessage(response);
            }
        } catch (e) {
            console.error(e);
            setFetchError(true);
            setErrorMessage(DEFAULT_ERROR_MESSAGE);
        } finally {
            setLoading(false);
        }
    }

    async function searchTodos(searchValue: string, user?: string) {
        try {
            setLoading(true);
            setFetchError(false);
            let url = searchTodosEndpoint + `?q=${searchValue.toLowerCase()}&page=0&size=${size}`;
            if (user !== undefined) url += `&user=${user}`
            const response = await fetch(url, {
                ...fetchOptions,
                method: 'GET',
            });

            if (response.ok) {
                const todos = await response.json();
                setTodos(safeGet(['_embedded', 'todoList'], todos, []));
                _setPaginations(todos);
            } else {
                setFetchError(true);
                _setErrorMessage(response);
            }
        } catch (e) {
            console.error(e);
            setFetchError(true);
            setErrorMessage(DEFAULT_ERROR_MESSAGE);
        } finally {
            setLoading(false);
        }
    }

    async function fetchTodos(url: string) {
        if (url.length > 0) {
            try {
                setLoading(true);
                setFetchError(false);
                const response = await fetch(url, {
                    ...fetchOptions,
                    method: 'GET',
                });

                if (response.ok) {
                    const todos = await response.json();
                    setTodos(safeGet(['_embedded', 'todoList'], todos, []));
                    _setPaginations(todos);
                } else {
                    setFetchError(true);
                    _setErrorMessage(response);
                }
            } catch (e) {
                console.error(e);
                setFetchError(true);
                setErrorMessage(DEFAULT_ERROR_MESSAGE);
            } finally {
                setLoading(false);
            }
        }
    }

    async function submitNewTodo(title: string, description: string, priority: string): Promise<ITodo | null> {
        try {
            setLoading(true);
            setSubmitError(false);
            const response = await fetch(sumbitNewTodoEndpoint, {
                ...fetchOptions,
                method: 'POST',
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
        } finally {
            setLoading(false);
        }
        return Promise.resolve(null);
    }

    async function updateTodo(title: string, description: string, priority: string): Promise<ITodo | null> {
        if (activeTodo !== undefined) {
            try {
                setLoading(true);
                setSubmitError(false);
                const response = await fetch(activeTodo._links.edit.href, {
                    ...fetchOptions,
                    method: 'PUT',
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
            } finally {
                setLoading(false);
            }
        }
        return Promise.resolve(null);
    }

    async function changeTodoStatus(link: string): Promise<ITodo|null> {
        let todo = null;
        try {
            setLoading(true);
            const changeStatus = await fetch(link, {
                ...fetchOptions,
                method: 'POST',
            })

            if (changeStatus.ok) {
                todo = changeStatus.json();
            }
        } catch (e) {
            console.error(e);
            setSubmitError(true);
            setErrorMessage(DEFAULT_ERROR_MESSAGE);
        } finally {
            setLoading(false);
        }
        
        return todo;
    }

    const downloadTodos = (searchValue = "", user?: string) => {
        let url = downloadTodosEndPoint + `?q=${searchValue.toLowerCase()}`;
        if (user !== undefined) url += `&user=${user}`
        window.location.assign(url);
    }

    const editTodo = (todo: ITodo | undefined) => {
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

    function _setPaginations(todos: any) {
        setFirstPageUrl(safeGet(['_links', 'first', 'href'], todos, ""));
        setPrevPageUrl(safeGet(['_links', 'prev', 'href'], todos, ""));
        setCurrentPageUrl(safeGet(['_links', 'self', 'href'], todos, ""));
        setNextPageUrl(safeGet(['_links', 'next', 'href'], todos, ""));
        setLastPageUrl(safeGet(['_links', 'last', 'href'], todos, ""));
        setCurrentPage(safeGet(['page', 'number'], todos, 0));
        setTotalPages(safeGet(['page', 'totalPages'], todos, 0));
    }

    return {
        todos,
        fetchUserTodos,
        fetchAllTodos,
        searchTodos,
        fetchTodos,
        submitNewTodo,
        downloadTodos,
        submitError,
        fetchError,
        editTodo,
        activeTodo,
        updateTodo,
        errorMessage,
        size,
        setSize,
        totalPages,
        currentPage,
        prevPageUrl,
        firstPageUrl,
        currentPageUrl,
        nextPageUrl,
        lastPageUrl,
        loading,
        changeTodoStatus
    }

}

export default useTodo;