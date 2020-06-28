import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {RouteComponentProps, useLocation, Link, useHistory, NavLink} from'react-router-dom';
import queryString from 'query-string';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFileDownload, faPlus, faSearch, faSignInAlt, faSignOutAlt, faArrowDown, faArrowUp} from '@fortawesome/free-solid-svg-icons'

import TodoItem from '../components/TodoItem';
import Pagination from '../components/Pagination';
import Popup from '../components/Popup';

import {useStateValue} from '../state';
import {
    fetchUserTodos,
    fetchAllTodos,
    downloadTodos,
    changeTodoStatus,
    getUserInfo,
    authenticate,
    revokeToken,
    deleteTodo,
    getErrorMessage,
    ISort,
} from '../api';
import useInput from '../hooks/useInput';
import ITodoItem from '../models/ITodo';
import hashCode from '../util/hashCode';
import safeGet from '../util/safeGet';
import ITodo from '../models/ITodo';
import {AuthActionCreater, TodoActionCreater} from '../actions';
import {IPopup} from '../components/Popup';
import {IPagingInfo} from "../models/IPagingInfo";
import {DEFAULT_ERROR_MESSAGE} from "../constants";
import useDebounce from "../hooks/useDebounce";

const SearchInput = React.lazy(() => import('../components/SearchInput'));

interface IRouteProps {
    username: string;
}

