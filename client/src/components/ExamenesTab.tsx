import React, { useState, useEffect } from 'react';
import AlumnoTableRow from './AlumnoTableRow';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Grid, Checkbox
} from '@mui/material';
import { School, Add } from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';

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
  fecha_pago: string;
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

  useEffect(() => {
    fetchAlumnos();
    fetchExamenes();
  }, []);

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/alumnos`);
      setAlumnos(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching alumnos:', error);
      setAlumnos([]);
    }
  };

  const fetchExamenes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/examenes`);
      setExamenes(response.data);
    } catch (error) {
      console.error('Error fetching examenes:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const alumno = Array.isArray(alumnos) ? alumnos.find(a => a.id === Number(formData.alumno_id)) : null;
      await axios.post(`${API_BASE_URL}/api/examenes`, {
        ...formData,
        cinturon_actual: alumno?.cinturon,
        monto: parseFloat(formData.monto)
      });
      fetchExamenes();
      handleClose();
    } catch (error) {
      console.error('Error creating examen:', error);
    }
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
    try {
      await axios.put(`http://localhost:5002/api/examenes/${examenId}/aprobar`, {
        aprobado,
        pagado: false,
        cinturon_objetivo: cinturonObjetivo
      });
      fetchExamenes();
      fetchAlumnos(); // Actualizar cinturones de alumnos
    } catch (error) {
      console.error('Error updating examen:', error);
    }
  };

  const handlePago = async (examenId: number, pagado: boolean) => {
    try {
      const examen = examenes.find(e => e.id === examenId);
      await axios.put(`http://localhost:5002/api/examenes/${examenId}/aprobar`, {
        aprobado: examen?.aprobado || false,
        pagado,
        cinturon_objetivo: examen?.cinturon_objetivo
      });
      fetchExamenes();
    } catch (error) {
      console.error('Error updating pago:', error);
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          <School sx={{ mr: 1, verticalAlign: 'middle' }} />
          Gestión de Exámenes
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Nuevo Examen
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <AlumnoTableRow isHeader>
              <TableCell>Alumno</TableCell>
              <TableCell>Cinturón Actual</TableCell>
              <TableCell>Cinturón Objetivo</TableCell>
              <TableCell>Fecha Examen</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell align="center">Aprobado</TableCell>
              <TableCell align="center">Pagado</TableCell>
              <TableCell>Estado</TableCell>
            </AlumnoTableRow>
          </TableHead>
          <TableBody>
            {examenes.map((examen) => (
              <TableRow key={examen.id}>
                <TableCell>{`${examen.apellido}, ${examen.nombre}`}</TableCell>
                <TableCell>
                  <Chip
                    label={examen.cinturon_actual}
                    sx={{
                      backgroundColor: getCinturonColor(examen.cinturon_actual),
                      color: examen.cinturon_actual === 'Blanco' ? 'black' : 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={examen.cinturon_objetivo}
                    sx={{
                      backgroundColor: getCinturonColor(examen.cinturon_objetivo),
                      color: examen.cinturon_objetivo === 'Blanco' ? 'black' : 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  {new Date(examen.fecha_examen).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  ${examen.monto?.toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={examen.aprobado}
                    onChange={(e) => handleAprobar(examen.id, e.target.checked, examen.cinturon_objetivo)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={examen.pagado}
                    onChange={(e) => handlePago(examen.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  {examen.aprobado && examen.pagado ? (
                    <Chip label="Completo" color="success" />
                  ) : examen.aprobado ? (
                    <Chip label="Pendiente Pago" color="warning" />
                  ) : (
                    <Chip label="Pendiente" color="error" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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