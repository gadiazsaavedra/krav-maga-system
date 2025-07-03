import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import AlumnoTableRow from './AlumnoTableRow';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Grid, Checkbox
} from '@mui/material';
import { School, Add } from '@mui/icons-material';

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

      <TableContainer component={Paper} sx={{
        overflowX: 'auto',
        borderRadius: 3,
        boxShadow: 3,
        '& .MuiTable-root': {
          minWidth: { xs: 800, sm: 'auto' },
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
            <col style={{ width: '18%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '12%' }} />
          </colgroup>
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
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {`${examen.apellido}, ${examen.nombre}`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={examen.cinturon_actual}
                    size="small"
                    sx={{
                      backgroundColor: getCinturonColor(examen.cinturon_actual),
                      color: examen.cinturon_actual === 'Blanco' ? 'black' : 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={examen.cinturon_objetivo}
                    size="small"
                    sx={{
                      backgroundColor: getCinturonColor(examen.cinturon_objetivo),
                      color: examen.cinturon_objetivo === 'Blanco' ? 'black' : 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {new Date(examen.fecha_examen).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    ${examen.monto?.toLocaleString()}
                  </Typography>
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
                    <Chip label="Completo" color="success" size="small" />
                  ) : examen.aprobado ? (
                    <Chip label="Pendiente Pago" color="warning" size="small" />
                  ) : (
                    <Chip label="Pendiente" color="error" size="small" />
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