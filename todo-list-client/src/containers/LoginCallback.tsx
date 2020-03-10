import React, {useEffect} from 'react';
import {RouteChildrenProps} from 'react-router';
import queryString from 'query-string'
import useApi from "../hooks/useApi";

const LoginCallback: React.FC<RouteChildrenProps> = ({location}) => {
    const {getToken} = useApi();

    useEffect(() => {
        const valueMap = queryString.parse(location.search);
        const code = valueMap.code as string;

        getToken(code)
    }, [])

    return null;
}

export default LoginCallback;