import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { Schedule, Group } from '@mui/icons-material';

interface TurnoSelectorProps {
  value: string;
  onChange: (turno: string) => void;
  turnos: Array<{
    id: string;
    dia: string;
    hora_inicio: string;
    hora_fin: string;
    niveles?: string[];
  }>;
  label?: string;
}

const TurnoSelector: React.FC<TurnoSelectorProps> = ({
  value,
  onChange,
  turnos,
  label = 'Seleccionar Turno'
}) => {
  return (
    <Box>
      {label && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          {label}
        </Typography>
      )}
      <Box sx={{ 
        display: 'grid', 
        gap: 2, 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }
      }}>
        {turnos.map(turno => (
          <Card
            key={turno.id}
            onClick={() => onChange(turno.id)}
            sx={{
              cursor: 'pointer',
              border: value === turno.id ? '3px solid #1976d2' : '1px solid #e0e0e0',
              backgroundColor: value === turno.id ? '#e3f2fd' : 'white',
              minHeight: 120,
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                {turno.dia}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Schedule sx={{ mr: 0.5, fontSize: '1rem' }} />
                <Typography variant="body1" fontWeight="bold">
                  {turno.hora_inicio} - {turno.hora_fin}
                </Typography>
              </Box>
              {turno.niveles && turno.niveles.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                  {turno.niveles.map(nivel => (
                    <Chip 
                      key={nivel} 
                      label={nivel} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default TurnoSelector;