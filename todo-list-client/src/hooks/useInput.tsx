import React from 'react';

interface IInput {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    reset: () => void;
}

const useInput = (initValue: string = ''): IInput => {
    const [value, setValue] = React.useState<string>(initValue);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);


    const reset = () => setValue("");

    return {
        value,
        onChange,
        reset,
    }
}

export default useInput;