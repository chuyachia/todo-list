import React from 'react';
import useInput from '../hooks/useInput';
import useValidation from "../hooks/useValidation";

interface ITodoItemForm {
    onCancel: () => void;
}

const TodoItemForm: React.FC<ITodoItemForm> = (props: ITodoItemForm) => {
    const titleInput = useInput<HTMLInputElement>();
    const titleInputValidation = useValidation((value: string) => value.length > 0, titleInput.onChange);
    const priorityInput = useInput<HTMLSelectElement>();
    const descriptionInput = useInput<HTMLTextAreaElement>();


    return (
        <div className={"form"}>
            <label>Title</label>
            <input className={"form-input"} type={"text"} placeholder={"Enter title"}
                   onChange={titleInputValidation.onChange} onFocus={titleInputValidation.onFocus}
                   value={titleInput.value}/>
            <small className={"validation-text"}>
                {titleInputValidation.touched && !titleInputValidation.valid && "Title must not be empty"}
            </small>
            <label>Description</label>
            <textarea className={"form-input"} placeholder={"Enter description"} autoFocus={true}
                      onChange={descriptionInput.onChange} value={descriptionInput.value}/>
            <label>Priority</label>
            <select className={"form-input"} value={priorityInput.value} onChange={priorityInput.onChange}>
                <option value={"High"}>High</option>
                <option value={"Medium"}>Medium</option>
                <option value={"Low"}>Low</option>
            </select>
            <button className={"submit-button"}>Add</button>
            <button className={"submit-button"} onClick={props.onCancel}>Cancel</button>
        </div>
    );
}

export default TodoItemForm;