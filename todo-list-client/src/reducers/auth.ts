import {IAuthState} from '../states/authState';
import IAction from '../actions/IAction';
import {NEW_LOGGEDIN_USER} from "../actions/constants";

export default (state: IAuthState, action: IAction): IAuthState => {

    switch (action.type) {
        case NEW_LOGGEDIN_USER:
            return  {
                ...state,
                username: action.payload,
                authenticated: true,
            }
        default:
            return {...state};
    }
}