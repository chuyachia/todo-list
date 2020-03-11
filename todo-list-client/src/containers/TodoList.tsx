import React, {useEffect, useState} from 'react';
import {RouteComponentProps, useLocation, Link, useHistory, NavLink} from'react-router-dom';
import queryString from "query-string";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFileDownload, faPlus, faSearch, faSignInAlt, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'

import TodoItem from '../components/TodoItem';
import Pagination from '../components/Pagination';

import {useStateValue} from '../state';
import useApi from "../hooks/useApi";
import useInput from "../hooks/useInput";
import ITodoItem from "../models/ITodo";
import hashCode from '../util/hashCode';
import {IState} from "../states";
import ITodo from "../models/ITodo";
import {TodoActionCreater} from "../actions";

const TodoItemForm = React.lazy(() => import('../components/TodoItemForm'));
const SearchInput = React.lazy(() => import('../components/SearchInput'));

interface IRouteProps {
    username: string;
}

const TodoList: React.FC<RouteComponentProps<IRouteProps>> = ({match, location}) => {
    const [{auth: authState, todo: todoState}, _] = useStateValue();
    const {
        fetchUserTodos, fetchAllTodos, searchTodos, submitNewTodo, fetchTodos,
        updateTodo, downloadTodos, changeTodoStatus, getUserInfo, authenticate
    } = useApi();
    const {setActiveTodo} = TodoActionCreater();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const {value: searchValue, onChange: onSearchValueChange, reset: resetSearchValue} = useInput<HTMLInputElement>("");

    const history = useHistory();
    const {search} = useLocation();
    const page = parsePageNumber(search);
    const showTodoUser = match.params.username;

    const handleEditTodo = (todo: ITodoItem) => {
        setActiveTodo(todo);
        history.push(`/edit/${todo.id}`);
    }

    const handleSubmitSearch = (value: string) => {
        if (showTodoUser === undefined) {
            searchTodos(value);
        } else {
            searchTodos(value, showTodoUser);
        }
    }

    const handleDownloadTodosClick = () => {
        if (!todoState.loading) {
            downloadTodos(searchValue, showTodoUser);
        }
    }

    const loadData = async (username: string, page: number) => {
        if (!authState.authenticated) {
            await getUserInfo();
        }
        if (!authState.authenticated || !username) {
            await fetchAllTodos(page);
        } else {
            await fetchUserTodos(username, page);
        }
    }

    function parsePageNumber(search:string) {
        let {page} = queryString.parse(search);
        if (Array.isArray(page)) {
            page = page[0];
        }
        let pageNumber = parseInt(page as string);
        if (isNaN(pageNumber)) {
            pageNumber = 0;
        }

        return pageNumber;
    }

    useEffect(() => {
        loadData(showTodoUser, page);
    }, [showTodoUser, page])

    return (
        <div className={"todo-list"}>
            {todoState.loading && <i className={"inactive-text loader"}>Loading...</i>}
            {authState.authenticated && <div className={"todos-navigation"}>
                <NavLink exact to={`/todos?page=0`}>All Todos</NavLink>
                {" / "}
                <NavLink exact to={`/todos/${authState.username}?page=0`}>My Todos</NavLink>
            </div>}
            <div className={"tools-bar vertical-buttons-wrap"}>
                {authState.authenticated ?
                    <button title="Logout" className={`${todoState.loading ? "disabled" : "primary"}`}>
                        <FontAwesomeIcon icon={faSignOutAlt}/>
                    </button> :
                    <button title="Login" className={`${todoState.loading ? "disabled" : "primary"}`} onClick={()=> authenticate()}>
                        <FontAwesomeIcon icon={faSignInAlt}/>
                    </button>}
                {authState.authenticated?
                    <Link to={{ pathname: '/edit', state: {from: location} }}>
                        <button title="Add todo" className={`${todoState.loading? "disabled": "primary"}`}>
                            <FontAwesomeIcon icon={faPlus}/>
                        </button>
                    </Link> :
                    <button title="Add todo" className={`${todoState.loading? "disabled": "primary"}`}
                            onClick={()=>alert("Please log in to add todo")}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>}
                <div>
                    {isSearchOpen &&
                    <React.Suspense fallback={<i className={"inactive-text loader"}>Loading...</i>}>
                        <SearchInput
                            onClose={() => setIsSearchOpen(false)}
                            value={searchValue}
                            onChange={onSearchValueChange}
                            submitSearch={handleSubmitSearch}
                        />
                    </React.Suspense>}
                    <button title="Search todos" className={`${todoState.loading ? "disabled" : "primary"}`}
                            onClick={() => !todoState.loading && setIsSearchOpen(!isSearchOpen)}>
                        <FontAwesomeIcon icon={faSearch}/>
                    </button>
                </div>
                <button title="Download todos" className={`${todoState.loading ? "disabled" : "primary"}`}
                        onClick={handleDownloadTodosClick}>
                    <FontAwesomeIcon icon={faFileDownload}/>
                </button>
            </div>
            {todoState.loadTodoError && <i className={"warning-text"}>{todoState.errorMessage}</i>}
            <div>{todoState.todos.map((todo: ITodo) => (
                <TodoItem
                    key={hashCode(todo.title + todo.description + todo.priority + Object.keys(todo._links).length)}
                    todo={todo}
                    onEdit={handleEditTodo}
                    loading={todoState.loading}
                    onChangeStatus={changeTodoStatus}
                />))}
            </div>
            <Pagination
                onFirstPageClick={() => history.push(location.pathname+`?page=${0}`)}
                onPrevPageClick={() => history.push(location.pathname+`?page=${page-1}`)}
                onNextPageClick={() => history.push(location.pathname+`?page=${page+1}`)}
                onLastPageClick={() => history.push(location.pathname+`?page=${todoState.totalPages<=1?0:todoState.totalPages-1}`)}
                currentPage={todoState.currentPage + 1}
                totalPages={todoState.totalPages === 0?1:todoState.totalPages }
            />
        </div>)
}

export default TodoList;