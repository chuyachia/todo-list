import {ITodoState} from '../states/todoState';
import IAction from '../actions/IAction';
import {
    LOAD_TODOS_FAILURE,
    LOAD_TODOS_REQUEST,
    NEW_ACTIVE_TODO,
    NEW_PAGING_INFO,
    NEW_TODOS, SUBMIT_TODO_FAILURE,
    SUBMIT_TODO_REQUEST, SUBMIT_TODO_SUCCESS
} from "../actions/constants";

export default (state: ITodoState, action: IAction): ITodoState => {
    switch (action.type) {
        case NEW_TODOS:
            return {
                ...state,
                todos: action.payload,
                loading: false,
            };
        case NEW_ACTIVE_TODO:
            return {...state, activeTodo: action.payload};
        case NEW_PAGING_INFO:
            return {
                ...state,
                firstPageUrl: action.payload.first,
                prevPageUrl: action.payload.prev,
                currentPageUrl: action.payload.self,
                nextPageUrl: action.payload.next,
                lastPageUrl: action.payload.last,
                currentPage: action.payload.currentPage,
                totalPages: action.payload.totalPages === 0 ? 1 : action.payload.totalPages,
            };
        case LOAD_TODOS_REQUEST:
            return {
                ...state,
                loadTodoError: false,
                loading: true,
            }
        case LOAD_TODOS_FAILURE:
            return {
                loadTodoError: true,
                loading: false,
                errorMessage: action.payload,
                ...state,
            }
        case SUBMIT_TODO_REQUEST:
            return {
                ...state,
                submitTodoError: false,
                activeTodo: undefined,
                loading: true,
            }
        case SUBMIT_TODO_FAILURE:
            return {
                ...state,
                submitTodoError: true,
                loading: false,
                errorMessage: action.payload,
            }
        case SUBMIT_TODO_SUCCESS:
            return {
                ...state,
                loading: false,
            }
        default:
            return {...state};
    }
}