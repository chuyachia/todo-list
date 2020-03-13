import React from 'react';

import useDebounce from '../hooks/useDebounce';
import {ENTER_KEY, ESCAPE_KEY} from '../constants';

interface ISearchInput {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    submitSearch: (value: string) => void;
}

const SearchInput: React.FC<ISearchInput> = (props) => {
    const debouncedSubmitSearch = useDebounce(props.submitSearch, 1000, true);

    const handleEnterKey = (e: React.KeyboardEvent) => {
        if (e.keyCode === ENTER_KEY) {
            debouncedSubmitSearch(props.value);
        }
        if (e.keyCode === ESCAPE_KEY) {
            props.onClose();
        }
    }

    return (
        <span tabIndex={0}>
            <input className={"form-input"} type={"text"} placeholder={"Enter search term"} onBlur={props.onClose}
                   autoFocus={true} value={props.value} onChange={props.onChange} onKeyDown={handleEnterKey}/>
        </span>);
}

export default SearchInput;