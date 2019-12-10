import React, {useEffect, useState} from 'react';
import TodoItemForm from '../components/TodoItemForm';
import TodoItem from '../components/TodoItem';
import useTodo from "../hooks/useTodo";
import ITodoItem from "../models/ITodo";
import hashCode from '../util/hashCode';

interface ITodoListProps {
    authenticated: boolean;
    username: string;
}

const TodoList: React.FC<ITodoListProps> = (props) => {
    const {todos, fetchUserTodos, fetchAllTodos, submitNewTodo, submitError, fetchError, activeTodo, editTodo, updateTodo} = useTodo(
        process.env.REACT_APP_TODO_LIST_API_DEV + '/api/todos',
        process.env.REACT_APP_TODO_LIST_API_DEV + '/api/todos/user',
        process.env.REACT_APP_TODO_LIST_API_DEV + '/api/todos'
    );
    const [isEdit, setIsEdit] = useState(false);
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

    useEffect(() => {
        if (props.authenticated && props.username.length > 0) {
            if (!showAllTodos) {
                fetchUserTodos(props.username);
            } else {
                fetchAllTodos();
            }
        }
    }, [props.authenticated, props.username, showAllTodos])

    return (
        <div>{isEdit ?
            <TodoItemForm onBack={handleBack} onSubmit={activeTodo !== undefined ? updateTodo : submitNewTodo}
                          submitError={submitError} todo={activeTodo}/>
            : <>
                <div>
                    <span onClick={() => setShowAllTodos(false)}
                          className={`clickable ${showAllTodos ? 'inactive-text' : ''}`}>My Todos</span>
                    {" / "}
                    <span onClick={() => setShowAllTodos(true)}
                          className={`clickable ${showAllTodos ? '' : 'inactive-text'}`}>All</span>
                </div>
                <button onClick={() => setIsEdit(true)}>New Todo</button>
                {fetchError && <i className={"warning-text"}>Cannot fetch todos</i>}
                <div>{todos.map(todo => <TodoItem key={hashCode(todo.title + todo.description + todo.priority)}
                                                  todo={todo} onEdit={handleEditTodo}/>)}</div>
            </>}
        </div>)
}

export default TodoList;