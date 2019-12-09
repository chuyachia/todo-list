import React from 'react';
import './App.css';
import useAuth from './hooks/useAuth';
import Authentication from './pages/Authentication';
import TodoList from './pages/TodoList';

const App: React.FC = () => {
    const {authenticated, logIn, register, failed, reason, resetState: resetAuthState, user} = useAuth(
        process.env.REACT_APP_TODO_LIST_API_DEV + '/login',
        process.env.REACT_APP_TODO_LIST_API_DEV + '/register',
    );

    return (
        <div className="App">
            <header className="App-header">
                <h3>Todo List App</h3>
                {authenticated?
                    <TodoList authenticated={authenticated} username={user}/> :
                    <Authentication register={register} logIn={logIn} failed={failed} reason={reason}
                                    resetAuthState={resetAuthState}/>}

            </header>
        </div>
    );
}

export default App;
