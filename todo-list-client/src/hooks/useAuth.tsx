import React from "react";

interface IAuth {
    authenticated: boolean;
    failed: boolean;
    logIn: (username: string, password: string) => void;
    register: (username: string, password: string) => void;
    reason: string;
    resetState: () => void;
    user: string;
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again later.";

const useAuth = (loginEndpoint: string, registerEndpoint: string): IAuth => {
    const [user, setUser] = React.useState<string>('');
    const [authenticated, setAuthenticated] = React.useState<boolean>(false);
    const [failed, setFailed] = React.useState<boolean>(false);
    const [reason, setReason] = React.useState<string>('');

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

    async function logIn(username: string, password: string) {
        const options = _prepareFormData(username, password);

        try {
            const signedIn = await fetch(loginEndpoint, options);
            if (signedIn.ok) {
                setAuthenticated(true);
                setUser(username);
                setFailed(false);
            } else {
                setFailed(true);
                const response = await signedIn.json();
                if (response.status.toString().startsWith("4")) {
                    setReason(response.message);
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
        register,
        reason,
        resetState,
        user,
    }
}

export default useAuth;