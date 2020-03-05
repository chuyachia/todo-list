import {NEW_LOGGEDIN_USER} from "./constants";
import {useStateValue} from "../state";


export const AuthActionCreater = () => {
    const [_, dispatch] = useStateValue();

    const setLoggedInUser = (username: string) => dispatch({
        type: NEW_LOGGEDIN_USER,
        payload: username,
    })

    return {
        setLoggedInUser,
    }
};