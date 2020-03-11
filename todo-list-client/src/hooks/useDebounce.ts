import React, {useState} from 'react';

const useDebounce =  (func: Function, wait:number, leading: boolean): Function => {
    const [timeoutValue, setTimeoutValue] = useState(0);

    return function(this:Function) {
        const args = arguments;

        // Apply immediately
        if (!timeoutValue && leading) {
            func.apply(this, args);
        }
        clearTimeout(timeoutValue); // is this needed?
        // Apply later
        setTimeoutValue(window.setTimeout(() => {
            setTimeoutValue(0);
            if (!leading) {
                func.apply(this, args);
            }
        }, wait));

    }
}

export default useDebounce;