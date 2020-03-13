import {NEW_USERNAME, USER_LOGGED_IN, USER_LOGGED_OUT} from "./constants";
import {useStateValue} from "../state";


export const AuthActionCreater = () => {
    const [_, dispatch] = useStateValue();

    const userLoggedIn = () => dispatch({
        type: USER_LOGGED_IN,
    })

    const setLoggedInUser = (username: string) => dispatch({
        type: NEW_USERNAME,
        payload: username,
    })

    const userLoggedOut = () => dispatch({
        type: USER_LOGGED_OUT,
    })

    return {
        userLoggedIn,
        setLoggedInUser,
        userLoggedOut,
    }
};