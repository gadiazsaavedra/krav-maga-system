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
    // Demo: Usar datos mock de alumnos
    const alumnosMock = [
      { id: 1, nombre: 'Juan', apellido: 'Pérez', cinturon: 'Amarillo' },
      { id: 2, nombre: 'María', apellido: 'González', cinturon: 'Verde' },
      { id: 3, nombre: 'Carlos', apellido: 'Rodríguez', cinturon: 'Blanco' },
      { id: 4, nombre: 'Ana', apellido: 'López', cinturon: 'Azul' },
      { id: 5, nombre: 'Pedro', apellido: 'Martín', cinturon: 'Naranja' }
    ];
    
    setAlumnos(alumnosMock);
  };

  const fetchExamenes = async () => {
    // Demo: Usar datos mock de exámenes
    const examenesMock = [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        cinturon_actual: 'Amarillo',
        cinturon_objetivo: 'Naranja',
        fecha_examen: '2024-12-20',
        aprobado: true,
        pagado: true,
        monto: 15000,
        fecha_pago: '2024-12-18'
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'González',
        cinturon_actual: 'Verde',
        cinturon_objetivo: 'Azul',
        fecha_examen: '2024-12-22',
        aprobado: true,
        pagado: false,
        monto: 20000,
        fecha_pago: null
      },
      {
        id: 3,
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        cinturon_actual: 'Blanco',
        cinturon_objetivo: 'Amarillo',
        fecha_examen: '2024-12-25',
        aprobado: false,
        pagado: false,
        monto: 12000,
        fecha_pago: null
      },
      {
        id: 4,
        nombre: 'Ana',
        apellido: 'López',
        cinturon_actual: 'Azul',
        cinturon_objetivo: 'Marrón',
        fecha_examen: '2024-12-28',
        aprobado: false,
        pagado: true,
        monto: 25000,
        fecha_pago: '2024-12-15'
      },
      {
        id: 5,
        nombre: 'Pedro',
        apellido: 'Martín',
        cinturon_actual: 'Naranja',
        cinturon_objetivo: 'Verde',
        fecha_examen: '2024-12-30',
        aprobado: true,
        pagado: false,
        monto: 18000,
        fecha_pago: null
      }
    ];
    
    setExamenes(examenesMock);
  };

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
    
    setExamenes([...examenes, nuevoExamen]);
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
    setExamenes(prevExamenes => 
      prevExamenes.map(examen => 
        examen.id === examenId 
          ? { ...examen, aprobado }
          : examen
      )
    );
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