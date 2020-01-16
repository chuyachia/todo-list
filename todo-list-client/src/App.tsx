import React from 'react';
import './App.css';
import useAuth from './hooks/useAuth';

// dynamic imports
const Authentication = React.lazy(() => import('./pages/Authentication'));
const TodoList = React.lazy(() => import('./pages/TodoList'));

const App: React.FC = () => {
    const {authenticated, logIn, register, failed, reason, resetState: resetAuthState, user, logOut, loading, getUserInfo} = useAuth(
        process.env.REACT_APP_TODO_LIST_API + '/login',
        process.env.REACT_APP_TODO_LIST_API + '/register',
        process.env.REACT_APP_TODO_LIST_API + '/user-info',
        process.env.REACT_APP_TODO_LIST_API + '/logout',
    );
    const [initialized, setInitialized] = React.useState(false);
    const [showLogin, setShowLogin] = React.useState(false);

    async function getLoggedInUser() {
        await getUserInfo();
        setInitialized(true);
    }

    async function handleLogOut() {
        await logOut();
    }

    React.useEffect(() => {
        getLoggedInUser();
    }, [])

    return (
        <main className="App">
            <h3>Todo List App</h3>
            {initialized ? <>
                {!showLogin && (authenticated ?
                    <small className={"clickable inactive-text"} onClick={handleLogOut}>Logout</small> :
                    <small className={"clickable"} onClick={() => setShowLogin(true)}>Login</small>)}
                <React.Suspense fallback={<i className={"inactive-text loader"}>Loading...</i>}>
                    {showLogin?
                        <Authentication register={register} logIn={logIn} failed={failed} reason={reason}
                                        resetAuthState={resetAuthState} loading={loading}
                                        hideLogin={() => setShowLogin(false)}/> :
                        <TodoList authenticated={authenticated} username={user} showLogin={() => setShowLogin(true)}/>}
                </React.Suspense>
            </> : <i className={"inactive-text loader"}>Loading...</i>}
        </main>
    );
}

export default App;
