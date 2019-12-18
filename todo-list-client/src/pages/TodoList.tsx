import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFastBackward, faFileDownload, faPlus, faSearch, faStepBackward} from '@fortawesome/free-solid-svg-icons'

import TodoItemForm from '../components/TodoItemForm';
import TodoItem from '../components/TodoItem';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import useTodo from "../hooks/useTodo";
import ITodoItem from "../models/ITodo";
import hashCode from '../util/hashCode';
import {faStepForward} from "@fortawesome/free-solid-svg-icons/faStepForward";
import {faFastForward} from "@fortawesome/free-solid-svg-icons/faFastForward";

interface ITodoListProps {
    authenticated: boolean;
    username: string;
}

const TodoList: React.FC<ITodoListProps> = (props) => {
    const {
        todos, fetchUserTodos, fetchAllTodos, searchTodos, submitNewTodo, fetchTodos,
        submitError, fetchError, activeTodo, editTodo, updateTodo, errorMessage,
        size, setSize, totalPages, currentPage, prevPageUrl, firstPageUrl, nextPageUrl, lastPageUrl
    } = useTodo(
        process.env.REACT_APP_TODO_LIST_API_DEV + '/api/todos',
        process.env.REACT_APP_TODO_LIST_API_DEV + '/api/todos/user',
        process.env.REACT_APP_TODO_LIST_API_DEV + '/api/todos',
        process.env.REACT_APP_TODO_LIST_API_DEV + '/api/todos/search',
        5,
    );
    const [isEdit, setIsEdit] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showAllTodos, setShowAllTodos] = useState(false);


    const handleBack = () => {
        setIsEdit(false);
        editTodo(undefined);
        if (showAllTodos) {
            fetchAllTodos();
        } else {
            fetchUserTodos(props.username);
        }
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

    useEffect(() => {
        if (props.username.length > 0) {
            if (!showAllTodos) {
                fetchUserTodos(props.username);
            } else {
                fetchAllTodos();
            }
        }
    }, [props.authenticated, props.username, showAllTodos])

    return (
        <div className={"todo-list"}>{isEdit ?
            <TodoItemForm onBack={handleBack} onSubmit={activeTodo !== undefined ? updateTodo : submitNewTodo}
                          submitError={submitError} todo={activeTodo} errorMessage={errorMessage}/>
            : <>
                <div>
                    <span onClick={() => setShowAllTodos(false)}
                          className={`clickable ${showAllTodos ? 'inactive-text' : 'active-text'}`}>My Todos</span>
                    {" / "}
                    <span onClick={() => setShowAllTodos(true)}
                          className={`clickable ${showAllTodos ? 'active-text' : 'inactive-text'}`}>All Todos</span>
                </div>
                <div className={"tools-bar vertical-buttons-wrap"}>
                    <button title="Add new todo" className={"primary"} onClick={() => setIsEdit(true)}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                    <div>
                        {isSearchOpen && <SearchInput onBlur={() => setIsSearchOpen(false)}
                                                      submitSearch={handleSubmitSearch}/>}
                        <button title="Search todos" className={"primary"}
                                onClick={() => setIsSearchOpen(!isSearchOpen)}>
                            <FontAwesomeIcon icon={faSearch}/>
                        </button>
                    </div>
                    <button title="Download todos" className={"primary"} onClick={() => setIsEdit(true)}>
                        <FontAwesomeIcon icon={faFileDownload}/>
                    </button>
                </div>
                {fetchError && <i className={"warning-text"}>{errorMessage}</i>}
                <div>{todos.map(todo => <TodoItem key={hashCode(todo.title + todo.description + todo.priority)}
                                                  todo={todo} onEdit={handleEditTodo}/>)}</div>
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