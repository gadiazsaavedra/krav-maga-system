import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import AlumnoTableRow from './AlumnoTableRow';
import {
  Box, Typography, Grid, Card, CardContent, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Autocomplete,
  IconButton, Tooltip
} from '@mui/material';
import { Payment, CheckCircle, Cancel, AttachMoney, Warning } from '@mui/icons-material';

const MensualidadesTab: React.FC = () => {
  // Cargar alumnos desde localStorage (mismo que AlumnosTab)
  const [alumnosLocal, setAlumnosLocal] = useState(() => {
    const saved = localStorage.getItem('alumnos-krav-maga');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Sistema de pagos local con localStorage
  const [pagosLocal, setPagosLocal] = useState(() => {
    const saved = localStorage.getItem('pagos-krav-maga');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Guardar pagos en localStorage
  useEffect(() => {
    localStorage.setItem('pagos-krav-maga', JSON.stringify(pagosLocal));
  }, [pagosLocal]);
  const alumnos = alumnosLocal; // Usar alumnos de localStorage
  
  // Generar pagos desde alumnos locales
  const pagosGenerados = useMemo(() => {
    return alumnos.map((alumno: any) => {
      // Buscar si ya existe un pago para este alumno
      const pagoExistente = pagosLocal.find((p: any) => p.id === alumno.id);
      
      if (pagoExistente) {
        return pagoExistente; // Usar pago existente
      }
      
      // Crear nuevo pago pendiente
      return {
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        estado: 'Pendiente',
        dias_atraso: Math.floor(Math.random() * 30),
        fecha_limite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fecha_pago: null,
        monto: null,
        metodo_pago: null
      };
    });
  }, [alumnos, pagosLocal]);
  const [open, setOpen] = useState(false);
  const [selectedMes, setSelectedMes] = useState(6); // Junio
  const [selectedAño, setSelectedAño] = useState(2025);
  const [pagoRapidoOpen, setPagoRapidoOpen] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<any>(null);
  const [tarifas, setTarifas] = useState<{id: number, nombre: string, valor: number, descripcion: string}[]>(() => {
    const saved = localStorage.getItem('tarifas-krav-maga');
    return saved ? JSON.parse(saved) : [
      { id: 1, nombre: 'regular', valor: 58000, descripcion: 'Tarifa mensual regular' },
      { id: 2, nombre: 'nueva', valor: 64000, descripcion: 'Tarifa para alumnos nuevos o reincorporación' }
    ];
  });
  
  // Guardar tarifas en localStorage
  useEffect(() => {
    localStorage.setItem('tarifas-krav-maga', JSON.stringify(tarifas));
  }, [tarifas]);
  const [tarifasOpen, setTarifasOpen] = useState(false);
  const [editandoTarifa, setEditandoTarifa] = useState<{id: number, valor: number} | null>(null);
  const [formData, setFormData] = useState({
    alumno_id: '',
    monto: '15000',
    metodo_pago: 'Efectivo'
  });

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  // Las tarifas ya se cargan desde localStorage en useState

  // Ordenar pagos: morosos primero, luego por fecha límite
  const pagosOrdenados = useMemo(() => {
    return [...pagosGenerados].sort((a, b) => {
      // Primero los pendientes
      if (a.estado === 'Pendiente' && b.estado === 'Pagado') return -1;
      if (a.estado === 'Pagado' && b.estado === 'Pendiente') return 1;
      
      // Entre pendientes, ordenar por días de atraso (mayor atraso primero)
      if (a.estado === 'Pendiente' && b.estado === 'Pendiente') {
        return b.dias_atraso - a.dias_atraso;
      }
      
      // Entre pagados, ordenar por fecha de pago más reciente
      if (a.estado === 'Pagado' && b.estado === 'Pagado') {
        return new Date(b.fecha_pago || '').getTime() - new Date(a.fecha_pago || '').getTime();
      }
      
      return 0;
    });
  }, [pagosGenerados]);

  const pagados = pagosGenerados.filter((p: any) => p.estado === 'Pagado').length;
  // const pendientes = pagosGenerados.filter((p: any) => p.estado === 'Pendiente').length;
  const morosos = pagosGenerados.filter((p: any) => p.estado === 'Pendiente' && p.dias_atraso > 0).length;
  const inactivos = pagosGenerados.filter((p: any) => p.estado === 'Pendiente' && p.dias_atraso > 90).length;
  const totalRecaudado = pagosGenerados
    .filter((p: any) => p.estado === 'Pagado')
    .reduce((sum: number, p: any) => sum + (p.monto || 0), 0);

  const handlePagoRapido = (pago: any) => {
    setAlumnoSeleccionado(pago);
    setPagoRapidoOpen(true);
  };

  const confirmarPagoRapido = () => {
    if (alumnoSeleccionado) {
      // Determinar qué tarifa usar
      const tarifaRegular = tarifas.find(t => t.nombre === 'regular');
      const tarifaNueva = tarifas.find(t => t.nombre === 'nueva');
      
      // Si el alumno tiene más de 90 días de atraso o es nuevo, usar tarifa nueva
      const monto = alumnoSeleccionado.dias_atraso > 90 
        ? (tarifaNueva?.valor || 64000)
        : (tarifaRegular?.valor || 58000);
      
      // Registrar pago rápido en localStorage
      const nuevoPago = {
        id: alumnoSeleccionado.id,
        nombre: alumnoSeleccionado.nombre,
        apellido: alumnoSeleccionado.apellido,
        estado: 'Pagado',
        dias_atraso: 0,
        fecha_limite: alumnoSeleccionado.fecha_limite,
        fecha_pago: new Date().toISOString().split('T')[0],
        monto: monto,
        metodo_pago: 'Efectivo'
      };
      
      setPagosLocal((prevPagos: any[]) => {
        const index = prevPagos.findIndex((p: any) => p.id === alumnoSeleccionado.id);
        if (index !== -1) {
          const nuevosPagos = [...prevPagos];
          nuevosPagos[index] = nuevoPago;
          return nuevosPagos;
        } else {
          return [...prevPagos, nuevoPago];
        }
      });
      setPagoRapidoOpen(false);
      setAlumnoSeleccionado(null);
    }
  };

  const getEstadoColor = (pago: any) => {
    if (pago.estado === 'Pagado') return 'success';
    if (pago.dias_atraso > 90) return 'error';
    if (pago.dias_atraso > 0) return 'warning';
    return 'info';
  };

  const getEstadoTexto = (pago: any) => {
    if (pago.estado === 'Pagado') return 'Pagado';
    if (pago.dias_atraso > 90) return 'Inactivo';
    if (pago.dias_atraso > 0) return `${pago.dias_atraso}d atraso`;
    return 'Pendiente';
  };

  const handleSubmit = () => {
    if (!formData.alumno_id || !formData.monto) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    const alumnoId = parseInt(formData.alumno_id);
    const alumno = alumnos.find((a: any) => a.id === alumnoId);
    
    if (!alumno) return;
    
    // Registrar el pago en localStorage
    const nuevoPago = {
      id: alumnoId,
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      estado: 'Pagado',
      dias_atraso: 0,
      fecha_limite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fecha_pago: new Date().toISOString().split('T')[0],
      monto: parseFloat(formData.monto),
      metodo_pago: formData.metodo_pago
    };
    
    // Actualizar o agregar pago
    setPagosLocal((prevPagos: any[]) => {
      const index = prevPagos.findIndex((p: any) => p.id === alumnoId);
      if (index !== -1) {
        const nuevosPagos = [...prevPagos];
        nuevosPagos[index] = nuevoPago;
        return nuevosPagos;
      } else {
        return [...prevPagos, nuevoPago];
      }
    });
    
    handleClose();
    alert('Pago registrado exitosamente');
  };
  
  // Obtener el monto sugerido para un alumno
  const obtenerMontoSugerido = (alumnoId: number) => {
    const alumno = pagosGenerados.find((p: any) => p.id === alumnoId);
    if (!alumno) return 58000; // Valor por defecto
    
    const tarifaRegular = tarifas.find(t => t.nombre === 'regular');
    const tarifaNueva = tarifas.find(t => t.nombre === 'nueva');
    
    // Si el alumno tiene más de 90 días de atraso, usar tarifa nueva
    return alumno.dias_atraso > 90 
      ? (tarifaNueva?.valor || 64000)
      : (tarifaRegular?.valor || 58000);
  };

  const handleClose = () => {
    setOpen(false);
    const tarifaRegular = tarifas.find(t => t.nombre === 'regular');
    setFormData({
      alumno_id: '',
      monto: tarifaRegular ? tarifaRegular.valor.toString() : '58000',
      metodo_pago: 'Efectivo'
    });
  };
  
  const handleTarifaChange = (id: number, nuevoValor: number) => {
    // Actualizar tarifa en localStorage
    setTarifas(prev => prev.map(t => t.id === id ? {...t, valor: nuevoValor} : t));
    setEditandoTarifa(null);
    alert('✅ Tarifa actualizada exitosamente');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Control de Mensualidades
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setTarifasOpen(true)}
          >
            Configurar Tarifas
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Registrar Pago
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Mes</InputLabel>
            <Select
              value={selectedMes}
              onChange={(e) => setSelectedMes(Number(e.target.value))}
            >
              {meses.map((mes, index) => (
                <MenuItem key={index} value={index + 1}>
                  {mes}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Año"
            type="number"
            value={selectedAño}
            onChange={(e) => setSelectedAño(Number(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button 
            fullWidth 
            variant="outlined" 
            sx={{ height: '56px' }}
          >
            Actualizar Datos
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pagos al Día
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {pagados}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Morosos
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {morosos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Inactivos (+90d)
              </Typography>
              <Typography variant="h4" component="div" color="error.main">
                {inactivos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Recaudado
              </Typography>
              <Typography variant="h4" component="div" color="primary.main">
                ${totalRecaudado.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <AlumnoTableRow isHeader>
              <TableCell>Alumno</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Límite</TableCell>
              <TableCell>Fecha Pago</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Método</TableCell>
              <TableCell>Acciones</TableCell>
            </AlumnoTableRow>
          </TableHead>
          <TableBody>
            {pagosOrdenados.map((pago) => (
              <TableRow 
                key={pago.id}
                sx={{
                  backgroundColor: pago.dias_atraso > 90 ? '#ffebee' : 
                                  pago.dias_atraso > 0 ? '#fff3e0' : 'inherit'
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {pago.dias_atraso > 90 && <Warning color="error" fontSize="small" />}
                    {`${pago.apellido}, ${pago.nombre}`}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={pago.estado === 'Pagado' ? <CheckCircle /> : <Cancel />}
                    label={getEstadoTexto(pago)}
                    color={getEstadoColor(pago)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    color={pago.dias_atraso > 0 ? 'error' : 'textSecondary'}
                  >
                    {new Date(pago.fecha_limite).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  {pago.fecha_pago ? new Date(pago.fecha_pago).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>
                  {pago.monto ? `$${pago.monto.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell>{pago.metodo_pago || '-'}</TableCell>
                <TableCell>
                  {pago.estado === 'Pendiente' && (
                    <Tooltip title="Registrar pago rápido">
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => handlePagoRapido(pago)}
                      >
                        <AttachMoney />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para registro de pago completo */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Pago de Mensualidad</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={alumnos}
                getOptionLabel={(alumno: any) => `${alumno.apellido}, ${alumno.nombre}`}
                renderInput={(params) => <TextField {...params} label="Buscar Alumno" />}
                onChange={(event, newValue: any) => {
                  if (newValue) {
                    const montoSugerido = obtenerMontoSugerido(newValue.id);
                    setFormData({ 
                      ...formData, 
                      alumno_id: newValue.id.toString(),
                      monto: montoSugerido.toString()
                    });
                  }
                }}
                isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monto"
                type="number"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Método de Pago</InputLabel>
                <Select
                  value={formData.metodo_pago}
                  label="Método de Pago"
                  onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
                >
                  <MenuItem value="Efectivo">Efectivo</MenuItem>
                  <MenuItem value="Transferencia">Transferencia</MenuItem>
                  <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Registrar Pago
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para pago rápido */}
      <Dialog open={pagoRapidoOpen} onClose={() => setPagoRapidoOpen(false)}>
        <DialogTitle>Confirmar Pago Rápido</DialogTitle>
        <DialogContent>
          {alumnoSeleccionado && (
            <>
              <Typography>
                {/* Determinar qué tarifa mostrar */}
                {(() => {
                  const tarifaRegular = tarifas.find(t => t.nombre === 'regular');
                  const tarifaNueva = tarifas.find(t => t.nombre === 'nueva');
                  const monto = alumnoSeleccionado.dias_atraso > 90 
                    ? (tarifaNueva?.valor || 64000)
                    : (tarifaRegular?.valor || 58000);
                  
                  return (
                    <>
                      ¿Registrar pago de <strong>${monto.toLocaleString()}</strong> en efectivo para{' '}
                      <strong>{alumnoSeleccionado.apellido}, {alumnoSeleccionado.nombre}</strong>?
                    </>
                  );
                })()} 
              </Typography>
              {alumnoSeleccionado.dias_atraso > 0 && (
                <Typography color="warning.main" sx={{ mt: 1 }}>
                  Este alumno tiene {alumnoSeleccionado.dias_atraso} días de atraso.
                  {alumnoSeleccionado.dias_atraso > 90 && (
                    <strong> Se aplica tarifa para alumnos nuevos.</strong>
                  )}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPagoRapidoOpen(false)}>Cancelar</Button>
          <Button onClick={confirmarPagoRapido} variant="contained" color="primary">
            Confirmar Pago
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para configuración de tarifas */}
      <Dialog open={tarifasOpen} onClose={() => setTarifasOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configurar Tarifas de Mensualidades</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 2, mt: 1 }}>
            Configure los valores de las tarifas para los diferentes tipos de alumnos.
          </Typography>
          
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tipo de Tarifa</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tarifas.map((tarifa) => (
                  <TableRow key={tarifa.id}>
                    <TableCell>{tarifa.nombre === 'regular' ? 'Regular' : 'Nueva'}</TableCell>
                    <TableCell>{tarifa.descripcion}</TableCell>
                    <TableCell>
                      {editandoTarifa?.id === tarifa.id ? (
                        <TextField
                          size="small"
                          type="number"
                          value={editandoTarifa.valor}
                          onChange={(e) => setEditandoTarifa({...editandoTarifa, valor: Number(e.target.value)})}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleTarifaChange(tarifa.id, editandoTarifa.valor);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        `$${tarifa.valor.toLocaleString()}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editandoTarifa?.id === tarifa.id ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" onClick={() => handleTarifaChange(tarifa.id, editandoTarifa.valor)}>✓</Button>
                          <Button size="small" onClick={() => setEditandoTarifa(null)}>✗</Button>
                        </Box>
                      ) : (
                        <Button size="small" onClick={() => setEditandoTarifa({id: tarifa.id, valor: tarifa.valor})}>Editar</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTarifasOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MensualidadesTab;