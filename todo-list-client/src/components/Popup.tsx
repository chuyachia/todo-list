import React from 'react';

export interface IPopup {
    title: string;
    isOpen: boolean;
    description: string;
    leftButton: JSX.Element|null;
    rightButton: JSX.Element|null;
}

const Popup: React.FC<IPopup> = (props) => {

    return props.isOpen? (
         <div className={"overlay"}>
            <div className={"popup"}>
                <div className={"popup-title"}>{props.title}</div>
                <p>{props.description}</p>
                <div className={"buttons-wrap"}>
                    {props.leftButton}
                    {props.rightButton}
                </div>
            </div>
        </div>): null;
}

export default Popup;