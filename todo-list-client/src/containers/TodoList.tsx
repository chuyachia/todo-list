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
    const [{auth, todo}, dispatch] = useStateValue();
    const {
        fetchUserTodos, fetchAllTodos, searchTodos, submitNewTodo, fetchTodos,
        updateTodo, downloadTodos, changeTodoStatus, getUserInfo, authenticate
    } = useApi();
    const {resetErrorState, setActiveTodo} = TodoActionCreater();

    const history = useHistory();
    const {search} = useLocation();
    const page = parsePageNumber(search);
    const showUser = match.params.username;

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const {value: searchValue, onChange: onSearchValueChange, reset: resetSearchValue} = useInput<HTMLInputElement>("");

    const handleEditTodo = (todo: ITodoItem) => {
        setActiveTodo(todo);
        history.push(`/edit/${todo.id}`);
    }

    const handleSubmitSearch = (value: string) => {
        if (showUser === undefined) {
            searchTodos(value);
        } else {
            searchTodos(value, showUser);
        }
    }

    const handleDownloadTodosClick = () => {
        if (!todo.loading) {
            downloadTodos(searchValue, showUser);
        }
    }

    const loadData = async (username: string) => {
        if (!auth.authenticated) {
            await getUserInfo();
        }
        if (!auth.authenticated || !username) {
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
        loadData(showUser);
    }, [showUser, page])

    return (
        <div className={"todo-list"}>
            {todo.loading && <i className={"inactive-text loader"}>Loading...</i>}
            {auth.authenticated && <div className={"todos-navigation"}>
                <NavLink exact to={`/todos?page=0`}>All Todos</NavLink>
                {" / "}
                <NavLink exact to={`/todos/${auth.username}?page=0`}>My Todos</NavLink>
            </div>}
            <div className={"tools-bar vertical-buttons-wrap"}>
                {auth.authenticated ?
                    <button title="Logout" className={`${todo.loading ? "disabled" : "primary"}`}>
                        <FontAwesomeIcon icon={faSignOutAlt}/>
                    </button> :
                    <button title="Login" className={`${todo.loading ? "disabled" : "primary"}`}
                            onClick={()=> authenticate()}>
                        <FontAwesomeIcon icon={faSignInAlt}/>
                    </button>}
                {auth.authenticated?
                    <Link to={{ pathname: '/edit', state: {from: location} }}>
                        <button title="Add todo" className={`${todo.loading? "disabled": "primary"}`}>
                            <FontAwesomeIcon icon={faPlus}/>
                        </button>
                    </Link> :
                    <button title="Add todo" className={`${todo.loading? "disabled": "primary"}`}
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
            <div>{todo.todos.map((t: ITodo) => (
                <TodoItem
                    key={hashCode(t.title + t.description + t.priority + Object.keys(t._links).length)}
                    todo={t}
                    onEdit={handleEditTodo}
                    loading={todo.loading}
                    onChangeStatus={changeTodoStatus}
                />))}
            </div>
            <Pagination
                onFirstPageClick={() => fetchTodos(todo.firstPageUrl)}
                onPrevPageClick={() => fetchTodos(todo.prevPageUrl)}
                onNextPageClick={() => fetchTodos(todo.nextPageUrl)}
                onLastPageClick={() => fetchTodos(todo.lastPageUrl)}
                currentPage={todo.currentPage + 1}
                totalPages={todo.totalPages}
            />
        </div>)
}

export default TodoList;