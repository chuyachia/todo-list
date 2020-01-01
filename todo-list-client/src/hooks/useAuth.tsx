import React from "react";

interface IAuth {
    authenticated: boolean;
    failed: boolean;
    logIn: (username: string, password: string) => void;
    logOut: () => void;
    register: (username: string, password: string) => void;
    reason: string;
    resetState: () => void;
    user: string;
    loading: boolean;
    getUserInfo: () => void;
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again later.";
const fetchOptions: RequestInit = {credentials: 'include', mode: 'cors'};

const useAuth = (loginEndpoint: string, registerEndpoint: string, userInfoEndpoint: string, logoutEndpoint: string): IAuth => {
    const [user, setUser] = React.useState<string>('');
    const [authenticated, setAuthenticated] = React.useState<boolean>(false);
    const [failed, setFailed] = React.useState<boolean>(false);
    const [reason, setReason] = React.useState<string>('');
    const [loading, setLoading] = React.useState(false);

    async function getUserInfo() {
        try {
            setLoading(true);
            const response = await fetch(userInfoEndpoint, {...fetchOptions, method: 'GET'})
            if (response.ok) {
                const user = await response.json();
                setAuthenticated(true);
                setUser(user.username);
            } else {
                setAuthenticated(false);
            }
        } catch (e) {
            setAuthenticated(false);
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function register(username: string, password: string) {
        try {
            setLoading(true);
            const registered = await fetch(registerEndpoint, {
                ...fetchOptions,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                })
            });
            if (registered.ok) {
                logIn(username, password);
            } else {
                const response = await registered.json();
                if (response.status.toString().startsWith("4")) {
                    setReason(response.message);
                } else {
                    setReason(DEFAULT_ERROR_MESSAGE);
                }
                setFailed(true);
            }
        } catch (e) {
            setFailed(true);
            console.error(e);
            setReason(DEFAULT_ERROR_MESSAGE);
        } finally {
            setLoading(false);
        }

    }

    async function logOut() {
        try {
            await fetch(logoutEndpoint, {...fetchOptions, method: 'POST'})
            setAuthenticated(false);
            setUser('');
        } catch (e) {
            console.error(e);
        }
    }

    async function logIn(username: string, password: string) {
        const options = _prepareFormData(username, password);

        try {
            setLoading(true);
            const response = await fetch(loginEndpoint, options);
            if (response.ok) {
                setAuthenticated(true);
                setUser(username);
                setFailed(false);
            } else {
                setFailed(true);
                const logInInfo = await response.json();
                if (response.status.toString().startsWith("4")) {
                    setReason(logInInfo.message);
                } else {
                    setReason(DEFAULT_ERROR_MESSAGE);
                }
            }
        } catch (e) {
            setFailed(true);
            console.error(e);
            setReason(DEFAULT_ERROR_MESSAGE);
        } finally {
            setLoading(false);
        }
    }


    function resetState() {
        setFailed(false);
        setAuthenticated(false);
    }

    function _prepareFormData(username: string, password: string) {
        setFailed(false);
        const formData = new FormData()
        formData.append('username', username);
        formData.append('password', password);

        const options: RequestInit = {
            ...fetchOptions,
            method: 'POST',
            body: formData,
        }

        return options;
    }

    return {
        authenticated,
        failed,
        logIn,
        logOut,
        register,
        reason,
        resetState,
        user,
        loading,
        getUserInfo,
    }
}

export default useAuth;