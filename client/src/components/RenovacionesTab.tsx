import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlumnoTableRow from './AlumnoTableRow';
import {
  Box, Typography, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Checkbox,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Chip
} from '@mui/material';
import { Refresh, CheckCircle, Cancel, Warning } from '@mui/icons-material';



const RenovacionesTab: React.FC = () => {
  const [selectedAño, setSelectedAño] = useState(2025);
  const [renovaciones, setRenovaciones] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState<any>(null);
  const [monto, setMonto] = useState('');

  const fetchRenovaciones = async () => {
    // Demo: Usar datos mock de renovaciones
    const renovacionesMock = [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        pago_realizado: true,
        formulario_entregado: true,
        apto_fisico_entregado: true,
        fecha_pago: '2025-01-15',
        monto: 25000
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'González',
        pago_realizado: true,
        formulario_entregado: true,
        apto_fisico_entregado: false,
        fecha_pago: '2025-01-10',
        monto: 25000
      },
      {
        id: 3,
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        pago_realizado: true,
        formulario_entregado: false,
        apto_fisico_entregado: false,
        fecha_pago: '2025-01-08',
        monto: 25000
      },
      {
        id: 4,
        nombre: 'Ana',
        apellido: 'López',
        pago_realizado: false,
        formulario_entregado: false,
        apto_fisico_entregado: false,
        fecha_pago: null,
        monto: null
      },
      {
        id: 5,
        nombre: 'Pedro',
        apellido: 'Martín',
        pago_realizado: false,
        formulario_entregado: true,
        apto_fisico_entregado: false,
        fecha_pago: null,
        monto: null
      }
    ];
    
    setRenovaciones(renovacionesMock);
  };

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
      setRenovaciones(prevRenovaciones => 
        prevRenovaciones.map(renovacion => 
          renovacion.id === selectedAlumno.id 
            ? { 
                ...renovacion, 
                pago_realizado: true,
                fecha_pago: new Date().toISOString().split('T')[0],
                monto: parseFloat(monto)
              }
            : renovacion
        )
      );
      
      setOpen(false);
      setSelectedAlumno(null);
      setMonto('');
    }
  };

  const handleCheckboxChange = async (alumnoId: number, campo: string, valor: boolean) => {
    // Actualizar localmente
    setRenovaciones(prevRenovaciones => 
      prevRenovaciones.map(renovacion => 
        renovacion.id === alumnoId 
          ? { ...renovacion, [campo]: valor }
          : renovacion
      )
    );
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          <Refresh sx={{ mr: 1, verticalAlign: 'middle' }} />
          Renovaciones Anuales
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="Año"
            type="number"
            value={selectedAño}
            onChange={(e) => setSelectedAño(Number(e.target.value))}
            sx={{ width: 120 }}
          />
          <Button variant="outlined" onClick={fetchRenovaciones}>
            Actualizar
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, textAlign: 'center' }}>
            <Typography variant="h4" color="success.contrastText">
              {completadas}
            </Typography>
            <Typography color="success.contrastText">
              Renovaciones Completas
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.contrastText">
              {renovaciones.length - completadas}
            </Typography>
            <Typography color="warning.contrastText">
              Renovaciones Pendientes
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1, textAlign: 'center' }}>
            <Typography variant="h4" color="primary.contrastText">
              ${totalRecaudado.toLocaleString()}
            </Typography>
            <Typography color="primary.contrastText">
              Total Recaudado
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <AlumnoTableRow isHeader>
              <TableCell>Alumno</TableCell>
              <TableCell align="center">Pago</TableCell>
              <TableCell align="center">Formulario</TableCell>
              <TableCell align="center">Apto Físico</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Pago</TableCell>
              <TableCell>Monto</TableCell>
            </AlumnoTableRow>
          </TableHead>
          <TableBody>
            {renovaciones.map((renovacion) => {
              const estado = getEstadoRenovacion(renovacion);
              return (
                <TableRow key={renovacion.id}>
                  <TableCell>{`${renovacion.apellido}, ${renovacion.nombre}`}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={renovacion.pago_realizado}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handlePagoClick(renovacion);
                        } else {
                          handleCheckboxChange(renovacion.id, 'pago_realizado', false);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={renovacion.formulario_entregado}
                      onChange={(e) => handleCheckboxChange(renovacion.id, 'formulario_entregado', e.target.checked)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={renovacion.apto_fisico_entregado}
                      onChange={(e) => handleCheckboxChange(renovacion.id, 'apto_fisico_entregado', e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={estado.icon}
                      label={estado.label}
                      color={estado.color as any}
                    />
                  </TableCell>
                  <TableCell>
                    {renovacion.fecha_pago ? new Date(renovacion.fecha_pago).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    {renovacion.monto ? `$${renovacion.monto.toLocaleString()}` : '-'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Pago de Renovación</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Alumno: {selectedAlumno ? `${selectedAlumno.apellido}, ${selectedAlumno.nombre}` : ''}
          </Typography>
          <TextField
            fullWidth
            label="Monto de Renovación"
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handlePagoSubmit} variant="contained">
            Registrar Pago
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RenovacionesTab;