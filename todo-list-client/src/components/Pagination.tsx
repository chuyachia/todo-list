import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFastBackward, faStepBackward} from "@fortawesome/free-solid-svg-icons";
import {faStepForward} from "@fortawesome/free-solid-svg-icons/faStepForward";
import {faFastForward} from "@fortawesome/free-solid-svg-icons/faFastForward";

interface IPagination {
    onFirstPageClick: () => void;
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
    onLastPageClick: () => void;
    currentPage: number;
    totalPages: number;
}

const Pagination: React.FC<IPagination> = (props) => {
    return (
        <div className={"buttons-wrap"}>
            <button className={"primary"} onClick={props.onFirstPageClick}>
                <FontAwesomeIcon
                    icon={faFastBackward}/></button>
            <button className={props.currentPage > 1 ? "primary" : "disabled"}
                    onClick={props.onPrevPageClick}><FontAwesomeIcon
                icon={faStepBackward}/></button>
            <button className={"disabled"}>{`Page ${props.currentPage} of ${props.totalPages}`}</button>
            <button className={props.currentPage < props.totalPages ? "primary" : "disabled"}
                    onClick={props.onNextPageClick}><FontAwesomeIcon
                icon={faStepForward}/></button>
            <button className={"primary"} onClick={props.onLastPageClick}>
                <FontAwesomeIcon
                    icon={faFastForward}/></button>
        </div>
    )
}

export default Pagination;