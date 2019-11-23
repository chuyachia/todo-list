import React from "react";

interface IAuth {
    authenticated : boolean;
    failed: boolean;
    logIn : (username:string, password:string)=>void;
}

const useAuth = (loginEndpoint: string):IAuth => {

    const [authenticated, setAuthenticated] = React.useState<boolean>(false);
    const [failed, setFailed] = React.useState<boolean>(false);

    async function logIn(username: string, password: string) {
        setFailed(false);
        const formData = new FormData()
        formData.append('username',username);
        formData.append('password',password);

        const options: RequestInit = {
            method: 'POST',
            body: formData,
            mode: 'cors',
            credentials: 'include',
        }

        try {
            const signedIn = await fetch(loginEndpoint, options);
            if (signedIn.ok) {
                setAuthenticated(true);
                setFailed(false);
            } else {
                setFailed(true);
            }
        } catch (e) {
            console.error(e);
        }
    }

    return {
        authenticated,
        failed,
        logIn
    }
}

export default useAuth;