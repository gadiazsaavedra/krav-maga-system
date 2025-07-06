import React, { useState, useEffect, useCallback } from 'react';
import AlumnoTableRow from './AlumnoTableRow';
import {
  Box, Typography, Grid, Paper, Button, FormControl,
  InputLabel, Select, MenuItem, TextField, Card, CardContent, Alert, Fab, Chip
} from '@mui/material';
import { EventAvailable, Person, Save, CheckCircle, Cancel } from '@mui/icons-material';
import ToggleSwitch from './ToggleSwitch';

// Interfaces
interface Turno {
  id: number;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
  niveles: string[];
}

interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  cinturon: string;
  grupo: string;
}

interface Asistencia {
  id?: number;
  alumno_id: number;
  alumno_nombre: string;
  alumno_apellido: string;
  turno_id: number;
  fecha: string;
  presente: boolean;
}

// Función para obtener el día actual de la semana (comentada porque no se usa)
// const obtenerDiaActual = (): string => {
//   const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
//   return dias[new Date().getDay()];
// };

const AsistenciasTab: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [turnosFiltrados, setTurnosFiltrados] = useState<Turno[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [selectedTurno, setSelectedTurno] = useState('');
  const [selectedFecha, setSelectedFecha] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // const [diaActual] = useState(obtenerDiaActual());

  // Cargar turnos desde datos locales
  useEffect(() => {
    // Turnos estáticos (mismos que TurnosTab)
    const turnosLocales = [
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
    
    setTurnos(turnosLocales);
    setTurnosFiltrados(turnosLocales);
    
    if (turnosLocales.length > 0) {
      setSelectedTurno(turnosLocales[0].id.toString());
    }
  }, []);

  // Función para cargar alumnos del turno
  const cargarAlumnosDelTurno = useCallback(() => {
    if (!selectedTurno) return;
    
    setLoading(true);
    setError('');
    
    // Cargar alumnos desde localStorage
    const saved = localStorage.getItem('alumnos-krav-maga');
    const todosLosAlumnos = saved ? JSON.parse(saved) : [];
    
    // Filtrar alumnos que tienen este turno asignado
    const alumnosDelTurno = todosLosAlumnos.filter((alumno: any) => 
      alumno.turnos && alumno.turnos.includes(Number(selectedTurno))
    );
    
    // Debug: mostrar información útil (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      console.log('Debug Asistencias:');
      console.log('- Turno seleccionado:', selectedTurno);
      console.log('- Total alumnos:', todosLosAlumnos.length);
      console.log('- Alumnos con turnos:', todosLosAlumnos.filter((a: any) => a.turnos && a.turnos.length > 0).length);
      console.log('- Alumnos en este turno:', alumnosDelTurno.length);
      
      // Debug detallado: mostrar turnos de cada alumno
      todosLosAlumnos.forEach((alumno: any) => {
        if (alumno.turnos && alumno.turnos.length > 0) {
          console.log(`- ${alumno.nombre} ${alumno.apellido}: turnos [${alumno.turnos.join(', ')}]`);
        }
      });
    }
    
    if (alumnosDelTurno.length === 0) {
      const alumnosConTurnos = todosLosAlumnos.filter((a: any) => a.turnos && a.turnos.length > 0);
      if (alumnosConTurnos.length === 0) {
        setError('No hay alumnos con turnos asignados. Ve al tab Turnos para asignar turnos a los alumnos.');
      } else {
        setError(`No hay alumnos asignados a este turno. Hay ${alumnosConTurnos.length} alumno(s) con otros turnos asignados.`);
      }
    }
    
    setAlumnos(alumnosDelTurno);
    
    // Cargar asistencias
    fetchAsistencias();
    
    setLoading(false);
  }, [selectedTurno, selectedFecha]);
  
  // Cargar alumnos cuando cambia turno o fecha
  useEffect(() => {
    cargarAlumnosDelTurno();
  }, [selectedTurno, selectedFecha, cargarAlumnosDelTurno]);
  
  // Listener para cambios en localStorage (cuando se actualiza desde otros tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Detectado cambio en alumnos, recargando...');
      }
      cargarAlumnosDelTurno();
    };
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar evento personalizado para cambios en la misma pestaña
    window.addEventListener('alumnos-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('alumnos-updated', handleStorageChange);
    };
  }, [selectedTurno, cargarAlumnosDelTurno]);

  // Función para cargar asistencias desde localStorage
  const fetchAsistencias = () => {
    if (!selectedTurno || !selectedFecha) return;
    
    const saved = localStorage.getItem('asistencias-krav-maga');
    const todasLasAsistencias = saved ? JSON.parse(saved) : [];
    
    // Filtrar asistencias para este turno y fecha
    const asistenciasFiltradas = todasLasAsistencias.filter((a: any) => 
      a.turno_id === Number(selectedTurno) && a.fecha === selectedFecha
    );
    
    setAsistencias(asistenciasFiltradas);
  };

  // Manejar cambio de asistencia con localStorage
  const handleAsistenciaChange = (alumnoId: number, presente: boolean) => {
    // Actualizar estado local
    setAsistencias(prev => {
      const existente = prev.find(a => a.alumno_id === alumnoId);
      let nuevasAsistencias;
      
      if (existente) {
        nuevasAsistencias = prev.map(a => a.alumno_id === alumnoId ? { ...a, presente } : a);
      } else {
        const alumno = alumnos.find(a => a.id === alumnoId);
        if (!alumno) return prev;
        
        nuevasAsistencias = [...prev, {
          id: Date.now(), // ID único
          alumno_id: alumnoId,
          alumno_nombre: alumno.nombre,
          alumno_apellido: alumno.apellido,
          turno_id: Number(selectedTurno),
          fecha: selectedFecha,
          presente
        }];
      }
      
      // Guardar en localStorage
      const saved = localStorage.getItem('asistencias-krav-maga');
      const todasLasAsistencias = saved ? JSON.parse(saved) : [];
      
      // Actualizar o agregar asistencia
      const asistenciaIndex = todasLasAsistencias.findIndex((a: any) => 
        a.alumno_id === alumnoId && a.turno_id === Number(selectedTurno) && a.fecha === selectedFecha
      );
      
      if (asistenciaIndex !== -1) {
        todasLasAsistencias[asistenciaIndex].presente = presente;
      } else {
        const alumno = alumnos.find(a => a.id === alumnoId);
        if (alumno) {
          todasLasAsistencias.push({
            id: Date.now(),
            alumno_id: alumnoId,
            alumno_nombre: alumno.nombre,
            alumno_apellido: alumno.apellido,
            turno_id: Number(selectedTurno),
            fecha: selectedFecha,
            presente
          });
        }
      }
      
      localStorage.setItem('asistencias-krav-maga', JSON.stringify(todasLasAsistencias));
      
      return nuevasAsistencias;
    });
  };

  // Guardar todas las asistencias
  const handleGuardarAsistencias = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Para cada alumno que no tenga asistencia registrada, registrar como ausente
      const alumnosConAsistencia = asistencias.map(a => a.alumno_id);
      const alumnosSinAsistencia = alumnos.filter(a => !alumnosConAsistencia.includes(a.id));
      
      // Actualizar estado local con las nuevas ausencias
      setAsistencias(prev => {
        const nuevasAusencias = alumnosSinAsistencia.map(alumno => ({
          id: Date.now() + alumno.id, // ID único
          alumno_id: alumno.id,
          alumno_nombre: alumno.nombre,
          alumno_apellido: alumno.apellido,
          turno_id: Number(selectedTurno),
          fecha: selectedFecha,
          presente: false
        }));
        
        // Guardar en localStorage
        const saved = localStorage.getItem('asistencias-krav-maga');
        const todasLasAsistencias = saved ? JSON.parse(saved) : [];
        
        // Agregar nuevas ausencias al localStorage
        const asistenciasActualizadas = [...todasLasAsistencias, ...nuevasAusencias];
        localStorage.setItem('asistencias-krav-maga', JSON.stringify(asistenciasActualizadas));
        
        return [...prev, ...nuevasAusencias];
      });
      
      setSuccess('Asistencias guardadas exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error guardando asistencias:', error);
      }
      setError('Error al guardar las asistencias');
    } finally {
      setLoading(false);
    }
  };

  // Estadísticas
  const totalAlumnos = alumnos.length;
  const totalAsistencias = asistencias.filter(a => a.presente).length;
  const totalAusencias = totalAlumnos - totalAsistencias;
  const porcentajeAsistencia = totalAlumnos > 0 ? 
    Math.round((totalAsistencias / totalAlumnos) * 100) : 0;

  // Obtener información del turno seleccionado
  const turnoSeleccionado = turnos.find(t => t.id === Number(selectedTurno));

  return (
    <Box>
      {/* Header Mobile-First */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          fontWeight: 600,
          color: 'primary.main'
        }}>
          ✅ Asistencias
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Dashboard Mobile-First */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4} sm={4}>
          <Card sx={{ 
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: 'success.main',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
            transition: 'all 0.2s ease'
          }}>
            <CardContent sx={{ py: { xs: 2, sm: 2 } }}>
              <Typography variant="h2" component="div" sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 700,
                mb: 0.5
              }}>
                {totalAsistencias}
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                ✅ Presentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4} sm={4}>
          <Card sx={{ 
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: 'error.main',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
            transition: 'all 0.2s ease'
          }}>
            <CardContent sx={{ py: { xs: 2, sm: 2 } }}>
              <Typography variant="h2" component="div" sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 700,
                mb: 0.5
              }}>
                {totalAusencias}
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                ❌ Ausentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4} sm={4}>
          <Card sx={{ 
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
            transition: 'all 0.2s ease'
          }}>
            <CardContent sx={{ py: { xs: 2, sm: 2 } }}>
              <Typography variant="h2" component="div" sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 700,
                mb: 0.5
              }}>
                {porcentajeAsistencia}%
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                📊 Asistencia
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controles Mobile-First */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="medium">
              <InputLabel>Turno</InputLabel>
              <Select
                value={selectedTurno}
                label="Turno"
                onChange={(e) => setSelectedTurno(e.target.value)}
              >
                {turnosFiltrados.map((turno) => (
                  <MenuItem key={turno.id} value={turno.id}>
                    {`${turno.dia} ${turno.hora_inicio}-${turno.hora_fin}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={selectedFecha}
              onChange={(e) => setSelectedFecha(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="medium"
            />
          </Grid>
        </Grid>
        
        {turnoSeleccionado && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Chip 
              label={`${turnoSeleccionado.dia} ${turnoSeleccionado.hora_inicio}-${turnoSeleccionado.hora_fin} | ${new Date(selectedFecha).toLocaleDateString()}`}
              color="primary"
              sx={{ fontSize: '0.9rem', py: 2, px: 1 }}
            />
          </Box>
        )}
      </Box>

      {/* Cards Mobile-First */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {alumnos.length === 0 && !loading && !error ? (
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                😅 No hay alumnos asignados a este turno
              </Typography>
            </CardContent>
          </Card>
        ) : loading ? (
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                🔄 Cargando alumnos...
              </Typography>
            </CardContent>
          </Card>
        ) : alumnos.map((alumno) => {
          const asistencia = asistencias.find(a => a.alumno_id === alumno.id);
          const presente = asistencia ? asistencia.presente : false;
          
          return (
            <Card 
              key={alumno.id}
              sx={{ 
                borderRadius: 3,
                boxShadow: 2,
                borderLeft: `4px solid ${presente ? '#4caf50' : '#f44336'}`,
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                      {alumno.apellido}, {alumno.nombre}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {presente ? 'Presente' : 'Ausente'}
                    </Typography>
                    <ToggleSwitch
                      checked={presente}
                      onChange={(checked) => handleAsistenciaChange(alumno.id, checked)}
                      label=""
                      size="medium"
                      color={presente ? "success" : "error"}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
      
      {/* FAB para guardar */}
      <Fab
        color="primary"
        onClick={handleGuardarAsistencias}
        disabled={!selectedTurno || !selectedFecha || loading}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, sm: 16 },
          right: 16,
          zIndex: 1000
        }}
      >
        <Save />
      </Fab>
      
      {error && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error.contrastText">{error}</Typography>
          <Typography variant="body2" color="error.contrastText" sx={{ mt: 1 }}>
            Sugerencia: Verifica que el turno tenga niveles de cinturón asignados y que haya alumnos con esos cinturones.
          </Typography>
        </Box>
      )}


    </Box>
  );
};

export default AsistenciasTab;