import authReducer from './auth';
import todoReducer from './todo';

import {IState} from "../states";
import IAction from '../actions/IAction';

export default ({auth, todo}: IState, action: IAction): IState => {
    // middleware deal with async action
    // if (typeof action.payload === "function") {
    //     action.payload = await action.payload();
    // }

    return {
        auth: authReducer(auth, action),
        todo: todoReducer(todo, action),
    }
}