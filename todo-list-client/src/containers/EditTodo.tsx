import React, {useEffect} from 'react';
import {RouteComponentProps, useHistory, useLocation} from 'react-router';

import TodoItemForm from '../components/TodoItemForm';
import {useStateValue} from '../state';
import {
    submitNewTodo, updateTodo, fetchOneTodoForEdit, getErrorMessage
} from '../api';
import {TodoActionCreater} from '../actions';
import safeGet from "../util/safeGet";
import {DEFAULT_ERROR_MESSAGE} from "../constants";

interface IRouteProps {
    id: string;
}

const EditTodo: React.FC<RouteComponentProps<IRouteProps>> = ({match}) => {
    const [{todo}, _] = useStateValue();
    const {resetErrorState, setActiveTodo, submitTodoRequest, submitTodoSuccess, submitTodoFailure} = TodoActionCreater();

    const id = match.params.id;
    const history = useHistory();
    const { state} = useLocation();
    const from = (state && state.from) ||  '/';

    const handleBack = () => {
        setActiveTodo(undefined);
        history.push(from);
    }

    const initializeActiveTodo = async () => {
        try {
            const response = await fetchOneTodoForEdit(id);
            if (response!== undefined && response.ok) {
                const todo = await response.json();
                if (todo !== undefined) {
                    setActiveTodo(todo);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleSubmitClick = async (title:string, description:string, priority:string) => {
        submitTodoRequest();
        let response;
        const updateUrl = safeGet(['activeTodo', '_links', 'edit', 'href'], todo, undefined);
        try {
            if (updateUrl !== undefined) {
                response = await updateTodo(title, description, priority, updateUrl);
            } else {
                response = await submitNewTodo(title, description, priority);
            }
            if (response !== undefined) {
                if (response.ok) {
                    const todo = await response.json();
                    submitTodoSuccess(todo);
                } else {
                    const errorMessage = await getErrorMessage(response);
                    submitTodoFailure(errorMessage);
                }
            }
        } catch (e) {
            submitTodoFailure(DEFAULT_ERROR_MESSAGE);
        }

    }

    useEffect(() => {
        if (todo.activeTodo === undefined && id !== undefined) {
            initializeActiveTodo();
        }
    }, [])



    return (<div className={'edit-todo'}>
                <TodoItemForm
                    onBack={handleBack}
                    onSubmit={handleSubmitClick}
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