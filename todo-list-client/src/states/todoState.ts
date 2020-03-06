import ITodo from "../models/ITodo";

export interface ITodoState {
    todos: ITodo[];
    activeTodo: ITodo | undefined;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    nextPageUrl: string;
    prevPageUrl: string;
    firstPageUrl: string;
    lastPageUrl: string;
    currentPageUrl: string;
    submitTodoError: boolean;
    submitTodoSuccess: boolean;
    loadTodoError: boolean;
    loading: boolean;
    errorMessage: string;
}

export const initialTodoState: ITodoState = {
    submitTodoSuccess: false,
    errorMessage: "",
    loadTodoError: false,
    loading: true,
    submitTodoError: false,
    activeTodo: undefined,
    currentPage: 0,
    currentPageUrl: "",
    firstPageUrl: "",
    lastPageUrl: "",
    nextPageUrl: "",
    prevPageUrl: "",
    pageSize: 5,
    todos: [],
    totalPages: 0
}