import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect, Link,
} from 'react-router-dom';

import 'normalize.css';
import './App.scss';
import {StateProvider, useStateValue} from './state';
import {initialState} from './states'
import reducer from './reducers/';

const TodoList = React.lazy(() => import('./containers/TodoList'));
const EditTodo = React.lazy(() => import('./containers/EditTodo'));
const LoginCallback = React.lazy(() => import('./containers/LoginCallback'));
const NotFound = React.lazy(() => import('./containers/NotFound'));

const App: React.FC = () => {
    return (
        <StateProvider state={initialState} reducer={reducer}>
            <Router>
                <main className="App">
                    <header>
                        <Link to={'/todos'}><h3>Todo List App</h3></Link>
                    </header>
                    <React.Suspense fallback={<i className={'inactive-text loader'}>Loading...</i>}>
                        <Switch>
                            <Route exact path={'/'} render={() =><Redirect to={'/todos'}/>}/>
                            <Route path={'/oauth-callback'} component={LoginCallback}/>
                            <Route path={'/todos/:username?'} component={TodoList} />
                            <Route path={'/edit/:id?'} component={EditTodo} />
                            <Route path={'/notfound'} component={NotFound}/>
                            <Route path={'/'} render={() =><Redirect to={'/notfound'}/>}/>
                        </Switch>
                    </React.Suspense>
                </main>
                </Router>
        </StateProvider>);
    }

export default App;
