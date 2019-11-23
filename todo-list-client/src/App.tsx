import React from 'react';
import './App.css';
import useAuth from './hooks/useAuth';
import LoginForm from './components/LoginForm';

const App: React.FC = () => {
    const {authenticated, logIn, failed} = useAuth(process.env.REACT_APP_TODO_LIST_API_DEV + '/login');

    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Todo List App
                </p>
                {authenticated ? <div>Logged in </div> :
                    <LoginForm onSubmit={logIn}/>}
                {failed && <div>Failed to log in</div>}
            </header>
        </div>
    );
}

export default App;
