import React, {useEffect, useState} from 'react';
import TodoItemForm from '../components/TodoItemForm';
import TodoItem from '../components/TodoItem';
import useTodo from "../hooks/useTodo";

interface ITodoListProps {
    authenticated: boolean;
    username: string;
}

const TodoList: React.FC<ITodoListProps> = (props) => {
    const {todos, fetchUserTodos, submitNewTodo, submitError, fetchError} = useTodo(
        process.env.REACT_APP_TODO_LIST_API_DEV + '/api/todos/user',
        process.env.REACT_APP_TODO_LIST_API_DEV + '/api/todos'
    );
    const [isEdit, setIsEdit] = useState(false);

    const handleBack = () => {
        setIsEdit(false);
        fetchUserTodos(props.username);
    }

    useEffect(() => {
        if (props.authenticated && props.username.length > 0) {
            fetchUserTodos(props.username);
        }
    }, [props.authenticated, props.username])

    return (
        <div>{isEdit ?
            <>
                <TodoItemForm onBack={handleBack} onSubmit={submitNewTodo} submitError={submitError}/>
            </>
            : <>
                <button onClick={() => setIsEdit(true)}>New Todo</button>
                {fetchError && <i className={"warning-text"}>Cannot fetch todos</i>}
                <div>{todos.map(todo => <TodoItem key={todo.id} {...todo}/>)}</div>
            </>}
        </div>)
}

export default TodoList;