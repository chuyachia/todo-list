import React from 'react';

import debounce from '../util/debounce';
import {ENTER_KEY} from '../constants';

interface ISearchInput {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    submitSearch: (value: string) => void;
}

const SearchInput: React.FC<ISearchInput> = (props) => {
    const debouncedSubmitSearch = debounce(props.submitSearch, 300);

    const handleEnterKey = (e: React.KeyboardEvent) => {
        if (e.keyCode === ENTER_KEY) {
            debouncedSubmitSearch(props.value);
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