import React, {useEffect, useState} from 'react';
import './App.css';
import useAuth from './hooks/useAuth';
import AuthenticationForm from './components/AuthenticationForm';
import TodoItem from './components/TodoItem';
import ITodo from './models/ITodo';

const App: React.FC = () => {
    const {authenticated, logIn, register, failed, reason} = useAuth(
        process.env.REACT_APP_TODO_LIST_API_DEV + '/login',
        process.env.REACT_APP_TODO_LIST_API_DEV + '/register',
    );
    const [todos, setTodos] = useState<ITodo[]>([]);
    const [isRegister, setIsRegister] = useState(false);

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

    const renderAuthenticationForm = () => (
        <>
            <div>
                <span onClick={() => setIsRegister(false)}
                      className={`clickable ${isRegister ? 'inactive-text' : ''}`}>Login</span>
                {" / "}
                <span onClick={() => setIsRegister(true)}
                      className={`clickable ${isRegister ? '' : 'inactive-text'}`}>Register</span>
            </div>
            {isRegister ?
                <AuthenticationForm
                    onSubmit={register}
                    failed={failed}
                    submitButtonText={"Register"}
                    passwordValidationFunction={(value: string) => value.length > 5}
                    passwordValidationMessage={"Password must contain more than 5 characters"}
                    reason={reason}/> :
                <AuthenticationForm
                    onSubmit={logIn}
                    failed={failed}
                    submitButtonText={"Login"}
                    reason={"Login failed"}/>}
        </>
    )

    return (
        <div className="App">
            <header className="App-header">
                <h3>Todo List App</h3>
                {!authenticated && renderAuthenticationForm()}
                <div>{todos.map(todo => <TodoItem key={todo.id} {...todo}/>)}</div>
            </header>
        </div>
    );
}

export default App;
