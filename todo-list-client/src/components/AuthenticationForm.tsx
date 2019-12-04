import React from 'react';
import useInput from '../hooks/useInput';
import useValidation from "../hooks/useValidation";

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

const ENTER_KEY = 13;

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
    const {value: username, onChange: onUsernameChange, reset: resetUsername} = useInput<HTMLInputElement>();
    const {value: password, onChange: onPasswordChange, reset: resetPassword} = useInput<HTMLInputElement>();
    const usernameValidation = useValidation(usernameValidationFunction, onUsernameChange);
    const passwordValidation = useValidation(passwordValidationFunction, onPasswordChange);

    const handleEnterKey = (e: React.KeyboardEvent) => {
        if (e.keyCode === ENTER_KEY && usernameValidation.valid && passwordValidation.valid) {
            submitAuthentication();
        }
    }

    const submitAuthentication = () => {
        onSubmit(username, password);
        resetUsername();
        resetPassword();
    }

    return (
        <div className={"form"} onKeyDown={handleEnterKey}>
            <input className={"form-input"} type={"text"} placeholder={"Enter Username"} autoFocus={true}
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
                onClick={submitAuthentication}>{submitButtonText}
            </button>
            {failed && reason && <i className={"warning-text"}>{reason}</i>}
        </div>
    )
}

export default AuthenticationForm;