const TodoList: React.FC<RouteComponentProps<IRouteProps>> = ({match, location}) => {
    // Global application state
    const [{auth: authState, todo: todoState}, _] = useStateValue();

    // Action dispather
    const authActions = AuthActionCreater();
    const todoActions = TodoActionCreater();

    // Local state
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [popupProps, setPopupProps] = useState<IPopup>({
        title: '',
        isOpen: false,
        description: '',
        leftButton: null,
        rightButton: null,
    });
    const [authenticationChecked, setAuthenticationChecked] = useState(false);
    const {value: searchValue, onChange: onSearchValueChange} = useInput<HTMLInputElement>('');
    const {value: sortValue, onChange: onSortValueChange} = useInput<HTMLSelectElement>('priority:desc');
    const history = useHistory();
    const {search, pathname} = useLocation();

    const [page, setPage] = useState(parsePageNumber(search));
    const showTodoUser = match.params.username;
    const isLoading = todoState.loading || authState.loading;

    const handleEditTodo = useCallback((todo: ITodoItem) => {
        todoActions.setActiveTodo(todo);
        history.push(`/edit/${todo.id}`, {from : pathname+ search});
    },[pathname, search])

    const handleCloseDeleteTodoPopup = useCallback(() => {
        setPopupProps({...popupProps, isOpen: false})
        loadData(showTodoUser, page, searchValue, sortValue, authenticationChecked);
    }, [showTodoUser, page, authenticationChecked, setPopupProps])

    const handleConfirmDeleteTodo = useCallback(async (todo: ITodoItem) => {
        if (todo && todo.id) {
            const response = await deleteTodo(todo.id);
            if (response !== undefined && response.ok) {
                setPopupProps({
                    title: 'Deleted',
                    description: `Todo item ${safeGet(['title'],todo,'')} deleted`,
                    leftButton: <button className={'action'} onClick={handleCloseDeleteTodoPopup}>OK</button>,
                    rightButton: null,
                    isOpen: true,
                })
            } else {
                setPopupProps({
                    title: 'Error deleting',
                    description: `Something went wrong thile deleting todo item ${safeGet(['title'],todo,'')} `,
                    leftButton: <button className={'action'} onClick={() =>setPopupProps({...popupProps, isOpen: false})}>OK</button>,
                    rightButton: null,
                    isOpen: true,
                })
            }
        }
    }, [handleCloseDeleteTodoPopup, setPopupProps, deleteTodo])



    const handleDeleteTodo = useCallback((todo: ITodoItem) => {
        setPopupProps({
            isOpen: true,
            title: 'Delete Todo Item',
            description: `Are you sure you want to delete todo item ${safeGet(['title'],todo,'')}?`,
            leftButton: (<button onClick={() =>handleConfirmDeleteTodo(todo)} className={'danger'}>Delete</button>),
            rightButton: (<button onClick={() =>handleCloseDeleteTodoPopup()}
            >Cancel</button>),
        });
    }, [handleConfirmDeleteTodo, handleCloseDeleteTodoPopup, setPopupProps])

    const loginPrompt = () => {
        setPopupProps({
            title: 'Please login',
            description: 'You need to log in to add todo items',
            leftButton: <button onClick={authenticate} className={'action'}>Login</button>,
            rightButton: <button onClick={()=> setPopupProps({...popupProps, isOpen: false})}>Cancel</button>,
            isOpen: true,
        })
    }

    const handleEditClick = () => {
       if (authState.authenticated) {
           history.push({pathname: '/edit', state: {from : pathname+ search}});
        } else {
           loginPrompt();
       }
    }


    const handleSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSearchValueChange(e);
        setPage(0);
    }

    const debouncedHandleSearchValueChange = useDebounce(handleSearchValueChange, 200, true);

    const handleDownloadTodosClick = () => {
        if (!isLoading) {
            downloadTodos(searchValue, showTodoUser);
        }
    }

    const constructSortObject = (sortString:string): ISort[] => {
        return sortString.split(',').map(sort => ({column: sort.split(':')[0], dir: sort.split(':')[1] as 'desc' | 'asc'}));
    }

    const loadData = async (username: string, page: number, search: string, sort: string, authenticationChecked: boolean) => {
        if (!authenticationChecked) {
            const response = await getUserInfo();
            if (response.ok) {
                const res = await response.json();
                await authActions.setLoggedInUser(res.username);
            } else {
                await authActions.setAnonymousUser();
            }
            setAuthenticationChecked(true);
        } else {
            todoActions.loadTodosRequest();
            console.log(sort);
            const sortObject: ISort[] =constructSortObject(sort);
            try {
                let response;
                if (!authState.authenticated || !username) {
                    response = await fetchAllTodos(page, todoState.pageSize, sortObject, search, authState.authenticated);
                } else {
                    response = await fetchUserTodos(username, page, todoState.pageSize, sortObject, search, authState.authenticated);
                }
                if (response!== undefined) {
                    if (response.ok) {
                        const res = await response.json();
                        const todos = safeGet(['_embedded', 'todoList'], res, []);
                        todoActions.loadTodos(todos);
                        setPaginations(res);
                    } else {
                        const errorMessage = await getErrorMessage(response);
                        todoActions.loadTodosFailure(errorMessage);
                    }
                }
            }  catch (e) {
                console.error(e);
                todoActions.loadTodosFailure(DEFAULT_ERROR_MESSAGE);
            }
        }
    };

    const handleChangeStatus = async (changeStatusUrl: string) => {
        todoActions.submitTodoRequest();
        try {
            const response = await changeTodoStatus(changeStatusUrl);
            if (response !== undefined) {
                if (response.ok) {
                    const todo = await response.json();
                    todoActions.submitTodoSuccess(todo);
                } else {
                    const errorMessage = await getErrorMessage(response);
                    todoActions.submitTodoFailure(errorMessage);
                }
            }
        } catch (e) {
            console.error(e);
            todoActions.submitTodoFailure(DEFAULT_ERROR_MESSAGE);
        } finally {
            await loadData(showTodoUser, page, searchValue, sortValue, authenticationChecked);
        }
    }

    const handleLogout = async() => {
        const response = await revokeToken();

        if (response.ok) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('expiry');
            authActions.userLoggedOut();
            history.push('/');
        }
    }


    function setPaginations(res: any) {
        const pagingInfo: IPagingInfo = {
            first: safeGet(['_links', 'first', 'href'], res, ''),
            prev: safeGet(['_links', 'prev', 'href'], res, ''),
            self: safeGet(['_links', 'self', 'href'], res, ''),
            next: safeGet(['_links', 'next', 'href'], res, ''),
            last: safeGet(['_links', 'last', 'href'], res, ''),
            currentPage: safeGet(['page', 'number'], res, 0),
            totalPages: safeGet(['page', 'totalPages'], res, 0),
        }
        todoActions.setTodoPagingInfo(pagingInfo);
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

    const toFirstPage = () => setPage(0);

    const toPrevPage = () => setPage(page-1);

    const toNextPage = () => setPage(page+1);

    const toLastPage = () => setPage(todoState.totalPages<=1?0:todoState.totalPages-1);

    useEffect(() => {
        loadData(showTodoUser, page,searchValue, sortValue, authenticationChecked);
    }, [showTodoUser, page, searchValue, sortValue, authenticationChecked])

    return (
        <div className={'todo-list'}>
            <Popup {...popupProps}/>
            {isLoading && <div className={'overlay'}/>}
            {isLoading && <i className={'inactive-text loader'}>Loading...</i>}

            {authState.authenticated &&
            <div className={'todos-navigation'}>
                <NavLink exact to={'/todos?page=0'}>All Todos</NavLink>
                {' / '}
                <NavLink exact to={`/todos/${authState.username}?page=0`}>My Todos</NavLink>
            </div>}

            <div className={'tools-bar vertical-buttons-wrap'}>
                {authState.authenticated ?
                    <button title="Logout" className={'float'} onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt}/>
                    </button> :
                    <button title="Login" className={'float'} onClick={authenticate}>
                        <FontAwesomeIcon icon={faSignInAlt}/>
                    </button>
                }
                <button title="Add todo" className={'action float'} onClick={handleEditClick}>
                    <FontAwesomeIcon icon={faPlus}/>
                </button>
                <button title="Download todos" className={'action float'} onClick={handleDownloadTodosClick}>
                    <FontAwesomeIcon icon={faFileDownload}/>
                </button>
            </div>

            <input className={'search'} placeholder={'Enter search term'}
               value={searchValue}
               onChange={debouncedHandleSearchValueChange} />


            {todoState.loadTodoError && <i className={'warning-text'}>{todoState.errorMessage}</i>}

            <div>
                <div className={'right-aligned'}>
                    <select className={'form-input'} onChange={onSortValueChange}>
                        <option value={'priority:desc'}>Highest priority first</option>
                        <option value={'priority:asc'}>Lowest priority first</option>
                        <option value={'createdAt:desc'}>Newest first</option>
                        <option value={'createdAt:asc'}>Oldest first</option>

                    </select>
                </div>
                {todoState.todos.map((todo: ITodo) => (
                <TodoItem
                    key={hashCode(todo.title + todo.description + todo.status + todo.priority + Object.keys(todo._links).length)}
                    todo={todo}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                    onChangeStatus={handleChangeStatus}
                />))}
            </div>

            <Pagination
                onFirstPageClick={toFirstPage}
                onPrevPageClick={toPrevPage}
                onNextPageClick={toNextPage}
                onLastPageClick={toLastPage}
                currentPage={todoState.currentPage + 1}
                totalPages={todoState.totalPages === 0?1:todoState.totalPages }
            />
        </div>)
}

export default TodoList;