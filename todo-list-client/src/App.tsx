import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect,
} from "react-router-dom";

import './App.css';
import {StateProvider, useStateValue} from "./state";
import {initialState} from "./states"
import reducer from './reducers/';

const TodoList = React.lazy(() => import('./containers/TodoList'));
const EditTodo = React.lazy(() => import('./containers/EditTodo'));
const LoginCallback = React.lazy(() => import('./containers/LoginCallback'));

const App: React.FC = () => (
        <StateProvider state={initialState} reducer={reducer}>
            <main className="App">
                <h3>Todo List App</h3>
                <Router>
                    <React.Suspense fallback={<i className={"inactive-text loader"}>Loading...</i>}>
                        <Switch>
                            <Route exact path={"/"} render={() =><Redirect to={"/todos"}/>}/>
                            <Route path={"/oauth-callback"} component={LoginCallback}/>
                            <Route path={"/todos/:username?"} component={TodoList} />
                            <Route path={"/edit/:id?"} component={EditTodo} />
                        </Switch>
                    </React.Suspense>
                </Router>
            </main>
        </StateProvider>);

export default App;
