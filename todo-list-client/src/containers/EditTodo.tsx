import React, {useEffect} from 'react';
import {RouteComponentProps, useHistory, useLocation} from "react-router";

import TodoItemForm from '../components/TodoItemForm';
import {useStateValue} from "../state";
import useApi from "../hooks/useApi";
import {TodoActionCreater} from "../actions";

interface IRouteProps {
    id: string;
}

const EditTodo: React.FC<RouteComponentProps<IRouteProps>> = ({match}) => {
    const [{todo}, _] = useStateValue();
    const {
        submitNewTodo, updateTodo, fetchOneTodoForEdit
    } = useApi();
    const {resetErrorState, setActiveTodo} = TodoActionCreater();

    const id = match.params.id;
    const history = useHistory();
    const { state} = useLocation();
    const from = state && state.from ||  "/";

    const handleBack = () => {
        setActiveTodo(undefined);
        history.push(from);
    }

    const initializeActiveTodo = async () => {
        const todo = await fetchOneTodoForEdit(id);
        if (todo !== undefined) {
            setActiveTodo(todo);
        }
    }

    useEffect(() => {
        if (todo.activeTodo === undefined && id !== undefined) {
            initializeActiveTodo();
        }
    }, [])

    return (<div className={"edit-todo"}>
                <TodoItemForm
                    onBack={handleBack}
                    onSubmit={todo.activeTodo !== undefined ? updateTodo : submitNewTodo}
                    submitError={todo.submitTodoError}
                    todo={todo.activeTodo}
                    submitSuccess={todo.submitTodoSuccess}
                    errorMessage={todo.errorMessage}
                    loading={todo.loading}
                    resetErrorState={resetErrorState}
                />
            </div>);
}

export default EditTodo;