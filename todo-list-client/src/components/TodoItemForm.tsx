import React, {useState} from 'react';
import useInput from '../hooks/useInput';
import useValidation from "../hooks/useValidation";
import ITodoItem from "../models/ITodo";
import safeGet from '../util/safeGet';
import {ENTER_KEY} from '../constants';


interface ITodoItemForm {
    onBack: () => void;
    onSubmit: (title: string, description: string, priority: string) => void;
    submitError: boolean;
    todo: ITodoItem | undefined;
    errorMessage: string;
    loading: boolean;
}

const TodoItemForm: React.FC<ITodoItemForm> = (props: ITodoItemForm) => {
    const titleInput = useInput<HTMLInputElement>(safeGet(["todo", "title"], props, ""));
    const titleInputValidation = useValidation((value: string) => value.length > 0, titleInput.onChange);
    const priorityInput = useInput<HTMLSelectElement>(safeGet(["todo", "priority"], props, ""));
    const descriptionInput = useInput<HTMLTextAreaElement>(safeGet(["todo", "description"], props, ""));
    const [submitted, setSubmitted] = useState(false);


    const submitNewTodo = () => {
        props.onSubmit(titleInput.value, descriptionInput.value, priorityInput.value);
        setSubmitted(true);
        titleInput.reset();
        descriptionInput.reset();
        priorityInput.reset();
    }

    const goBack = () => {
        props.onBack();
        setSubmitted(false);
    }

    const resetSubmitted = () => {
        if (submitted) setSubmitted(false);
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
                   value={titleInput.value}/>
            <small className={"validation-text"}>
                {titleInputValidation.touched && !titleInputValidation.valid && "Title must not be empty"}
            </small>
            <label>Description</label>
            <textarea maxLength={200} className={"form-input"} placeholder={"Enter description"}
                      onChange={descriptionInput.onChange} value={descriptionInput.value}/>
            <label>Priority</label>
            <select className={"form-input"} value={priorityInput.value}
                    onChange={priorityInput.onChange}>
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
            {submitted && !props.submitError && <i className={"success-text"}>Successfully submitted!</i>}
            {submitted && props.submitError && <i className={"warning-text"}>{props.errorMessage}</i>}
        </div>);
}

export default TodoItemForm;