import React, {useEffect} from 'react';
import {RouteComponentProps, useHistory, useLocation} from "react-router";
import queryString from "query-string";

import TodoItemForm from '../components/TodoItemForm';
import {useStateValue} from "../state";
import useApi from "../hooks/useApi";
import {TodoActionCreater} from "../actions";

interface IRouteProps {
    id: string;
}

const EditTodo: React.FC<RouteComponentProps<IRouteProps>> = ({match}) => {
    const [{auth, todo}, dispatch] = useStateValue();
    const {
        submitNewTodo, updateTodo, fetchOneTodo
    } = useApi();
    const {resetErrorState, setActiveTodo} = TodoActionCreater();

    const {search, state} = useLocation();
    const id = match.params.id;
    const history = useHistory();
    const {from} = state || {from: {pathname: "/"}};

    const handleBack = () => {
        setActiveTodo(undefined);
        history.push(from);
    }

    const initializeActiveTodo = async () => {
        const todo = await fetchOneTodo(id);
        if (todo !== null) {
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