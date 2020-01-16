import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFileDownload, faPlus, faSearch} from '@fortawesome/free-solid-svg-icons'

import TodoItem from '../components/TodoItem';
import Pagination from '../components/Pagination';

import useTodo from "../hooks/useTodo";
import useInput from "../hooks/useInput";
import ITodoItem from "../models/ITodo";
import hashCode from '../util/hashCode';

// dynamic imports
const TodoItemForm = React.lazy(() => import('../components/TodoItemForm'));
const SearchInput = React.lazy(() => import('../components/SearchInput'));

interface ITodoListProps {
    authenticated: boolean;
    username: string;
    showLogin: () => void;
}

const TodoList: React.FC<ITodoListProps> = (props) => {
    const {
        todos, fetchUserTodos, fetchAllTodos, searchTodos, submitNewTodo, fetchTodos,
        submitError, fetchError, activeTodo, editTodo, updateTodo, errorMessage,
        size, setSize, totalPages, currentPage, prevPageUrl, firstPageUrl, nextPageUrl, lastPageUrl,
        currentPageUrl, downloadTodos, loading, changeTodoStatus
    } = useTodo(
        process.env.REACT_APP_TODO_LIST_API + '/api/todos',
        process.env.REACT_APP_TODO_LIST_API + '/api/todos/user',
        process.env.REACT_APP_TODO_LIST_API + '/api/todos',
        process.env.REACT_APP_TODO_LIST_API + '/api/todos/search',
        process.env.REACT_APP_TODO_LIST_API + '/api/todos/file',
        5,
    );
    const [isEdit, setIsEdit] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showAllTodos, setShowAllTodos] = useState(true);
    const {value: searchValue, onChange: onSearchValueChange, reset: resetSearchValue} = useInput<HTMLInputElement>("");


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
            searchTodos(value, props.username);
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
        fetchUserTodos(props.username);
    }

    const handleEditTodoClick = () => {
        if (!loading) {
            if (props.authenticated) {
                setIsEdit(true);
            } else {
                props.showLogin();
            }
        }
    }

    const handleDownloadTodosClick = () => {
        if (!loading) {
            downloadTodos(searchValue, showAllTodos ? undefined : props.username);
        }
    }

    useEffect(() => {
        if (!props.authenticated || showAllTodos) {
            fetchAllTodos();
        } else if (props.username.length > 0) {
            fetchUserTodos(props.username);
        }
    }, [props.authenticated, props.username])

    useEffect(() => {
        if (!isEdit && currentPageUrl.length > 0) {
            console.log('fetch todos');
            fetchTodos(currentPageUrl);
        }
    }, [isEdit])

    return (
        <div className={"todo-list"}>
            {loading && <i className={"inactive-text loader"}>Loading...</i>}
            {isEdit ?
                <React.Suspense fallback={<i className={"inactive-text loader"}>Loading...</i>}>
                    <TodoItemForm onBack={handleBack} onSubmit={activeTodo !== undefined ? updateTodo : submitNewTodo}
                                  submitError={submitError} todo={activeTodo} errorMessage={errorMessage}
                                  loading={loading}/>
                </React.Suspense>
                : <>
                    {props.authenticated && <div>
                        <span onClick={handleShowMyTodosClick}
                              className={`clickable ${showAllTodos ? 'inactive-text' : 'active-text'}`}>My Todos</span>
                        {" / "}
                        <span onClick={handleShowAllTodosClick}
                              className={`clickable ${showAllTodos ? 'active-text' : 'inactive-text'}`}>All Todos</span>
                    </div>}
                    <div className={"tools-bar vertical-buttons-wrap"}>
                        <button title="Add new todo" className={`${loading ? "disabled" : "primary"}`}
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
                            <button title="Search todos" className={`${loading ? "disabled" : "primary"}`}
                                    onClick={() => !loading && setIsSearchOpen(!isSearchOpen)}>
                                <FontAwesomeIcon icon={faSearch}/>
                            </button>
                        </div>
                        <button title="Download todos" className={`${loading ? "disabled" : "primary"}`}
                                onClick={handleDownloadTodosClick}>
                            <FontAwesomeIcon icon={faFileDownload}/>
                        </button>
                    </div>
                    {fetchError && <i className={"warning-text"}>{errorMessage}</i>}
                    <div>{todos.map(todo => <TodoItem
                        key={hashCode(todo.title + todo.description + todo.priority + Object.keys(todo._links).length)}
                        todo={todo} onEdit={handleEditTodo} loading={loading}
                        onChangeStatus={changeTodoStatus}/>)}</div>
                    <Pagination onFirstPageClick={() => fetchTodos(firstPageUrl)}
                                onPrevPageClick={() => fetchTodos(prevPageUrl)}
                                onNextPageClick={() => fetchTodos(nextPageUrl)}
                                onLastPageClick={() => fetchTodos(lastPageUrl)}
                                currentPage={currentPage + 1}
                                totalPages={totalPages}/>
                </>}
        </div>)
}

export default TodoList;