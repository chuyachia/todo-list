import React, {useEffect} from 'react';

interface IInput<T> {
    value: string;
    onChange: (e: React.ChangeEvent<T>) => void;
    reset: () => void;
}

const useInput = <T extends HTMLInputElement | HTMLTextAreaElement| HTMLSelectElement>(initValue: string = ''): IInput<T> => {
    const [value, setValue] = React.useState<string>(initValue);

    const onChange = (e: React.ChangeEvent<T>) => setValue(e.target.value);

    const reset = () => setValue('');

    useEffect(() => {
        setValue(initValue);
    }, [initValue])

    return {
        value,
        onChange,
        reset,
    }
}

export default useInput;