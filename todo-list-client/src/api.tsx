import queryString from 'query-string';

import {DEFAULT_ERROR_MESSAGE} from "./constants";

export interface ISort {
    column: string;
    dir: 'desc' | 'asc';
}

const UNAUTHORIZED_MESSAGE = 'Unauthorized operation.';
const fetchAllTodosEndpoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos',
    fetchOneTodoEndpoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos/id',
    fetchUserTodosEndpoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos/user',
    sumbitNewTodoEndpoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos',
    searchTodosEndpoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos/search',
    downloadTodosEndPoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos/file',
    deleteTodoEndpoint = process.env.REACT_APP_TODO_LIST_API + '/api/todos',
    userInfoEndpoint = process.env.REACT_APP_TODO_LIST_API + '/user-info',
    authorizeEndpoint = process.env.REACT_APP_OAUTH_SERVER + '/oauth/authorize',
    getTokenEndpoint = process.env.REACT_APP_OAUTH_SERVER + '/oauth/token',
    revokeTokenEndpoint = process.env.REACT_APP_OAUTH_SERVER + '/oauth/revoke-token';

export async function authenticate() {
    const randomString = Math.random().toString(36).substring(7);
    sessionStorage.setItem('code_challenge', randomString);
    sessionStorage.setItem('redirect_path', window.location.pathname + window.location.search);

    const url = queryString.stringifyUrl({
        url: authorizeEndpoint,
        query: {
            client_id: process.env.REACT_APP_CLIENT_ID,
            grant_type: 'authorization_code',
            response_type: 'code',
            scope: 'any',
            code_challenge: randomString,
        }
    });

    window.location.assign(url);
};

export async function getToken(code: string) {
    const codeChallenge = sessionStorage.getItem('code_challenge');
    sessionStorage.removeItem('code_challenge');

    const url = queryString.stringifyUrl({
        url: getTokenEndpoint,
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
    const expiry = Date.now() + tokenResponse.expires_in * 1000;
    sessionStorage.setItem('expiry', expiry.toString());

}

export async function revokeToken (){
    let headers = getHeaders(true);

    return await fetch(revokeTokenEndpoint, {
        credentials: 'include',
        method: 'DELETE',
        mode: 'cors',
        headers
    })


}

export async function getUserInfo(){
    let headers = getHeaders(true);

    return await fetch(userInfoEndpoint, {
        credentials: 'include',
        method: 'GET',
        headers
    })
}

export async function fetchUserTodos(username: string, page: number, size: number, sort:ISort[], search: string, isAuthenticated: boolean) {
    let url;
    const sortString = sort.reduce(((acc, cur) => acc+ '&sort='+ cur.column + ',' + cur.dir), '');
    if (search.length > 0) {
        url = searchTodosEndpoint + `?q=${search.toLowerCase()}&page=${page}&size=${size}&user=${username}${sortString}`;
    } else {
        url = `${fetchUserTodosEndpoint}/${username}?page=${page}&size=${size}${sortString}`;
    }

    return fetchTodos(url, isAuthenticated);
}

export async function fetchAllTodos  (page: number, size: number, sort:ISort[], search: string, isAuthenticated: boolean) {
    let url;
    const sortString = sort.reduce(((acc, cur) => acc+ '&sort='+ cur.column + ',' + cur.dir), '');
    if (search.length > 0) {
        url = searchTodosEndpoint + `?q=${search.toLowerCase()}&page=${page}&size=${size}${sortString}`;
    } else {
        url = `${fetchAllTodosEndpoint}?page=${page}&size=${size}${sortString}`;
    }
    return fetchTodos(url, isAuthenticated);
}

export async function fetchOneTodoForEdit(id: string) {
    if (!tokenIsPresent() || tokenIsExpired()) {
        authenticate();
    } else {
        const headers = getHeaders(true);

        let url = `${fetchOneTodoEndpoint}/${id}`;
        return await fetch(url, {
            credentials: 'include',
            method: 'GET',
            headers,
        });
    }
}

export async function fetchTodos(url: string, isAuthenticated: boolean) {
    if (url.length > 0) {
        if (isAuthenticated && (!tokenIsPresent() || tokenIsExpired())) {
            authenticate();
        } else {
            const headers = getHeaders(isAuthenticated);

            return fetch(url, {
                credentials: 'include',
                method: 'GET',
                headers,
            });
        }
    }
}

export async function submitNewTodo(title: string, description: string, priority: string) {
    if (!tokenIsPresent() || tokenIsExpired()) {
        authenticate();
    } else {
        let headers = getHeaders(true, 'application/json');

        return fetch(sumbitNewTodoEndpoint, {
            credentials: 'include',
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                title,
                description,
                priority,
            }),
            headers
        });
    }
}

export async function updateTodo(title: string, description: string, priority: string, updateUrl: string) {
    if (!tokenIsPresent() || tokenIsExpired()) {
        authenticate();
    } else {
        let headers = getHeaders(true, 'application/json');

        return fetch(updateUrl, {
            credentials: 'include',
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                title,
                description,
                priority,
            }),
            headers
        });
    }
}

export async function changeTodoStatus(link: string) {
    if (!tokenIsPresent() || tokenIsExpired()) {
        authenticate();
    } else {
        let headers = getHeaders(true, 'application/json');

        return fetch(link, {
            credentials: 'include',
            method: 'PUT',
            mode: 'cors',
            headers
        });
    }
}

export async function deleteTodo(id: number) {
    if (!tokenIsPresent() || tokenIsExpired()) {
        authenticate();
    } else {
        let headers = getHeaders(true, 'application/json');

        return fetch(`${deleteTodoEndpoint}/${id}`, {
            credentials: 'include',
            method: 'DELETE',
            mode: 'cors',
            headers
        })
    }
}

export const downloadTodos = (searchValue = '', user?: string) => {
    let url = downloadTodosEndPoint + `?q=${searchValue.toLowerCase()}`;
    if (user !== undefined) url += `&user=${user}`
    window.location.assign(url);
}

export async function getErrorMessage(response: Response): Promise<string> {
    const responseJson = await response.json();
    console.error(responseJson);

    if (response.status.toString() === '401') {
        return UNAUTHORIZED_MESSAGE;
    } else if (response.status.toString().startsWith('4')) {
        return responseJson.message || DEFAULT_ERROR_MESSAGE;
    } else {
        return DEFAULT_ERROR_MESSAGE;
    }
}

function getHeaders(addToken: boolean, contentType?: string) {
    const headers = new Headers();
    if (addToken) {
        const token = sessionStorage.getItem('token');
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }
    }
    if (contentType) {
        headers.append('Content-Type', contentType);
    }

    return headers;
}

function tokenIsPresent() {
    const token = sessionStorage.getItem('token');

    return token !== undefined;
}

function tokenIsExpired() {
    const expiry = parseInt(sessionStorage.getItem('expiry') as string);

    return isNaN(expiry) || expiry < Date.now();
}
