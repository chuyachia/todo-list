import React from 'react';
import useInput from '../hooks/useInput';
import useValidation from "../hooks/useValidation";
import {ENTER_KEY} from '../constants';

interface IAuthenticationFormProps {
    onSubmit: (username: string, password: string) => void;
    failed: boolean;
    submitButtonText?: string;
    usernameValidationFunction?: (value: string) => boolean;
    passwordValidationFunction?: (value: string) => boolean;
    usernameValidationMessage?: string;
    passwordValidationMessage?: string;
    reason?: string;
    loading: boolean;
}

const AuthenticationForm: React.FC<IAuthenticationFormProps> = ({
                                                                    onSubmit,
                                                                    failed,
                                                                    reason,
                                                                    loading,
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
        if (!loading) {
            onSubmit(username, password);
            resetUsername();
            resetPassword();
        }
    }
    return (
        <div className={"form"} onKeyDown={handleEnterKey}>
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
                className={`submit-button ${(!usernameValidation.valid || !passwordValidation.valid || loading) ? "disabled" : "primary"}`}
                disabled={!usernameValidation.valid || !passwordValidation.valid || loading}
                onClick={submitAuthentication}>{submitButtonText}
            </button>
            {failed && reason && <i className={"warning-text"}>{reason}</i>}
        </div>
    )
}

export default AuthenticationForm;