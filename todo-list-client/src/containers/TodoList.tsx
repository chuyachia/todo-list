import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFileDownload, faPlus, faSearch} from '@fortawesome/free-solid-svg-icons'

import TodoItem from '../components/TodoItem';
import Pagination from '../components/Pagination';

import {useStateValue} from '../state';
import useApi from "../hooks/useApi";
import useInput from "../hooks/useInput";
import ITodoItem from "../models/ITodo";
import hashCode from '../util/hashCode';
import {IState} from "../states";
import {IAuthState} from "../states/authState";
import ITodo from "../models/ITodo";
import queryString from "query-string";

const TodoItemForm = React.lazy(() => import('../components/TodoItemForm'));
const SearchInput = React.lazy(() => import('../components/SearchInput'));

const TodoList: React.FC<{}> = () => {
    const [{auth, todo}, dispatch] = useStateValue();

    const {
        fetchUserTodos, fetchAllTodos, searchTodos, submitNewTodo, fetchTodos,
        editTodo, updateTodo, downloadTodos, changeTodoStatus, getUserInfo
    } = useApi(
        process.env.REACT_APP_TODO_LIST_API + '/api/todos',
        process.env.REACT_APP_TODO_LIST_API + '/api/todos/user',
        process.env.REACT_APP_TODO_LIST_API + '/api/todos',
        process.env.REACT_APP_TODO_LIST_API + '/api/todos/search',
        process.env.REACT_APP_TODO_LIST_API + '/api/todos/file',
        process.env.REACT_APP_TODO_LIST_API + '/user-info'
    );
    const [isEdit, setIsEdit] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showAllTodos, setShowAllTodos] = useState(true);
    const {value: searchValue, onChange: onSearchValueChange, reset: resetSearchValue} = useInput<HTMLInputElement>("");

    const logIn = () => {
        const randomString = Math.random().toString(36).substring(7);
        sessionStorage.setItem('code_challenge', randomString);
        console.log(process.env.REACT_APP_OAUTH_SERVER_AUTHORIZE);
        const url = queryString.stringifyUrl({
            url: process.env.REACT_APP_OAUTH_SERVER_AUTHORIZE as string,
            query: {
                client_id:  process.env.REACT_APP_CLIENT_ID,
                grant_type: 'authorization_code',
                response_type: 'code',
                scope: 'any',
                code_challenge: randomString
            }
        });

        window.location.assign(url);
    }

    const handleBack = () => {
        setIsEdit(false);
        editTodo(undefined);
    }

    const handleEditTodo = (todo: ITodoItem) => {
        editTodo(todo);
        setIsEdit(true);
    }

    const handleSubmitSearch = (value: string) => {
        if (showAllTodos) {
            searchTodos(value);
        } else {
            searchTodos(value, auth.username);
        }
    }

    const handleShowAllTodosClick = () => {
        setShowAllTodos(true);
        resetSearchValue();
        fetchAllTodos();
    }

    const handleShowMyTodosClick = () => {
        setShowAllTodos(false);
        resetSearchValue();
        fetchUserTodos(auth.username);
    }

    const handleEditTodoClick = () => {
        if (!todo.loading && auth.authenticated) {
            setIsEdit(true);
        }
    }

    const handleDownloadTodosClick = () => {
        if (!todo.loading) {
            downloadTodos(searchValue, showAllTodos ? undefined : auth.username);
        }
    }

    useEffect(()=> {
        getUserInfo();
    },[])

    useEffect(() => {
        if (!auth.authenticated) {
            fetchAllTodos();
        } else if (auth.username.length > 0) {
            fetchUserTodos(auth.username);
        }
    }, [])

    useEffect(() => {
        if (!isEdit && todo.currentPageUrl.length > 0) {
            fetchTodos(todo.currentPageUrl);
        }
    }, [isEdit])

    return (
        <div className={"todo-list"}>
            {auth.authenticated ?
                <small className={"clickable inactive-text"}>Logout</small> :
                <small className={"clickable"} onClick={()=> logIn()}>Login</small>}
            {todo.loading && <i className={"inactive-text loader"}>Loading...</i>}
            {isEdit ?
                <React.Suspense fallback={<i className={"inactive-text loader"}>Loading...</i>}>
                    <TodoItemForm onBack={handleBack} onSubmit={todo.activeTodo !== undefined ? updateTodo : submitNewTodo}
                                  submitError={todo.submitTodoError} todo={todo.activeTodo} errorMessage={todo.errorMessage}
                                  loading={todo.loading}/>
                </React.Suspense>
                : <>
                    {auth.authenticated && <div>
                        <span onClick={handleShowMyTodosClick}
                              className={`clickable ${showAllTodos ? 'inactive-text' : 'active-text'}`}>My Todos</span>
                        {" / "}
                        <span onClick={handleShowAllTodosClick}
                              className={`clickable ${showAllTodos ? 'active-text' : 'inactive-text'}`}>All Todos</span>
                    </div>}
                    <div className={"tools-bar vertical-buttons-wrap"}>
                        <button title={auth.authenticated?"Add new todo":"Please login to add new todo"}
                                className={`${todo.loading || !auth.authenticated? "disabled" : "primary"}`}
                                onClick={handleEditTodoClick}>
                            <FontAwesomeIcon icon={faPlus}/>
                        </button>
                        <div>
                            {isSearchOpen &&
                            <React.Suspense fallback={<i className={"inactive-text loader"}>Loading...</i>}>
                                <SearchInput onClose={() => setIsSearchOpen(false)}
                                             value={searchValue}
                                             onChange={onSearchValueChange}
                                             submitSearch={handleSubmitSearch}/>
                            </React.Suspense>}
                            <button title="Search todos" className={`${todo.loading ? "disabled" : "primary"}`}
                                    onClick={() => !todo.loading && setIsSearchOpen(!isSearchOpen)}>
                                <FontAwesomeIcon icon={faSearch}/>
                            </button>
                        </div>
                        <button title="Download todos" className={`${todo.loading ? "disabled" : "primary"}`}
                                onClick={handleDownloadTodosClick}>
                            <FontAwesomeIcon icon={faFileDownload}/>
                        </button>
                    </div>
                    {todo.loadTodoError && <i className={"warning-text"}>{todo.errorMessage}</i>}
                    <div>{todo.todos.map((t: ITodo) => <TodoItem
                        key={hashCode(t.title + t.description + t.priority + Object.keys(t._links).length)}
                        todo={t} onEdit={handleEditTodo} loading={todo.loading}
                        onChangeStatus={changeTodoStatus}/>)}</div>
                    <Pagination onFirstPageClick={() => fetchTodos(todo.firstPageUrl)}
                                onPrevPageClick={() => fetchTodos(todo.prevPageUrl)}
                                onNextPageClick={() => fetchTodos(todo.nextPageUrl)}
                                onLastPageClick={() => fetchTodos(todo.lastPageUrl)}
                                currentPage={todo.currentPage + 1}
                                totalPages={todo.totalPages}/>
                </>}
        </div>)
}

export default TodoList;