import React, {useEffect, useState} from 'react';
import useInput from '../hooks/useInput';
import useValidation from "../hooks/useValidation";
import ITodoItem from "../models/ITodo";
import safeGet from '../util/safeGet';
import {ENTER_KEY} from '../constants';
import ITodo from '../models/ITodo';

interface ITodoItemForm {
    onBack: () => void;
    onSubmit: (title: string, description: string, priority: string) => Promise<ITodo | null>;
    submitError: boolean;
    submitSuccess: boolean;
    todo: ITodoItem | undefined;
    errorMessage: string;
    loading: boolean;
    resetErrorState: ()=> void;
}

const TodoItemForm: React.FC<ITodoItemForm> = (props: ITodoItemForm) => {
    const titleInput = useInput<HTMLInputElement>(safeGet(["todo", "title"], props, ""));
    const titleInputValidation = useValidation((value: string) => value.length > 0, titleInput.onChange);
    const priorityInput = useInput<HTMLSelectElement>(safeGet(["todo", "priority"], props, ""));
    const descriptionInput = useInput<HTMLTextAreaElement>(safeGet(["todo", "description"], props, ""));
    const [disableEdit, setDisableEdit] = useState(false);

    let timeout: number;

    useEffect(()=> {
        return () => window.clearTimeout(timeout);
    }, [])

    const submitNewTodo = async () => {
        const todo = await props.onSubmit(titleInput.value, descriptionInput.value, priorityInput.value);
        if (todo) {
            setDisableEdit(true);
            timeout = window.setTimeout(() => goBack(), 1000);
        }
    }

    const goBack = () => {
        props.onBack();
        props.resetErrorState();
    }

    const resetSubmitted = () => {
        props.resetErrorState();
    }

    const handleEnterKey = (e: React.KeyboardEvent) => {
        if (e.keyCode === ENTER_KEY && titleInputValidation.valid) {
            submitNewTodo();
        }
    }

    return (
        <div className={"form edit-todo"} onChange={resetSubmitted} onKeyDown={handleEnterKey}>
            <label>Title</label>
            <input className={"form-input"} type={"text"} placeholder={"Enter title"}
                   onChange={titleInputValidation.onChange} onFocus={titleInputValidation.onFocus}
                   value={titleInput.value} disabled={disableEdit}/>
            <small className={"validation-text"}>
                {titleInputValidation.touched && !titleInputValidation.valid && "Title must not be empty"}
            </small>
            <label>Description</label>
            <textarea maxLength={200} className={"form-input"} placeholder={"Enter description"}
                      onChange={descriptionInput.onChange} value={descriptionInput.value} disabled={disableEdit}/>
            <label>Priority</label>
            <select className={"form-input"} value={priorityInput.value}
                    onChange={priorityInput.onChange} disabled={disableEdit}>
                <option disabled={true} value={""}>Select priority</option>
                <option value={"High"}>High</option>
                <option value={"Medium"}>Medium</option>
                <option value={"Low"}>Low</option>
            </select>
            <div className={"buttons-wrap"}>
                <button className={`submit-button ${props.loading ? "disabled" : "primary"}`}
                        onClick={() => !props.loading && submitNewTodo()}>Submit
                </button>
                <button className={"submit-button"} onClick={goBack}>Back</button>
            </div>
            {props.submitSuccess&& <i className={"success-text"}>Successfully submitted! Directing back...</i>}
            {props.submitError && <i className={"warning-text"}>{props.errorMessage}</i>}
        </div>);
}

export default TodoItemForm;