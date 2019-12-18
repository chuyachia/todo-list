import React, {useEffect} from 'react';

import useInput from '../hooks/useInput';
import useDebounce from '../hooks/useDebounce';
import {ENTER_KEY} from '../constants';

interface ISearchInput {
    value: string;
    onChange: (event:React.ChangeEvent<HTMLInputElement>)=>void;
    onFocus?: () => void;
    onBlur?: () => void;
    submitSearch: (value: string) => void;
}

const SearchInput: React.FC<ISearchInput> = (props) => {
    // const {value, onChange} = useInput<HTMLInputElement>("");
    const debouncedValue = useDebounce(props.value, 300);

    // const handleEnterKey = (e: React.KeyboardEvent) => {
    //     if (e.keyCode === ENTER_KEY) {
    //         props.submitSearch(value);
    //     }
    // }

    useEffect(() => {
        if (debouncedValue !== undefined) {
            props.submitSearch(debouncedValue);
        }
    }, [debouncedValue]);

return <input className={"form-input"} type={"text"} placeholder={"Enter search term"}
              autoFocus={true} onBlur={props.onBlur} onFocus={props.onFocus}
              value={props.value} onChange={props.onChange}/>;
}

export default SearchInput;