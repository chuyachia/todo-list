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
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again later.";

const useAuth = (loginEndpoint: string, registerEndpoint: string, userInfoEndpoint: string, logoutEndpoint: string): IAuth => {
    const [user, setUser] = React.useState<string>('');
    const [authenticated, setAuthenticated] = React.useState<boolean>(false);
    const [failed, setFailed] = React.useState<boolean>(false);
    const [reason, setReason] = React.useState<string>('');

    React.useEffect(() => {
        getUserInfo();
    })

    async function getUserInfo() {
        try {
            const response = await fetch(userInfoEndpoint, {method: 'GET', credentials: 'include'})
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
        }
    }

    async function register(username: string, password: string) {
        const options = _prepareFormData(username, password);

        try {
            const registered = await fetch(registerEndpoint, options);
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
        }

    }

    async function logOut() {
        try {
            await fetch(logoutEndpoint, {method: 'POST', credentials: 'include'})
            setAuthenticated(false);
            setUser('');
        } catch (e) {
            console.error(e);
        }
    }

    async function logIn(username: string, password: string) {
        const options = _prepareFormData(username, password);

        try {
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
            method: 'POST',
            body: formData,
            mode: 'cors',
            credentials: 'include',
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
    }
}

export default useAuth;