import React, {useEffect} from 'react';
import {RouteChildrenProps, useHistory} from 'react-router';
import queryString from 'query-string'
import {getToken} from '../api';
import {AuthActionCreater} from "../actions";

const LoginCallback: React.FC<RouteChildrenProps> = ({location}) => {
    const history = useHistory();
    const authActions = AuthActionCreater();

    useEffect(() => {
        callGetTokenEndpoint();
    }, []);

    const callGetTokenEndpoint  = async () => {
        const valueMap = queryString.parse(location.search);
        const code = valueMap.code as string;

        await getToken(code);
        const redirectPath = sessionStorage.getItem('redirect_path') || '/';
        sessionStorage.removeItem('redirect_path');
        authActions.userLoggedIn();

        history.push(redirectPath);
    }

    return <span>Redirecting...</span>;
}

export default LoginCallback;