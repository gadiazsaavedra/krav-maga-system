import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, Chip, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, Card, CardContent, Fab
} from '@mui/material';
import { Schedule, Add, Person, AccessTime } from '@mui/icons-material';

// Datos estáticos para demostración
const turnos = [
  { id: 1, dia: 'Lunes', hora_inicio: '17:00', hora_fin: '18:00', niveles: ['Blanco'] },
  { id: 2, dia: 'Lunes', hora_inicio: '18:00', hora_fin: '19:00', niveles: ['Amarillo'] },
  { id: 3, dia: 'Lunes', hora_inicio: '19:00', hora_fin: '20:00', niveles: ['Blanco'] },
  { id: 4, dia: 'Lunes', hora_inicio: '20:00', hora_fin: '21:00', niveles: ['Naranja', 'Verde'] },
  { id: 5, dia: 'Miércoles', hora_inicio: '17:00', hora_fin: '18:00', niveles: ['Blanco'] },
  { id: 6, dia: 'Miércoles', hora_inicio: '18:00', hora_fin: '19:00', niveles: ['Amarillo'] },
  { id: 7, dia: 'Miércoles', hora_inicio: '19:00', hora_fin: '20:00', niveles: ['Blanco'] },
  { id: 8, dia: 'Miércoles', hora_inicio: '20:00', hora_fin: '21:00', niveles: ['Naranja', 'Verde'] },
  { id: 9, dia: 'Martes', hora_inicio: '13:00', hora_fin: '14:00', niveles: ['Blanco', 'Amarillo'] },
  { id: 10, dia: 'Jueves', hora_inicio: '13:00', hora_fin: '14:00', niveles: ['Blanco', 'Amarillo'] },
  { id: 11, dia: 'Viernes', hora_inicio: '17:30', hora_fin: '19:10', niveles: ['Blanco'] },
  { id: 12, dia: 'Viernes', hora_inicio: '19:10', hora_fin: '21:00', niveles: ['Amarillo', 'Naranja'] }
];

// Datos mock comentados (no utilizados)
// const alumnosMock = [...]

