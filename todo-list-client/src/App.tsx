import React from 'react';
import './App.css';
import useAuth from './hooks/useAuth';
import Authentication from './pages/Authentication';
import TodoList from './pages/TodoList';

const App: React.FC = () => {
    const {authenticated, logIn, register, failed, reason, resetState: resetAuthState, user, logOut, loading, getUserInfo} = useAuth(
        process.env.REACT_APP_TODO_LIST_API + '/login',
        process.env.REACT_APP_TODO_LIST_API + '/register',
        process.env.REACT_APP_TODO_LIST_API + '/user-info',
        process.env.REACT_APP_TODO_LIST_API + '/logout',
    );
    const [initialized, setInitialized] = React.useState(false);

    async function getLoggedInUser() {
        await getUserInfo();
        setInitialized(true);
    }

    React.useEffect(() => {
        getLoggedInUser();
    }, [])

    return (
        <main className="App">
            <h3>Todo List App</h3>
            {initialized ? <>
                {authenticated && <small className={"clickable inactive-text"} onClick={() => logOut()}>Logout</small>}
                {authenticated ?
                    <TodoList authenticated={authenticated} username={user}/> :
                    <Authentication register={register} logIn={logIn} failed={failed} reason={reason}
                                    resetAuthState={resetAuthState} loading={loading}/>}
            </> : <i className={"inactive-text loader"}>Loading...</i>}
        </main>
    );
}

export default App;
