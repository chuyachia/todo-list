import React from "react";

import ITodo from "../models/ITodo";
import {
    LOAD_TODOS_FAILURE,
    LOAD_TODOS_REQUEST,
    NEW_ACTIVE_TODO,
    NEW_PAGING_INFO,
    NEW_TODOS, SUBMIT_TODO_FAILURE,
    SUBMIT_TODO_REQUEST, SUBMIT_TODO_SUCCESS
} from "./constants";
import {IPagingInfo} from "../models/IPagingInfo";
import {useStateValue} from "../state";

export const TodoActionCreater = () => {
    const [_, dispatch] = useStateValue();

    const loadTodosRequest = () => dispatch({
        type: LOAD_TODOS_REQUEST,
    });

    const loadTodos = (todos: ITodo[]) => dispatch({
        type: NEW_TODOS,
        payload: todos,
    });

    const loadTodosFailure = (message: string) => dispatch({
        type: LOAD_TODOS_FAILURE,
        payload: message,
    });

    const setActiveTodo = (todo: ITodo | undefined) => dispatch({
        type: NEW_ACTIVE_TODO,
        payload: todo,
    });

    const setTodoPagingInfo = (paginInfo: IPagingInfo) => dispatch({
        type: NEW_PAGING_INFO,
        payload: paginInfo,
    });

    const submitTodoRequest = () => dispatch({
        type: SUBMIT_TODO_REQUEST
    });

    const submitTodoSuccess= (todo: ITodo) => dispatch({
        type: SUBMIT_TODO_SUCCESS,
        payload: todo,
    });

    const submitTodoFailure = (message: string) => dispatch({
        type: SUBMIT_TODO_FAILURE,
        payload: message,
    });

    return {
        loadTodosRequest,
        loadTodos,
        loadTodosFailure,
        setActiveTodo,
        setTodoPagingInfo,
        submitTodoRequest,
        submitTodoFailure,
        submitTodoSuccess,
    }

};