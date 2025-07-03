import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';

interface FechaSelectorProps {
  value: string;
  onChange: (fecha: string) => void;
  label: string;
  error?: boolean;
  helperText?: string;
  min?: string;
  max?: string;
}

const FechaSelector: React.FC<FechaSelectorProps> = ({
  value,
  onChange,
  label,
  error,
  helperText,
  min,
  max
}) => {
  return (
    <Box>
      <TextField
        fullWidth
        label={label}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        helperText={helperText}
        InputLabelProps={{ 
          shrink: true 
        }}
        inputProps={{
          min,
          max,
          style: { fontSize: '1.1rem', padding: '16px' }
        }}
        InputProps={{
          startAdornment: (
            <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
          ),
          sx: {
            minHeight: 56,
            '& input[type="date"]::-webkit-calendar-picker-indicator': {
              width: '24px',
              height: '24px',
              cursor: 'pointer'
            }
          }
        }}
        sx={{
          '& .MuiInputBase-root': {
            fontSize: '1.1rem'
          },
          '& .MuiInputLabel-root': {
            fontSize: '1rem'
          }
        }}
      />
    </Box>
  );
};

export default FechaSelector;