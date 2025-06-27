import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
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

// Función para obtener el día actual de la semana
const obtenerDiaActual = (): string => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[new Date().getDay()];
};

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
  const [diaActual] = useState(obtenerDiaActual());

  // Cargar turnos
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/turnos`);
        setTurnos(response.data);
        
        // Mostrar todos los turnos disponibles
        setTurnosFiltrados(response.data);
        
        // Seleccionar el primer turno disponible
        if (response.data.length > 0) {
          setSelectedTurno(response.data[0].id.toString());
        }
      } catch (error) {
        console.error('Error cargando turnos:', error);
        setError('Error al cargar los turnos');
      }
    };
    
    fetchTurnos();
  }, []);

  // Cargar alumnos cuando se selecciona un turno
  useEffect(() => {
    if (!selectedTurno) return;
    
    const fetchAlumnos = async () => {
      setLoading(true);
      setError(''); // Limpiar errores anteriores
      
      try {
        console.log('Cargando alumnos para turno:', selectedTurno);
        const response = await axios.get(`${API_BASE_URL}/api/alumnos/turno/${selectedTurno}`);
        console.log('Alumnos recibidos:', response.data);
        
        if (response.data.length === 0) {
          setError('No hay alumnos asignados a este turno');
        }
        
        setAlumnos(response.data);
        
        // Cargar asistencias para este turno y fecha
        await fetchAsistencias();
      } catch (error: any) {
        console.error('Error cargando alumnos:', error);
        if (error.response && error.response.status === 404) {
          setError('El turno seleccionado no existe');
        } else {
          setError('Error al cargar los alumnos: ' + (error.response?.data?.error || error.message));
        }
        setAlumnos([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlumnos();
  }, [selectedTurno, selectedFecha]);

  // Función para cargar asistencias
  const fetchAsistencias = async () => {
    if (!selectedTurno || !selectedFecha) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/asistencias/${selectedFecha}/${selectedTurno}`);
      setAsistencias(response.data);
    } catch (error) {
      console.error('Error cargando asistencias:', error);
      setError('Error al cargar las asistencias');
    }
  };

  // Manejar cambio de asistencia
  const handleAsistenciaChange = async (alumnoId: number, presente: boolean) => {
    try {
      await axios.post(`${API_BASE_URL}/api/asistencias`, {
        alumno_id: alumnoId,
        turno_id: Number(selectedTurno),
        fecha: selectedFecha,
        presente
      });
      
      // Actualizar estado local
      setAsistencias(prev => {
        const existente = prev.find(a => a.alumno_id === alumnoId);
        if (existente) {
          return prev.map(a => a.alumno_id === alumnoId ? { ...a, presente } : a);
        } else {
          const alumno = alumnos.find(a => a.id === alumnoId);
          if (!alumno) return prev;
          
          return [...prev, {
            alumno_id: alumnoId,
            alumno_nombre: alumno.nombre,
            alumno_apellido: alumno.apellido,
            turno_id: Number(selectedTurno),
            fecha: selectedFecha,
            presente
          }];
        }
      });
    } catch (error) {
      console.error('Error guardando asistencia:', error);
      setError('Error al guardar la asistencia');
    }
  };

  // Guardar todas las asistencias
  const handleGuardarAsistencias = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Para cada alumno que no tenga asistencia registrada, registrar como ausente
      const alumnosConAsistencia = asistencias.map(a => a.alumno_id);
      const alumnosSinAsistencia = alumnos.filter(a => !alumnosConAsistencia.includes(a.id));
      
      // Registrar ausencias para alumnos sin asistencia
      await Promise.all(alumnosSinAsistencia.map(alumno => 
        axios.post(`${API_BASE_URL}/api/asistencias`, {
          alumno_id: alumno.id,
          turno_id: Number(selectedTurno),
          fecha: selectedFecha,
          presente: false
        })
      ));
      
      // Actualizar estado local con las nuevas ausencias
      setAsistencias(prev => {
        const nuevasAusencias = alumnosSinAsistencia.map(alumno => ({
          alumno_id: alumno.id,
          alumno_nombre: alumno.nombre,
          alumno_apellido: alumno.apellido,
          turno_id: Number(selectedTurno),
          fecha: selectedFecha,
          presente: false
        }));
        return [...prev, ...nuevasAusencias];
      });
      
      setSuccess('Asistencias guardadas exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error guardando asistencias:', error);
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

      <TableContainer component={Paper}>
        <Table>
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
                  <TableCell>{`${alumno.apellido}, ${alumno.nombre}`}</TableCell>
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