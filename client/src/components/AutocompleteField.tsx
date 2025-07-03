import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Box } from '@mui/material';

interface AutocompleteFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  type?: string;
  inputMode?: 'text' | 'search' | 'email' | 'tel' | 'url' | 'none' | 'numeric' | 'decimal';
  error?: boolean;
  helperText?: string;
  formatter?: (value: string) => string;
}

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  label,
  value,
  onChange,
  suggestions,
  type = 'text',
  inputMode,
  error,
  helperText,
  formatter
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (newValue: string) => {
    const formattedValue = formatter ? formatter(newValue) : newValue;
    setInputValue(formattedValue);
    onChange(formattedValue);
  };

  return (
    <Autocomplete
      freeSolo
      options={suggestions}
      value={value}
      inputValue={inputValue}
      onInputChange={(_, newValue) => handleInputChange(newValue)}
      onChange={(_, newValue) => newValue && onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          type={type}
          error={error}
          helperText={helperText}
          inputProps={{
            ...params.inputProps,
            inputMode
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ fontSize: '0.9rem', py: 1 }}>
          {option}
        </Box>
      )}
    />
  );
};

export default AutocompleteField;