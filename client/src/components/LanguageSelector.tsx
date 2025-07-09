import React from 'react';
import { FormControl, Select, MenuItem, Box, Typography } from '@mui/material';
import { Language } from '../i18n/translations';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  currentLanguage, 
  onLanguageChange 
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
        🌍
      </Typography>
      <FormControl size="small" sx={{ minWidth: 80 }}>
        <Select
          value={currentLanguage}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          sx={{
            fontSize: '0.8rem',
            '& .MuiSelect-select': {
              py: 0.5,
              px: 1
            }
          }}
        >
          <MenuItem value="es" sx={{ fontSize: '0.8rem' }}>
            🇪🇸 ES
          </MenuItem>
          <MenuItem value="he" sx={{ fontSize: '0.8rem' }}>
            🇮🇱 עב
          </MenuItem>
          <MenuItem value="pt" sx={{ fontSize: '0.8rem' }}>
            🇧🇷 PT
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;