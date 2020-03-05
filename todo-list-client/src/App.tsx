import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import LoginCallback from './containers/LoginCallback';
import './App.css';
import {StateProvider, useStateValue} from "./state";
import {initialState} from "./states"
import reducer from './reducers/';

// dynamic imports
const Authentication = React.lazy(() => import('./containers/Authentication'));
const TodoList = React.lazy(() => import('./containers/TodoList'));

const App: React.FC = () => {
    const [initialized, setInitialized] = React.useState(false);
    const [showLogin, setShowLogin] = React.useState(false);

    async function getLoggedInUser() {
        // await getUserInfo();
        setInitialized(true);
    }

    async function handleLogOut() {
        // await logOut();
        // TODO
    }

    React.useEffect(() => {
        // getLoggedInUser();

        setInitialized(true);
    }, [])

    return (
        <StateProvider state={initialState} reducer={reducer}>
        <main className="App">
            <h3>Todo List App</h3>
            {initialized ? <Router>
                <React.Suspense fallback={<i className={"inactive-text loader"}>Loading...</i>}>
                    <Switch>
                        <Route exact={true} path={"/"} component={TodoList} />
                        <Route path={"/oauth-callback"} component={LoginCallback}/>
                    </Switch>
                    {/* {showLogin?
                         <Authentication register={register} logIn={logIn} failed={failed} reason={reason}
                                         resetAuthState={resetAuthState} loading={loading}
                                         hideLogin={() => setShowLogin(false)}/> : */}
                        {/*<TodoList authenticated={authenticated} username={user} showLogin={() => setShowLogin(true)}/>*/}
                 {/*}*/}
                </React.Suspense>
            </Router> : <i className={"inactive-text loader"}>Loading...</i>}
        </main>
        </StateProvider>
    );
}

export default App;
