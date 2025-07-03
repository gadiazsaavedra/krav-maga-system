import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

interface CinturonSelectorProps {
  value: string;
  onChange: (cinturon: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
}

const cinturones = [
  { nombre: 'Blanco', color: '#ffffff', textColor: '#000000' },
  { nombre: 'Amarillo', color: '#ffeb3b', textColor: '#000000' },
  { nombre: 'Naranja', color: '#ff9800', textColor: '#ffffff' },
  { nombre: 'Verde', color: '#4caf50', textColor: '#ffffff' },
  { nombre: 'Azul', color: '#2196f3', textColor: '#ffffff' },
  { nombre: 'Marrón', color: '#795548', textColor: '#ffffff' },
  { nombre: 'Negro', color: '#424242', textColor: '#ffffff' }
];

const CinturonSelector: React.FC<CinturonSelectorProps> = ({
  value,
  onChange,
  label = 'Cinturón',
  error,
  helperText
}) => {
  return (
    <Box>
      {label && (
        <Typography variant="body2" color={error ? 'error' : 'text.secondary'} sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1,
        border: error ? '1px solid #d32f2f' : '1px solid #e0e0e0',
        borderRadius: 1,
        p: 1
      }}>
        {cinturones.map(cinturon => (
          <Chip
            key={cinturon.nombre}
            label={cinturon.nombre}
            onClick={() => onChange(cinturon.nombre)}
            sx={{
              backgroundColor: cinturon.color,
              color: cinturon.textColor,
              border: value === cinturon.nombre ? '3px solid #1976d2' : '1px solid #ccc',
              minHeight: 48,
              fontSize: '1rem',
              fontWeight: value === cinturon.nombre ? 'bold' : 'normal',
              '&:hover': {
                backgroundColor: cinturon.color,
                opacity: 0.8
              }
            }}
          />
        ))}
      </Box>
      {helperText && (
        <Typography variant="caption" color={error ? 'error' : 'text.secondary'} sx={{ mt: 0.5 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default CinturonSelector;