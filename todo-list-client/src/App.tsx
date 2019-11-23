import React, {useEffect, useState} from 'react';
import './App.css';
import useAuth from './hooks/useAuth';
import LoginForm from './components/LoginForm';
import TodoItem from './components/TodoItem';
import ITodo from './models/ITodo';

const App: React.FC = () => {
    const {authenticated, logIn, failed} = useAuth(process.env.REACT_APP_TODO_LIST_API_DEV + '/login');
    const [todos, setTodos] = useState<ITodo[]>([]);

    async function fetchTodos() {
        try {
            const response = await fetch(process.env.REACT_APP_TODO_LIST_API_DEV + '/api/todos', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const todosResource = await response.json();
                setTodos(todosResource._embedded.todoList);
            }
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (authenticated) {
            fetchTodos();
        }
    }, [authenticated])

    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Todo List App
                </p>
                {authenticated ? <div>Logged in </div> :
                    <LoginForm onSubmit={logIn}/>}
                {failed && <div>Failed to log in</div>}
                <div>{todos.map(todo => <TodoItem key={todo.id} {...todo}/>)}</div>
            </header>
        </div>
    );
}

export default App;