const TurnosTab: React.FC = () => {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAsignarDialog, setOpenAsignarDialog] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState('');
  const [selectedTurnoIds, setSelectedTurnoIds] = useState<number[]>([]);
  
  // Cargar alumnos desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('alumnos-krav-maga');
    const alumnosLocal = saved ? JSON.parse(saved) : [];
    
    // Agregar campo turnos si no existe (para compatibilidad)
    const alumnosConTurnos = alumnosLocal.map((alumno: any) => ({
      ...alumno,
      cinturon: alumno.cinturon || 'Blanco', // Cinturón por defecto
      turnos: alumno.turnos || [] // Array vacío si no tiene turnos
    }));
    
    setAlumnos(alumnosConTurnos);
  }, []);

  const handleVerAlumnos = (turno: any) => {
    setSelectedTurno(turno);
    setOpenDialog(true);
  };

  const handleAsignarAlumno = () => {
    if (!selectedAlumno || selectedTurnoIds.length === 0) {
      alert('Por favor selecciona un alumno y al menos un turno');
      return;
    }
    
    // Actualizar alumnos con los nuevos turnos
    const nuevosAlumnos = alumnos.map(alumno => 
      alumno.id === Number(selectedAlumno)
        ? { ...alumno, turnos: Array.from(new Set([...(alumno.turnos || []), ...selectedTurnoIds])) }
        : alumno
    );
    
    setAlumnos(nuevosAlumnos);
    
    // Guardar en localStorage
    localStorage.setItem('alumnos-krav-maga', JSON.stringify(nuevosAlumnos));
    
    const alumnoNombre = alumnos.find(a => a.id === Number(selectedAlumno));
    alert(`✅ ${alumnoNombre?.nombre} asignado a ${selectedTurnoIds.length} turno(s) exitosamente`);
    
    setOpenAsignarDialog(false);
    setSelectedAlumno('');
    setSelectedTurnoIds([]);
  };

  const getAlumnosPorTurno = (turnoId: number) => {
    return alumnos.filter(alumno => alumno.turnos.includes(turnoId));
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

  const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const turnosOrdenados = [...turnos].sort((a, b) => {
    const diaA = diasOrden.indexOf(a.dia);
    const diaB = diasOrden.indexOf(b.dia);
    if (diaA !== diaB) return diaA - diaB;
    return a.hora_inicio.localeCompare(b.hora_inicio);
  });

  return (
    <Box>
      {/* Header Mobile-First */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          fontWeight: 600,
          color: 'primary.main'
        }}>
          📅 Turnos
        </Typography>
      </Box>

      {/* Vista de Calendario Semanal Mobile-First */}
      <Grid container spacing={1} sx={{ mb: 3 }}>
        {diasOrden.map((dia) => {
          const turnosDia = turnosOrdenados.filter(t => t.dia === dia);
          return (
            <Grid item xs={12} sm={6} md={2.4} key={dia}>
              <Paper sx={{ 
                borderRadius: 3, 
                boxShadow: 2, 
                p: 2, 
                minHeight: 300,
                bgcolor: 'grey.50'
              }}>
                <Typography variant="h6" sx={{ 
                  textAlign: 'center', 
                  fontWeight: 600, 
                  mb: 2,
                  color: 'primary.main'
                }}>
                  {dia.substring(0, 3).toUpperCase()}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {turnosDia.map((turno) => (
                    <Card 
                      key={turno.id}
                      sx={{ 
                        borderRadius: 2,
                        boxShadow: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleVerAlumnos(turno)}
                    >
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        {/* Horario */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2" fontWeight="bold">
                            {turno.hora_inicio}-{turno.hora_fin}
                          </Typography>
                        </Box>
                        
                        {/* Niveles */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                          {turno.niveles.map((nivel) => (
                            <Chip
                              key={nivel}
                              label={nivel}
                              size="small"
                              sx={{
                                backgroundColor: getCinturonColor(nivel),
                                color: nivel === 'Blanco' ? 'black' : 'white',
                                fontSize: '0.7rem',
                                height: 20
                              }}
                            />
                          ))}
                        </Box>
                        
                        {/* Alumnos */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Person fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {getAlumnosPorTurno(turno.id).length}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      
      {/* FAB */}
      <Fab
        color="primary"
        onClick={() => setOpenAsignarDialog(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, sm: 16 },
          right: 16,
          zIndex: 1000
        }}
      >
        <Add />
      </Fab>

      {/* Dialog para ver alumnos de un turno */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md">
        <DialogTitle>
          Alumnos en turno: {selectedTurno?.dia} {selectedTurno?.hora_inicio} - {selectedTurno?.hora_fin}
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {selectedTurno && getAlumnosPorTurno(selectedTurno.id).length === 0 ? (
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                😅 No hay alumnos asignados a este turno
              </Typography>
            ) : (
              selectedTurno && getAlumnosPorTurno(selectedTurno.id).map((alumno) => (
                <Card key={alumno.id} sx={{ borderRadius: 2, boxShadow: 1 }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body1" fontWeight={500}>
                        {`${alumno.apellido}, ${alumno.nombre}`}
                      </Typography>
                    </Box>
                    <Chip
                      label={alumno.cinturon}
                      sx={{
                        backgroundColor: getCinturonColor(alumno.cinturon),
                        color: alumno.cinturon === 'Blanco' ? 'black' : 'white',
                        fontWeight: 600
                      }}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para asignar alumno a turno */}
      <Dialog open={openAsignarDialog} onClose={() => setOpenAsignarDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar Alumno a Turno</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Alumno</InputLabel>
                <Select
                  value={selectedAlumno}
                  label="Alumno"
                  onChange={(e) => {
                    setSelectedAlumno(e.target.value);
                    setSelectedTurnoIds([]); // Limpiar turnos seleccionados al cambiar alumno
                  }}
                >
                  {alumnos.map((alumno) => (
                    <MenuItem key={alumno.id} value={alumno.id}>
                      {`${alumno.apellido}, ${alumno.nombre} (${alumno.cinturon})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Turnos (múltiple)</InputLabel>
                <Select
                  multiple
                  value={selectedTurnoIds}
                  label="Turnos (múltiple)"
                  onChange={(e) => setSelectedTurnoIds(e.target.value as number[])}
                  renderValue={(selected) => {
                    const selectedTurnos = turnosOrdenados.filter(t => selected.includes(t.id));
                    return selectedTurnos.map(t => `${t.dia} ${t.hora_inicio}-${t.hora_fin}`).join(', ');
                  }}
                >
                  {turnosOrdenados
                    .filter((turno) => {
                      if (!selectedAlumno) return true; // Mostrar todos si no hay alumno seleccionado
                      const alumno = alumnos.find(a => a.id === Number(selectedAlumno));
                      return alumno ? turno.niveles.includes(alumno.cinturon) : true;
                    })
                    .map((turno) => (
                      <MenuItem key={turno.id} value={turno.id}>
                        {`${turno.dia} ${turno.hora_inicio}-${turno.hora_fin} (${turno.niveles.join(', ')})`}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAsignarDialog(false)}>Cancelar</Button>
          <Button onClick={handleAsignarAlumno} variant="contained">
            Asignar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TurnosTab;