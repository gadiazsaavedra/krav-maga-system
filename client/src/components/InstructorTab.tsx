import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Chip } from '@mui/material';
import { School, PlayArrow, Stop } from '@mui/icons-material';
import PanelClase from './instructor/PanelClase';
import GestorTemario from './instructor/GestorTemario';
import GestorRecordatorios from './instructor/GestorRecordatorios';

const InstructorTab: React.FC = () => {
  const [vistaActual, setVistaActual] = useState<'inicio' | 'panel' | 'temario' | 'recordatorios'>('inicio');
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<number | null>(null);

  const renderVista = () => {
    switch (vistaActual) {
      case 'panel':
        return <PanelClase turnoId={turnoSeleccionado!} onVolver={() => setVistaActual('inicio')} />;
      case 'temario':
        return <GestorTemario onVolver={() => setVistaActual('inicio')} />;
      case 'recordatorios':
        return <GestorRecordatorios onVolver={() => setVistaActual('inicio')} />;
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <School /> Panel del Instructor
            </Typography>
            
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>🎯 Gestión de Clases</Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<PlayArrow />}
                    onClick={() => setVistaActual('panel')}
                    fullWidth
                  >
                    Iniciar Clase
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>📚 Gestión de Temario</Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => setVistaActual('temario')}
                    fullWidth
                  >
                    Administrar Temas
                  </Button>
                </CardContent>
              </Card>

              <Card sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>🔔 Recordatorios</Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => setVistaActual('recordatorios')}
                    fullWidth
                  >
                    Gestionar Recordatorios
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );
    }
  };

  return renderVista();
};

export default InstructorTab;