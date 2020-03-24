import React, {useEffect} from 'react';
import {RouteChildrenProps} from 'react-router';
import queryString from 'query-string'
import useApi from '../hooks/useApi';

const LoginCallback: React.FC<RouteChildrenProps> = ({location}) => {
    const {getToken} = useApi();

    useEffect(() => {
        callGetTokenEndpoint();
    }, []);

    const callGetTokenEndpoint  = async () => {
        const valueMap = queryString.parse(location.search);
        const code = valueMap.code as string;

        await getToken(code);
    }

    return <span>Redirecting...</span>;
}

export default LoginCallback;