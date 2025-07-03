import React from 'react';
import AutocompleteField from './AutocompleteField';
import { callesComunes } from '../utils/formatters';

interface DireccionFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

const DireccionField: React.FC<DireccionFieldProps> = ({
  label,
  value,
  onChange,
  error,
  helperText
}) => {
  return (
    <AutocompleteField
      label={label}
      value={value}
      onChange={onChange}
      suggestions={callesComunes}
      error={error}
      helperText={helperText}
    />
  );
};

export default DireccionField;