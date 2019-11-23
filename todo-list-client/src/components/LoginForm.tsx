import React from 'react';
import useInput from '../hooks/useInput';

interface ILoginFormProps {
    onSubmit: (username: string, password: string) => void
}

const LoginForm: React.FC<ILoginFormProps> = (props) => {
    const {value: username, onChange: onUsernameChange, reset: resetUsername} = useInput();
    const {value: password, onChange: onPasswordChange, reset: resetPassword} = useInput();

    return (
        <div>
            <input type={"text"} placeholder={"Enter Username"} onChange={onUsernameChange}
                   value={username}/>
            <input type={"password"} placeholder={"Enter Password"} onChange={onPasswordChange}
                   value={password}/>
            <button onClick={() => {
                props.onSubmit(username, password);
                resetUsername();
                resetPassword();
            }}>Login
            </button>
        </div>
    )
}

export default LoginForm;