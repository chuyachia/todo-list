import React from 'react';

interface IValidation {
    valid: boolean;
    touched: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useValidation = (validation: (value: string) => boolean,
                       onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
                       reset?: () => void): IValidation => {
    const [valid, setValid] = React.useState(false);
    const [touched, setTouched] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e);
        setValid(validation(e.target.value));
    }

    const handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!touched) setTouched(true);
        setValid(validation(e.target.value));
    }

    return {
        valid,
        touched,
        onChange: handleChange,
        onFocus: handleFocus,
    }
}

export default useValidation;