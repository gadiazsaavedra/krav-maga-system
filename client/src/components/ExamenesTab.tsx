import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import AlumnoTableRow from './AlumnoTableRow';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  Paper, Chip, Grid, Card, CardContent, Fab, Divider
} from '@mui/material';
import { School, Add, Person, ArrowForward } from '@mui/icons-material';
import ToggleSwitch from './ToggleSwitch';

interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  cinturon: string;
}

interface Examen {
  id: number;
  nombre: string;
  apellido: string;
  cinturon_actual: string;
  cinturon_objetivo: string;
  fecha_examen: string;
  aprobado: boolean;
  pagado: boolean;
  monto: number;
  fecha_pago: string | null;
}

const cinturones = ['Blanco', 'Amarillo', 'Naranja', 'Verde', 'Azul', 'Marrón', 'Negro'];

const ExamenesTab: React.FC = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    alumno_id: '',
    cinturon_objetivo: '',
    fecha_examen: '',
    monto: ''
  });

  // Hook para alumnos
  const [alumnosLocal] = useLocalStorage<any[]>('alumnos-krav-maga', []);
  
  const fetchAlumnos = useCallback(() => {
    setAlumnos(alumnosLocal);
  }, [alumnosLocal]);

  // Hook personalizado para localStorage
  const [examenesLocal, setExamenesLocal] = useLocalStorage<Examen[]>('examenes-krav-maga', []);
  
  const fetchExamenes = useCallback(() => {
    setExamenes(examenesLocal);
  }, [examenesLocal]);

  useEffect(() => {
    fetchAlumnos();
    fetchExamenes();
  }, [fetchAlumnos, fetchExamenes]);
  
  const saveExamenes = (examenes: Examen[]) => {
    setExamenesLocal(examenes);
  };
  
  // Función no utilizada - comentada para eliminar warning
  // const oldFetchExamenes = () => {
  //   const examenesMock = [...]
  //   setExamenes(examenesMock);
  // };

  const handleSubmit = async () => {
    if (!formData.alumno_id || !formData.cinturon_objetivo || !formData.fecha_examen || !formData.monto) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    const alumno = Array.isArray(alumnos) ? alumnos.find(a => a.id === Number(formData.alumno_id)) : null;
    
    if (!alumno) {
      alert('Alumno no encontrado');
      return;
    }
    
    const nuevoExamen = {
      id: Math.max(...examenes.map(e => e.id)) + 1,
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      cinturon_actual: alumno.cinturon,
      cinturon_objetivo: formData.cinturon_objetivo,
      fecha_examen: formData.fecha_examen,
      aprobado: false,
      pagado: false,
      monto: parseFloat(formData.monto),
      fecha_pago: null
    };
    
    const nuevosExamenes = [...examenes, nuevoExamen];
    setExamenes(nuevosExamenes);
    saveExamenes(nuevosExamenes);
    alert('✅ Examen creado exitosamente');
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      alumno_id: '',
      cinturon_objetivo: '',
      fecha_examen: '',
      monto: ''
    });
  };

  const handleAprobar = async (examenId: number, aprobado: boolean, cinturonObjetivo: string) => {
    // Actualizar localmente
    const nuevosExamenes = examenes.map(examen => 
      examen.id === examenId 
        ? { ...examen, aprobado }
        : examen
    );
    
    setExamenes(nuevosExamenes);
    saveExamenes(nuevosExamenes);
  };

  const handlePago = async (examenId: number, pagado: boolean) => {
    // Actualizar localmente
    setExamenes(prevExamenes => 
      prevExamenes.map(examen => 
        examen.id === examenId 
          ? { 
              ...examen, 
              pagado,
              fecha_pago: pagado ? new Date().toISOString().split('T')[0] : null
            }
          : examen
      )
    );
  };

  const getCinturonColor = (cinturon: string) => {
    const colors: { [key: string]: string } = {
      'Blanco': '#ffffff',
      'Amarillo': '#ffeb3b',
      'Naranja': '#ff9800',
      'Verde': '#4caf50',
      'Azul': '#2196f3',
      'Marrón': '#795548',
      'Negro': '#424242'
    };
    return colors[cinturon] || '#ffffff';
  };

  const getProximoCinturon = (cinturonActual: string) => {
    const index = cinturones.indexOf(cinturonActual);
    return index < cinturones.length - 1 ? cinturones[index + 1] : cinturonActual;
  };

  const selectedAlumno = Array.isArray(alumnos) ? alumnos.find(a => a.id === Number(formData.alumno_id)) : null;

  return (
    <Box>
      {/* Header Mobile-First */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          fontWeight: 600,
          color: 'primary.main'
        }}>
          🥋 Exámenes
        </Typography>
      </Box>
      
      {/* Dashboard Mobile-First */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
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
                {examenes.filter(e => e.aprobado && e.pagado).length}
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                ✅ Completos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
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
                {examenes.filter(e => e.aprobado && !e.pagado).length}
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                💰 Pend. Pago
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ 
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: 'error.main',
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
                {examenes.filter(e => !e.aprobado).length}
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                ⏳ Pendientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
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
                ${(examenes.filter(e => e.pagado).reduce((sum, e) => sum + e.monto, 0) / 1000).toFixed(0)}K
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                💵 Recaudado
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cards Mobile-First */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {examenes.map((examen) => (
          <Card 
            key={examen.id}
            sx={{ 
              borderRadius: 3,
              boxShadow: 2,
              borderLeft: `4px solid ${
                examen.aprobado && examen.pagado ? '#4caf50' :
                examen.aprobado ? '#ff9800' : '#f44336'
              }`,
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                      {examen.apellido}, {examen.nombre}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={examen.cinturon_actual}
                      size="medium"
                      sx={{
                        backgroundColor: getCinturonColor(examen.cinturon_actual),
                        color: examen.cinturon_actual === 'Blanco' ? 'black' : 'white',
                        fontWeight: 600
                      }}
                    />
                    <ArrowForward fontSize="small" color="action" />
                    <Chip
                      label={examen.cinturon_objetivo}
                      size="medium"
                      sx={{
                        backgroundColor: getCinturonColor(examen.cinturon_objetivo),
                        color: examen.cinturon_objetivo === 'Blanco' ? 'black' : 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  
                  <Chip
                    label={
                      examen.aprobado && examen.pagado ? 'Completo' :
                      examen.aprobado ? 'Pendiente Pago' : 'Pendiente'
                    }
                    color={
                      examen.aprobado && examen.pagado ? 'success' :
                      examen.aprobado ? 'warning' : 'error'
                    }
                    size="medium"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h5" color="primary.main" fontWeight="bold">
                    ${examen.monto?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(examen.fecha_examen).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2 }}>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Aprobado
                  </Typography>
                  <ToggleSwitch
                    checked={examen.aprobado}
                    onChange={(checked) => handleAprobar(examen.id, checked, examen.cinturon_objetivo)}
                    label=""
                    size="medium"
                    color="success"
                  />
                </Box>
                
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Pagado
                  </Typography>
                  <ToggleSwitch
                    checked={examen.pagado}
                    onChange={(checked) => handlePago(examen.id, checked)}
                    label=""
                    size="medium"
                    color="primary"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, sm: 16 },
          right: 16,
          zIndex: 1000
        }}
      >
        <Add />
      </Fab>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Examen de Cinturón</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Alumno</InputLabel>
                <Select
                  value={formData.alumno_id}
                  onChange={(e) => {
                    const alumno = Array.isArray(alumnos) ? alumnos.find(a => a.id === Number(e.target.value)) : null;
                    setFormData({ 
                      ...formData, 
                      alumno_id: e.target.value,
                      cinturon_objetivo: alumno ? getProximoCinturon(alumno.cinturon) : ''
                    });
                  }}
                >
                  {Array.isArray(alumnos) && alumnos.map((alumno) => (
                    <MenuItem key={alumno.id} value={alumno.id}>
                      {`${alumno.apellido}, ${alumno.nombre} (${alumno.cinturon})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cinturón Actual"
                value={selectedAlumno?.cinturon || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Cinturón Objetivo</InputLabel>
                <Select
                  value={formData.cinturon_objetivo}
                  onChange={(e) => setFormData({ ...formData, cinturon_objetivo: e.target.value })}
                >
                  {cinturones.map((cinturon) => (
                    <MenuItem key={cinturon} value={cinturon}>
                      {cinturon}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha del Examen"
                type="date"
                value={formData.fecha_examen}
                onChange={(e) => setFormData({ ...formData, fecha_examen: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monto del Examen"
                type="number"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                inputProps={{ inputMode: 'numeric' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Crear Examen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExamenesTab;