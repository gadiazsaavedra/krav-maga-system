import React, { useState, useEffect, useCallback } from 'react';
// import AlumnoTableRow from './AlumnoTableRow'; // Removido para evitar error
import {
  Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Chip, Card, CardContent, Fab, Divider
} from '@mui/material';
import { CheckCircle, Cancel, Warning, Add, Person } from '@mui/icons-material';
import ToggleSwitch from './ToggleSwitch';

const RenovacionesTab: React.FC = () => {
  const [selectedAño, setSelectedAño] = useState(2025);
  const [renovaciones, setRenovaciones] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState<any>(null);
  const [monto, setMonto] = useState('');

  const fetchRenovaciones = useCallback(() => {
    // Cargar alumnos desde localStorage
    const savedAlumnos = localStorage.getItem('alumnos-krav-maga');
    const alumnos = savedAlumnos ? JSON.parse(savedAlumnos) : [];
    
    // Cargar renovaciones existentes desde localStorage
    const savedRenovaciones = localStorage.getItem('renovaciones-krav-maga');
    const renovacionesExistentes = savedRenovaciones ? JSON.parse(savedRenovaciones) : [];
    
    // Generar renovaciones para todos los alumnos
    const renovacionesCompletas = alumnos.map((alumno: any) => {
      // Buscar si ya existe una renovación para este alumno
      const renovacionExistente = renovacionesExistentes.find((r: any) => r.id === alumno.id);
      
      if (renovacionExistente) {
        return renovacionExistente; // Usar datos existentes
      }
      
      // Crear nueva renovación pendiente
      return {
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        pago_realizado: false,
        formulario_entregado: false,
        apto_fisico_entregado: false,
        fecha_pago: null,
        monto: null
      };
    });
    
    setRenovaciones(renovacionesCompletas);
  }, []);

  // Guardar renovaciones en localStorage
  const saveRenovaciones = (renovaciones: any[]) => {
    localStorage.setItem('renovaciones-krav-maga', JSON.stringify(renovaciones));
  };

    // Función no utilizada - comentada para eliminar warning
  // const oldFetchRenovaciones = () => {
  //   const renovacionesMock = [...]
  //   setRenovaciones(renovacionesMock);
  // };

  useEffect(() => {
    fetchRenovaciones();
  }, [selectedAño, fetchRenovaciones]);

  const handlePagoClick = (alumno: any) => {
    setSelectedAlumno(alumno);
    setMonto(alumno.monto?.toString() || '25000');
    setOpen(true);
  };

  const handlePagoSubmit = async () => {
    if (selectedAlumno) {
      // Actualizar localmente
      const nuevasRenovaciones = renovaciones.map(renovacion => 
        renovacion.id === selectedAlumno.id 
          ? { 
              ...renovacion, 
              pago_realizado: true,
              fecha_pago: new Date().toISOString().split('T')[0],
              monto: parseFloat(monto)
            }
          : renovacion
      );
      
      setRenovaciones(nuevasRenovaciones);
      saveRenovaciones(nuevasRenovaciones);
      
      setOpen(false);
      setSelectedAlumno(null);
      setMonto('');
    }
  };

  const handleCheckboxChange = async (alumnoId: number, campo: string, valor: boolean) => {
    // Actualizar localmente
    const nuevasRenovaciones = renovaciones.map(renovacion => 
      renovacion.id === alumnoId 
        ? { ...renovacion, [campo]: valor }
        : renovacion
    );
    
    setRenovaciones(nuevasRenovaciones);
    saveRenovaciones(nuevasRenovaciones);
  };

  const getEstadoRenovacion = (renovacion: any) => {
    const completados = [
      renovacion.pago_realizado,
      renovacion.formulario_entregado,
      renovacion.apto_fisico_entregado
    ].filter(Boolean).length;

    if (completados === 3) return { label: 'Completa', color: 'success', icon: <CheckCircle /> };
    if (completados === 0) return { label: 'Pendiente', color: 'error', icon: <Cancel /> };
    return { label: 'En Proceso', color: 'warning', icon: <Warning /> };
  };

  const completadas = renovaciones.filter(r => 
    r.pago_realizado && r.formulario_entregado && r.apto_fisico_entregado
  ).length;

  const totalRecaudado = renovaciones
    .filter(r => r.pago_realizado)
    .reduce((sum, r) => sum + (r.monto || 0), 0);

  return (
    <Box>
      {/* Header Mobile-First */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          fontWeight: 600,
          color: 'primary.main',
          mb: 2
        }}>
          🔄 Renovaciones {selectedAño}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Chip 
            label="2024" 
            variant={selectedAño === 2024 ? "filled" : "outlined"}
            color={selectedAño === 2024 ? "primary" : "default"}
            onClick={() => setSelectedAño(2024)}
            sx={{ minHeight: 40 }}
          />
          <Chip 
            label="2025" 
            variant={selectedAño === 2025 ? "filled" : "outlined"}
            color={selectedAño === 2025 ? "primary" : "default"}
            onClick={() => setSelectedAño(2025)}
            sx={{ minHeight: 40 }}
          />
          <Chip 
            label="2026" 
            variant={selectedAño === 2026 ? "filled" : "outlined"}
            color={selectedAño === 2026 ? "primary" : "default"}
            onClick={() => setSelectedAño(2026)}
            sx={{ minHeight: 40 }}
          />
        </Box>
      </Box>

      {/* Dashboard Mobile-First */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4}>
          <Card sx={{ 
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: 'success.main',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
            transition: 'all 0.2s ease'
          }}>
            <CardContent sx={{ py: { xs: 3, sm: 2 } }}>
              <Typography variant="h2" component="div" sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem' },
                fontWeight: 700,
                mb: 1
              }}>
                {completadas}
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                ✅ Completas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card sx={{ 
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: 'warning.main',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
            transition: 'all 0.2s ease'
          }}>
            <CardContent sx={{ py: { xs: 3, sm: 2 } }}>
              <Typography variant="h2" component="div" sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem' },
                fontWeight: 700,
                mb: 1
              }}>
                {renovaciones.length - completadas}
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                ⚠️ Pendientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
            transition: 'all 0.2s ease'
          }}>
            <CardContent sx={{ py: { xs: 3, sm: 2 } }}>
              <Typography variant="h2" component="div" sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 700,
                mb: 1
              }}>
                ${(totalRecaudado / 1000).toFixed(0)}K
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                💰 Recaudado
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cards Mobile-First */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {renovaciones.map((renovacion) => {
          const estado = getEstadoRenovacion(renovacion);
          return (
            <Card 
              key={renovacion.id}
              sx={{ 
                borderRadius: 3,
                boxShadow: 2,
                borderLeft: `4px solid ${
                  estado.color === 'success' ? '#4caf50' :
                  estado.color === 'warning' ? '#ff9800' : '#f44336'
                }`,
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                {/* Header con alumno y estado */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                        {renovacion.apellido}, {renovacion.nombre}
                      </Typography>
                    </Box>
                    <Chip
                      icon={estado.icon}
                      label={estado.label}
                      color={estado.color as any}
                      size="medium"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  
                  {/* Monto si está pagado */}
                  {renovacion.pago_realizado && (
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h5" color="success.main" fontWeight="bold">
                        ${renovacion.monto?.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {renovacion.fecha_pago ? new Date(renovacion.fecha_pago).toLocaleDateString() : ''}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />
                
                {/* Toggles grandes y táctiles */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      💵 Pago Realizado
                    </Typography>
                    <ToggleSwitch
                      checked={renovacion.pago_realizado}
                      onChange={(checked) => {
                        if (checked) {
                          handlePagoClick(renovacion);
                        } else {
                          handleCheckboxChange(renovacion.id, 'pago_realizado', false);
                        }
                      }}
                      label=""
                      size="medium"
                      color="success"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      📋 Formulario Entregado
                    </Typography>
                    <ToggleSwitch
                      checked={renovacion.formulario_entregado}
                      onChange={(checked) => handleCheckboxChange(renovacion.id, 'formulario_entregado', checked)}
                      label=""
                      size="medium"
                      color="primary"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      🏅 Apto Físico Entregado
                    </Typography>
                    <ToggleSwitch
                      checked={renovacion.apto_fisico_entregado}
                      onChange={(checked) => handleCheckboxChange(renovacion.id, 'apto_fisico_entregado', checked)}
                      label=""
                      size="medium"
                      color="warning"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Dialog Mobile-First */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: { xs: 0, sm: 3 }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'success.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          💵 Registrar Pago
        </DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {selectedAlumno ? `${selectedAlumno.apellido}, ${selectedAlumno.nombre}` : ''}
          </Typography>
          
          <TextField
            fullWidth
            label="Monto de Renovación"
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            size="medium"
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
            }}
          />
        </DialogContent>
        <DialogActions sx={{ 
          p: 3,
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button 
            onClick={() => setOpen(false)}
            size="large"
            sx={{ 
              minHeight: 48,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 120 }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handlePagoSubmit} 
            variant="contained"
            color="success"
            size="large"
            sx={{
              minHeight: 48,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 120 },
              borderRadius: 3
            }}
          >
            ✅ Registrar Pago
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RenovacionesTab;