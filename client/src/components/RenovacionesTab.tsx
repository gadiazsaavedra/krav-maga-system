import React, { useState, useEffect, useCallback } from 'react';
// import AlumnoTableRow from './AlumnoTableRow'; // Removido para evitar error
import {
  Box, Typography, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Checkbox,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Chip
} from '@mui/material';
import { CheckCircle, Cancel, Warning } from '@mui/icons-material';
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
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: 2,
        p: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          fontWeight: 600,
          color: 'primary.main',
          mb: { xs: 1, sm: 0 }
        }}>
          🔄 Renovaciones Anuales
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="Año"
            type="number"
            value={selectedAño}
            onChange={(e) => setSelectedAño(Number(e.target.value))}
            inputProps={{ inputMode: 'numeric' }}
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
          backgroundColor: 'primary.dark',
          '& .MuiTableCell-head': {
            color: 'black',
            fontWeight: 700,
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            textShadow: '1px 1px 2px rgba(255,255,255,0.5)',
            letterSpacing: '0.5px',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: 'primary.dark !important'
          }
        },
        '& .MuiTableCell-head, & .MuiTableCell-body': {
          padding: '12px 16px !important',
          textAlign: 'left',
          verticalAlign: 'middle',
          borderRight: '1px solid #e0e0e0',
          wordWrap: 'break-word',
          overflow: 'hidden'
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
            <col style={{ width: '20%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
              <TableCell>Alumno</TableCell>
              <TableCell align="center">Pago</TableCell>
              <TableCell align="center">Formulario</TableCell>
              <TableCell align="center">Apto Físico</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Pago</TableCell>
              <TableCell>Monto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renovaciones.map((renovacion) => {
              const estado = getEstadoRenovacion(renovacion);
              return (
                <TableRow key={renovacion.id}>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {`${renovacion.apellido}, ${renovacion.nombre}`}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <ToggleSwitch
                      checked={renovacion.pago_realizado}
                      onChange={(checked) => {
                        if (checked) {
                          handlePagoClick(renovacion);
                        } else {
                          handleCheckboxChange(renovacion.id, 'pago_realizado', false);
                        }
                      }}
                      label="Pago"
                      size="small"
                      color="success"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ToggleSwitch
                      checked={renovacion.formulario_entregado}
                      onChange={(checked) => handleCheckboxChange(renovacion.id, 'formulario_entregado', checked)}
                      label="Formulario"
                      size="small"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ToggleSwitch
                      checked={renovacion.apto_fisico_entregado}
                      onChange={(checked) => handleCheckboxChange(renovacion.id, 'apto_fisico_entregado', checked)}
                      label="Apto Físico"
                      size="small"
                      color="warning"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={estado.icon}
                      label={estado.label}
                      color={estado.color as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {renovacion.fecha_pago ? new Date(renovacion.fecha_pago).toLocaleDateString() : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {renovacion.monto ? `$${renovacion.monto.toLocaleString()}` : '-'}
                    </Typography>
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
            inputProps={{ inputMode: 'numeric' }}
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