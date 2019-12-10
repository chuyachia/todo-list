import React, {useState} from 'react';
import ITodo from '../models/ITodo';

interface ITodoItem {
    todo: ITodo;
    onEdit: (todo: ITodo) => void;
}

const TodoItem: React.FC<ITodoItem> = (props) => {

    const [todo, setTodo] = useState(props.todo);
    const {self, edit, ...links} = todo._links;

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
        <div>
            <h3>{todo.title}</h3>
            <p>By: {todo.user.username}</p>
            <p>Priority: {todo.priority}</p>
            <p>Status: {todo.status}</p>
            <p>{todo.description}</p>
            {edit !== undefined && <button onClick={()=>props.onEdit(todo)}>{edit.title}</button>}
            {Object.keys(links).length > 0 && <p>Change status to: </p>}
            {(Object.keys(links) as Array<keyof typeof links>).map((link) =>
                <button key={link} onClick={() => changeTodoStatus(links[link].href)}>
                    {links[link].title}
                </button>)}
        </div>)
}

export default TodoItem;