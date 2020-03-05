import React, {useEffect} from 'react';
import {Redirect, RouteChildrenProps} from 'react-router';
import queryString from 'query-string'

const LoginCallback: React.FC<RouteChildrenProps> = ({location}) => {

    useEffect(() => {
        const valueMap = queryString.parse(location.search);
        const code = valueMap.code as string;

        (async function () {
            await getToken(code)
        })();
    }, [])

    const getToken = async (code: string) => {
        const codeChallenge = sessionStorage.getItem('code_challenge');
        sessionStorage.removeItem('code_challenge');

        const url = queryString.stringifyUrl({
            url: process.env.REACT_APP_OAUTH_SERVER_TOKEN as string,
            query: {
                code,
                grant_type: 'authorization_code',
                scope: 'any',
                code_verifier: codeChallenge,
            }
        })
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(process.env.REACT_APP_CLIENT_ID + ':'));

        const response = await fetch(url, {method: 'POST', headers});
        const tokenResponse = await response.json();
        sessionStorage.setItem('token', tokenResponse.access_token);
        window.location.href = "/"
    }

    return null;
}

export default LoginCallback;