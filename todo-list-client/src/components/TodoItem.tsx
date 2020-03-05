import React, {useState} from 'react';
import ITodo from '../models/ITodo';

import './TodoItem.css';

interface ITodoItem {
    loading: boolean;
    todo: ITodo;
    onEdit: (todo: ITodo) => void;
    onChangeStatus: (url: string) => Promise<ITodo | null>;
}

const TodoItem: React.FC<ITodoItem> = (props) => {
    console.log(props.todo);
    const [todo, setTodo] = useState(props.todo);
    const {self, edit, ...links} = todo._links;
    const isHighPriority = todo.priority === 'High';
    const isDone = todo.status === "Won't Do" || todo.status === 'Done';

    async function changeTodoStatus(url: string) {
        const todo = await props.onChangeStatus(url);
        if (todo !== null) {
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
            <div className={"buttons-wrap"}>
                {(Object.keys(links) as Array<keyof typeof links>).map((link) =>
                    <button key={link} className={`${props.loading ? 'disabled' : ''}`}
                            onClick={() => !props.loading && changeTodoStatus(links[link].href)}
                            disabled={props.loading}>
                        {links[link].title}
                    </button>)}
                {edit !== undefined && <button onClick={() => props.onEdit(todo)}>{edit.title}</button>}
            </div>
        </article>)
}

export default TodoItem;