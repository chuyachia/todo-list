import React from 'react';
import ITodo from '../models/ITodo';

const TodoItem: React.FC<ITodo> = (todo) => {
    const {self, ...links} = todo._links;

    return (
        <div>
            <h3>{todo.title}</h3>
            <p>Status: {todo.status}</p>
            <p>{todo.description}</p>
            <p>Change status to: </p>
            {(Object.keys(links) as Array<keyof typeof links>).map((link) =>
                <button key={link}>{links[link].title}</button>)}
        </div>)
}

export default TodoItem;