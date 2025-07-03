import React, { useState, useEffect, useCallback } from 'react';
import AlumnoTableRow from './AlumnoTableRow';
import {
  Box, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Checkbox, Button, FormControl,
  InputLabel, Select, MenuItem, TextField, Card, CardContent, Alert
} from '@mui/material';
import { EventAvailable, CheckCircle, Cancel } from '@mui/icons-material';

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          <EventAvailable sx={{ mr: 1, verticalAlign: 'middle' }} />
          Control de Asistencias
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Asistencias
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {totalAsistencias}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Ausencias
              </Typography>
              <Typography variant="h4" component="div" color="error.main">
                {totalAusencias}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Porcentaje de Asistencia
              </Typography>
              <Typography variant="h4" component="div" color="primary.main">
                {porcentajeAsistencia}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
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
          />
        </Grid>
      </Grid>

      {turnoSeleccionado && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">
            Asistencia: {turnoSeleccionado.dia} {turnoSeleccionado.hora_inicio}-{turnoSeleccionado.hora_fin} | {selectedFecha}
          </Typography>
        </Box>
      )}

      <TableContainer component={Paper} sx={{
        overflowX: 'auto',
        borderRadius: 3,
        boxShadow: 3,
        '& .MuiTable-root': {
          minWidth: { xs: 600, sm: 'auto' },
          tableLayout: 'fixed',
          width: '100%'
        },
        '& .MuiTableHead-root': {
          backgroundColor: '#e3f2fd'
        },
        '& .MuiTableCell-head, & .MuiTableCell-body': {
          padding: '12px 16px !important',
          textAlign: 'left',
          verticalAlign: 'middle',
          borderRight: '1px solid #e0e0e0',
          wordWrap: 'break-word',
          overflow: 'hidden'
        },
        '& .MuiTableCell-head': {
          color: 'black',
          fontWeight: 700,
          fontSize: { xs: '0.8rem', sm: '0.9rem' },
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: '#e3f2fd !important'
        },
        '& .MuiTableRow-root:nth-of-type(even)': {
          backgroundColor: 'grey.50'
        },
        '& .MuiTableRow-root:hover': {
          backgroundColor: 'grey.100'
        }
      }}>
        <Table>
          <colgroup>
            <col style={{ width: '50%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <TableHead>
            <AlumnoTableRow isHeader>
              <TableCell>Alumno</TableCell>
              <TableCell align="center">Presente</TableCell>
              <TableCell align="center">Ausente</TableCell>
            </AlumnoTableRow>
          </TableHead>
          <TableBody>
            {alumnos.length === 0 && !loading && !error ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No hay alumnos asignados a este turno
                </TableCell>
              </TableRow>
            ) : loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Cargando alumnos...
                </TableCell>
              </TableRow>
            ) : alumnos.map((alumno) => {
              const asistencia = asistencias.find(a => a.alumno_id === alumno.id);
              const presente = asistencia ? asistencia.presente : false;
              
              return (
                <TableRow key={alumno.id}>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {`${alumno.apellido}, ${alumno.nombre}`}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      icon={<Cancel />}
                      checkedIcon={<CheckCircle />}
                      checked={presente}
                      onChange={(e) => handleAsistenciaChange(alumno.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      icon={<Cancel />}
                      checkedIcon={<CheckCircle />}
                      checked={!presente}
                      onChange={(e) => handleAsistenciaChange(alumno.id, !e.target.checked)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {error && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error.contrastText">{error}</Typography>
          <Typography variant="body2" color="error.contrastText" sx={{ mt: 1 }}>
            Sugerencia: Verifica que el turno tenga niveles de cinturón asignados y que haya alumnos con esos cinturones.
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleGuardarAsistencias}
          disabled={!selectedTurno || !selectedFecha || loading}
        >
          {loading ? 'Guardando...' : 'Guardar Asistencias'}
        </Button>
      </Box>
    </Box>
  );
};

export default AsistenciasTab;