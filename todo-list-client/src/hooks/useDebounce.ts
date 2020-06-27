import {useState} from 'react';

const useDebounce =  <T extends any[]>(func: (...args: T) => void, wait:number, leading: boolean): (...args: T) => void => {
    const [timeoutValue, setTimeoutValue] = useState(0);

    return (...args: T) => {

        // Apply immediately
        if (!timeoutValue && leading) {
            func.apply(null, args);
        }
        clearTimeout(timeoutValue); // is this needed?
        // Apply later
        setTimeoutValue(window.setTimeout(() => {
            setTimeoutValue(0);
            if (!leading) {
                func.apply(null, args);
            }
        }, wait));

    }
}

export default useDebounce;