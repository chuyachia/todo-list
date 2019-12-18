import React from 'react';

import useInput from '../hooks/useInput';
import {ENTER_KEY} from '../constants';

interface ISearchInput {
    onFocus?: () => void;
    onBlur?: () => void;
    submitSearch: (value: string) => void;
}

const SearchInput: React.FC<ISearchInput> = (props) => {
    const {value, onChange} = useInput<HTMLInputElement>("");

    const handleEnterKey = (e: React.KeyboardEvent) => {
        if (e.keyCode === ENTER_KEY) {
            props.submitSearch(value);
        }
    }

    return <input className={"form-input"} type={"text"} placeholder={"Enter search term"}
                  autoFocus={true} onBlur={props.onBlur} onFocus={props.onFocus}
                  value={value} onChange={onChange} onKeyDown={handleEnterKey}/>;
}

export default SearchInput;