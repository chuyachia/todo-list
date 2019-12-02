import React from 'react';
import useInput from '../hooks/useInput';
import useValidation from "../hooks/useValidation";

import './AuthenticationForm.css';

interface IAuthenticationFormProps {
    onSubmit: (username: string, password: string) => void;
    failed: boolean;
    submitButtonText?: string;
    usernameValidationFunction?: (value: string) => boolean;
    passwordValidationFunction?: (value: string) => boolean;
    usernameValidationMessage?: string;
    passwordValidationMessage?: string;
    reason?: string;
}

const AuthenticationForm: React.FC<IAuthenticationFormProps> = ({
                                                                    onSubmit,
                                                                    failed,
                                                                    reason,
                                                                    submitButtonText = "Submit",
                                                                    usernameValidationFunction = (value: string) => value.length > 0,
                                                                    passwordValidationFunction = (value: string) => value.length > 0,
                                                                    usernameValidationMessage = "Username can not be empty",
                                                                    passwordValidationMessage = "Password must not be empty",
                                                                }) => {
    const {value: username, onChange: onUsernameChange, reset: resetUsername} = useInput();
    const {value: password, onChange: onPasswordChange, reset: resetPassword} = useInput();
    const usernameValidation = useValidation(usernameValidationFunction, onUsernameChange);
    const passwordValidation = useValidation(passwordValidationFunction, onPasswordChange);

    return (
        <div className={"AuthenticationForm"}>
            <input className={"form-input"} type={"text"} placeholder={"Enter Username"}
                   onChange={usernameValidation.onChange}
                   onFocus={usernameValidation.onFocus} value={username}/>
            <small className={"validation-text"}>
                {usernameValidation.touched && !usernameValidation.valid ? usernameValidationMessage : " "}
            </small>
            <input className={"form-input"} type={"password"} placeholder={"Enter Password"}
                   onChange={passwordValidation.onChange}
                   onFocus={passwordValidation.onFocus} value={password}/>
            <small className={"validation-text"}>
                {passwordValidation.touched && !passwordValidation.valid ? passwordValidationMessage : ""}
            </small>
            <button
                className={"submit-button"}
                disabled={!usernameValidation.valid || !passwordValidation.valid}
                onClick={() => {
                    onSubmit(username, password);
                    resetUsername();
                    resetPassword();
                }}>{submitButtonText}
            </button>
            {failed && reason && <div>{reason}</div>}
        </div>
    )
}

export default AuthenticationForm;