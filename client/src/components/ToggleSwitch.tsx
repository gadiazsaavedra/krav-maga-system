import React from 'react';
import { Box, Switch, Typography, FormControlLabel } from '@mui/material';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  trueLabel?: string;
  falseLabel?: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  trueLabel = 'Sí',
  falseLabel = 'No',
  size = 'large',
  color = 'primary'
}) => {
  const switchSize = size === 'large' ? { 
    width: 62, 
    height: 34,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
      }
    },
    '& .MuiSwitch-thumb': {
      width: 32,
      height: 32,
    },
    '& .MuiSwitch-track': {
      borderRadius: 20,
    }
  } : {};

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      p: 2,
      border: '1px solid #e0e0e0',
      borderRadius: 2,
      minHeight: 100
    }}>
      <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', fontWeight: 500 }}>
        {label}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography 
          variant="body2" 
          color={!checked ? 'primary' : 'text.secondary'}
          fontWeight={!checked ? 'bold' : 'normal'}
        >
          {falseLabel}
        </Typography>
        
        <Switch
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          color={color}
          size={size === 'large' ? 'medium' : size}
          sx={switchSize}
        />
        
        <Typography 
          variant="body2" 
          color={checked ? 'primary' : 'text.secondary'}
          fontWeight={checked ? 'bold' : 'normal'}
        >
          {trueLabel}
        </Typography>
      </Box>
    </Box>
  );
};

export default ToggleSwitch;