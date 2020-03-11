import React, {useEffect} from 'react';

import useDebounce from '../hooks/useDebounce';
import {ESCAPE_KEY} from '../constants';

interface ISearchInput {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    submitSearch: (value: string) => void;
}

const SearchInput: React.FC<ISearchInput> = (props) => {
    const debouncedSubmitSearch = useDebounce(props.submitSearch, 200, true);
    const debouncedOnChange = useDebounce(props.onChange, 200, true);

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedOnChange(e);
        debouncedSubmitSearch(e.target.value);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === ESCAPE_KEY) {
            props.onClose();
        }
    }

    return (
        <span tabIndex={0}>
            <input className={"form-input"} type={"text"} placeholder={"Enter search term"} onBlur={props.onClose}
                   autoFocus={true} value={props.value} onChange={handleValueChange} onKeyDown={handleKeyDown}/>
        </span>);
}

export default SearchInput;