import React from "react";

interface IAuth {
    authenticated: boolean;
    failed: boolean;
    logIn: (username: string, password: string) => void;
    register: (username: string, password: string) => void;
    reason: string;
}

const useAuth = (loginEndpoint: string, registerEndpoint: string): IAuth => {

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
                setReason(response.message);
                setFailed(true);
            }
        } catch (e) {
            setFailed(true);
            console.error(e);
        }

    }

    async function logIn(username: string, password: string) {
        const options = _prepareFormData(username, password);

        try {
            const signedIn = await fetch(loginEndpoint, options);
            if (signedIn.ok) {
                setAuthenticated(true);
                setFailed(false);
            } else {
                setFailed(true);
            }
        } catch (e) {
            setFailed(true);
            console.error(e);
        }
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
    }
}

export default useAuth;