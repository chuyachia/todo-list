import {IAuthState} from '../states/authState';
import IAction from '../actions/IAction';
import {NEW_USERNAME, USER_LOGGED_IN, USER_LOGGED_OUT} from "../actions/constants";

export default (state: IAuthState, action: IAction): IAuthState => {

    switch (action.type) {
        case NEW_USERNAME:
            return  {
                ...state,
                username: action.payload,
                authenticated: true,
                loading: false,
            }
        case USER_LOGGED_IN:
            return {
                ...state,
                authenticated: true,
                loading: false,
            }
        case USER_LOGGED_OUT:
            return {
                ...state,
                username : '',
                authenticated: false,
            }
        default:
            return {...state};
    }
}