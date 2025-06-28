import React from 'react';
import { Alert, Box } from '@mui/material';

const DemoMessage: React.FC = () => {
  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
        🚀 <strong>DEMO:</strong> Sistema funcionando con datos de prueba. 
        Las funciones de crear/editar muestran mensajes de confirmación.
      </Alert>
    </Box>
  );
};

export default DemoMessage;