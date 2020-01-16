import React, {useState} from 'react';
import AuthenticationForm from "../components/AuthenticationForm";

interface IAuthenticationProps {
    register: (username: string, password: string) => Promise<boolean>;
    logIn: (username: string, password: string) => Promise<boolean>;
    failed: boolean;
    reason: string;
    resetAuthState: () => void;
    loading: boolean;
    hideLogin: ()=> void;
}

const Authentication: React.FC<IAuthenticationProps> = (props) => {
    const [isRegister, setIsRegister] = useState(false);
    const loginRegisterSwitch = (isRegister: boolean) => {
        setIsRegister(isRegister);
        props.resetAuthState();
    }



    return (
        <div className={"authentication"}>
            <div>
                <span onClick={() => loginRegisterSwitch(false)}
                      className={`clickable ${isRegister ? 'inactive-text' : 'active-text'}`}>Login</span>
                {" / "}
                <span onClick={() => loginRegisterSwitch(true)}
                      className={`clickable ${isRegister ? 'active-text' : 'inactive-text'}`}>Register</span>
            </div>
            {isRegister ?
                <AuthenticationForm
                    onSubmit={props.register}
                    failed={props.failed}
                    submitButtonText={props.loading ? "Registering ..." : "Register"}
                    passwordValidationFunction={(value: string) => value.length > 5}
                    passwordValidationMessage={"Password must contain more than 5 characters"}
                    reason={props.reason}
                    loading={props.loading}
                    hideLogin = {props.hideLogin}
                    resetAuthState = {props.resetAuthState}
                /> :
                <AuthenticationForm
                    onSubmit={props.logIn}
                    failed={props.failed}
                    submitButtonText={props.loading ? "Logging..." :"Login"}
                    reason={props.reason}
                    loading={props.loading}
                    hideLogin = {props.hideLogin}
                    resetAuthState = {props.resetAuthState}
                />}
        </div>
    )
}

export default Authentication;

