import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

interface FormTextFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (newValue: string) => void;
    validate?: (value: string) => string | null; // Validation function -> needs to return a string if there is an error
}

const FormTextField: React.FC<FormTextFieldProps> = ({ label, value, onChange, validate }) => {
    const [error, setError] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        onChange(newValue);

        if (validate) {
            const validationError = validate(newValue);
            setError(validationError);
        } else {
            setError(null); // No validation, no error
        }
    };
    return (
        <TextField
            id="outlined-basic"
            label={label}
            value={value}
            onChange={handleChange}
            error={!!error} // Boolean flag to indicate if there's an error
            helperText={error} // Error message to show
            fullWidth
            variant="outlined"
        />
    );
}

export default FormTextField;