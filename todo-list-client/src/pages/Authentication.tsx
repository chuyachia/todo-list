import React, {useState} from 'react';
import AuthenticationForm from "../components/AuthenticationForm";

interface IAuthenticationProps {
    register: (username: string, password: string) => void;
    logIn: (username: string, password: string) => void;
    failed: boolean;
    reason: string;
    resetAuthState: () => void;
}

const Authentication: React.FC<IAuthenticationProps> = (props) => {
    const [isRegister, setIsRegister] = useState(false);
    const loginRegisterSwitch = (isRegister: boolean) => {
        setIsRegister(isRegister);
        props.resetAuthState();
    }

    return (
        <div>
            <div>
                <span onClick={() => loginRegisterSwitch(false)}
                      className={`clickable ${isRegister ? 'inactive-text' : ''}`}>Login</span>
                {" / "}
                <span onClick={() => loginRegisterSwitch(true)}
                      className={`clickable ${isRegister ? '' : 'inactive-text'}`}>Register</span>
            </div>
            {isRegister ?
                <AuthenticationForm
                    onSubmit={props.register}
                    failed={props.failed}
                    submitButtonText={"Register"}
                    passwordValidationFunction={(value: string) => value.length > 5}
                    passwordValidationMessage={"Password must contain more than 5 characters"}
                    reason={props.reason}/> :
                <AuthenticationForm
                    onSubmit={props.logIn}
                    failed={props.failed}
                    submitButtonText={"Login"}
                    reason={"Login failed"}/>}
        </div>
    )
}

export default Authentication;

