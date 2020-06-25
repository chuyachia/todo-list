import React, {useState} from 'react';
import ITodo from '../models/ITodo';

import './TodoItem.scss';

interface ITodoItem {
    todo: ITodo;
    onEdit: (todo: ITodo) => void;
    onDelete: (todo: ITodo) => void;
    onChangeStatus: (url: string) => Promise<ITodo | void>;
}

const TodoItem: React.FC<ITodoItem> = (props) => {
    const [todo, setTodo] = useState(props.todo);
    const {self, edit, remove, ...links} = todo._links;
    const isHighPriority = todo.priority === 'High';
    const isDone = todo.status === 'Won\'t Do' || todo.status === 'Done';

    async function changeTodoStatus(url: string) {
        const todo = await props.onChangeStatus(url);
        if (todo !== undefined) {
            setTodo(todo);
        }
    }

    return (
        <article className={`todo-item ${isDone ? 'disabled' : isHighPriority ? 'warning' : ''}`}>
            <h3>{todo.title}</h3>
            <p>By: {todo.user.username}</p>
            <p>Priority: {todo.priority}</p>
            <p>Status: {todo.status}</p>
            <p>{todo.description}</p>
            <div className={'buttons-wrap'}>
                {(Object.keys(links) as Array<keyof typeof links>).map((link) =>
                    <button key={link} onClick={() => changeTodoStatus(links[link].href)} className={'action'}>
                        {links[link].title}
                    </button>)}
                {edit !== undefined && <button onClick={() => props.onEdit(todo)} className={'action'}>{edit.title}</button>}
                {remove !== undefined && <button className={'danger'} onClick={() => props.onDelete(todo)}>{remove.title}</button>}
            </div>
        </article>)
}

export default React.memo(TodoItem);