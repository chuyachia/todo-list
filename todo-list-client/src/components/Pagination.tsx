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
    const prevPageEnabled = props.currentPage > 1;
    const nextPageEnabled = props.currentPage < props.totalPages;
    const maybeCallPrevPage = () => {
        if (prevPageEnabled) props.onPrevPageClick()
    }
    const maybeCallNextPage = () => {
        if (nextPageEnabled) props.onNextPageClick()
    }

    return (
        <div className={"buttons-wrap pagination"}>
            <button className={"primary"} onClick={props.onFirstPageClick}>
                <FontAwesomeIcon icon={faFastBackward}/>
            </button>
            <button className={prevPageEnabled ? "primary" : "disabled"} onClick={maybeCallPrevPage}>
                <FontAwesomeIcon icon={faStepBackward}/>
            </button>
            <button className={"disabled"}>{`Page ${props.currentPage} of ${props.totalPages}`}</button>
            <button className={nextPageEnabled? "primary" : "disabled"} onClick={maybeCallNextPage}>
                <FontAwesomeIcon icon={faStepForward}/>
            </button>
            <button className={"primary"} onClick={props.onLastPageClick}>
                <FontAwesomeIcon icon={faFastForward}/>
            </button>
        </div>
    )
}

export default Pagination;