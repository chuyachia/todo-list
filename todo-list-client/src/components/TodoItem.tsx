import React, {useState} from 'react';
import ITodo from '../models/ITodo';

import './TodoItem.css';

interface ITodoItem {
    todo: ITodo;
    onEdit: (todo: ITodo) => void;
}

const TodoItem: React.FC<ITodoItem> = (props) => {

    const [todo, setTodo] = useState(props.todo);
    const {self, edit, ...links} = todo._links;
    const isHighPriority = todo.priority === 'High';
    const isDone = todo.status === "Won't Do" || todo.status === 'Done';

    async function changeTodoStatus(link: string) {
        const changeStatus = await fetch(link, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
        })

        if (changeStatus.ok) {
            const todoResource = await changeStatus.json();
            setTodo(todoResource);
        }
    }

    return (
        <article className={`todo-item ${isDone ? 'disabled' : isHighPriority ? 'warning' : ''}`}>
            <h3>{todo.title}</h3>
            <p>By: {todo.user.username}</p>
            <p>Priority: {todo.priority}</p>
            <p>Status: {todo.status}</p>
            <p>{todo.description}</p>
            <div className={"buttons-wrap"}>
                {(Object.keys(links) as Array<keyof typeof links>).map((link) =>
                    <button key={link} onClick={() => changeTodoStatus(links[link].href)}>
                        {links[link].title}
                    </button>)}
                {edit !== undefined && <button onClick={() => props.onEdit(todo)}>{edit.title}</button>}
            </div>
        </article>)
}

export default TodoItem;