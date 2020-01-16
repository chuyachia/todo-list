import React from "react";

interface IAuth {
    authenticated: boolean;
    failed: boolean;
    logIn: (username: string, password: string) => Promise<boolean>;
    logOut: () => Promise<boolean>;
    register: (username: string, password: string) => Promise<boolean>;
    reason: string;
    resetState: () => void;
    user: string;
    loading: boolean;
    getUserInfo: () => void;
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again later.";
const fetchOptions: RequestInit = {credentials: 'include', mode: 'cors'};

const useAuth = (loginEndpoint: string, registerEndpoint: string, userInfoEndpoint: string, logoutEndpoint: string): IAuth => {
    const [state, setState] = React.useState({
        user: '',
        authenticated: false,
        failed: false,
        reason: '',
        loading: false,
    })

    async function getUserInfo() {
        try {
            setState(prev => ({
                ...prev,
                loading: true,
            }));

            const response = await fetch(userInfoEndpoint, {...fetchOptions, method: 'GET'})
            if (response.ok) {
                const user = await response.json();
                setState(prev => ({
                    ...prev,
                    authenticated: true,
                    user: user.username,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    authenticated: false,
                }));
            }
        } catch (e) {
            setState(prev => ({
                ...prev,
                authenticated: false,
            }));
            console.error(e);
        } finally {
            setState(prev => ({
                ...prev,
                loading: false,
            }));
        }
    }

    async function register(username: string, password: string) {
        try {
            setState(prev => ({
                ...prev,
                loading: true,
            }));
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
                return logIn(username, password);
            } else {
                const response = await registered.json();
                if (response.status.toString().startsWith("4")) {
                    setState(prev => ({
                        ...prev,
                        reason: response.message,
                        failed: true,
                    }));
                } else {
                    setState(prev => ({
                        ...prev,
                        reason: DEFAULT_ERROR_MESSAGE,
                        failed: true,
                    }));
                }

                return false;
            }
        } catch (e) {
            setState(prev => ({
                ...prev,
                reason: DEFAULT_ERROR_MESSAGE,
                failed: true,
            }));
            console.error(e);
            return false;
        } finally {
            setState(prev => ({
                ...prev,
                loading: false,
            }));
        }

    }

    async function logOut() {
        try {
            await fetch(logoutEndpoint, {...fetchOptions, method: 'POST'})
            setState(prev => ({
                ...prev,
                user: '',
                authenticated: false,
            }));

            return true;
        } catch (e) {
            console.error(e);

            return false;
        }
    }

    async function logIn(username: string, password: string) {
        const options = _prepareFormData(username, password);

        try {
            setState(prev => ({
                ...prev,
                loading: true,
            }));
            const response = await fetch(loginEndpoint, options);
            if (response.ok) {
                setState(prev => ({
                    ...prev,
                    authenticated: true,
                    user: username,
                    failed: false,
                }));

                return true;
            } else {

                const logInInfo = await response.json();
                if (response.status.toString().startsWith("4")) {
                    setState(prev => ({
                        ...prev,
                        failed: true,
                        reason: logInInfo.message,
                    }));
                } else {
                    setState(prev => ({
                        ...prev,
                        failed: true,
                        reason: DEFAULT_ERROR_MESSAGE,
                    }));
                }

                return false;
            }
        } catch (e) {
            setState(prev => ({
                ...prev,
                failed: true,
                reason: DEFAULT_ERROR_MESSAGE,
            }));
            console.error(e);

            return false;
        } finally {
            setState(prev => ({
                ...prev,
                loading: false,
            }));
        }
    }


    function resetState() {
        setState(prev => ({
            ...prev,
            failed: false,
            authenticated: false,
        }));
    }

    function _prepareFormData(username: string, password: string) {
        setState(prev => ({
            ...prev,
            failed: false,
        }));
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
        authenticated: state.authenticated,
        failed: state.failed,
        logIn,
        logOut,
        register,
        reason:state.reason,
        resetState,
        user:state.user,
        loading:state.loading,
        getUserInfo,
    }
}

export default useAuth;