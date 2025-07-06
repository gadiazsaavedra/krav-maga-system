import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import AlumnoTableRow from './AlumnoTableRow';
import {
  Box, Typography, Grid, Card, CardContent, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Autocomplete,
  IconButton, Tooltip, Fab, Divider
} from '@mui/material';
import { Payment, CheckCircle, Cancel, AttachMoney, Warning, Add, Phone } from '@mui/icons-material';

const MensualidadesTab: React.FC = () => {
  // Hook personalizado para localStorage
  const [alumnosLocal] = useLocalStorage<any[]>('alumnos-krav-maga', []);
  const [pagosLocal, setPagosLocal] = useLocalStorage<any[]>('pagos-krav-maga', []);
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
  const [tarifas, setTarifas] = useLocalStorage<{id: number, nombre: string, valor: number, descripcion: string}[]>('tarifas-krav-maga', [
    { id: 1, nombre: 'regular', valor: 58000, descripcion: 'Tarifa mensual regular' },
    { id: 2, nombre: 'nueva', valor: 64000, descripcion: 'Tarifa para alumnos nuevos o reincorporación' }
  ]);
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
      {/* Header Mobile-First */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          fontWeight: 600,
          color: 'primary.main'
        }}>
          💰 Mensualidades
        </Typography>
      </Box>

      {/* Filtros simplificados */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          {meses[selectedMes - 1]} {selectedAño}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Chip 
            label="Mes Anterior" 
            variant="outlined" 
            onClick={() => {
              if (selectedMes === 1) {
                setSelectedMes(12);
                setSelectedAño(selectedAño - 1);
              } else {
                setSelectedMes(selectedMes - 1);
              }
            }}
            sx={{ minHeight: 40 }}
          />
          <Chip 
            label="Mes Actual" 
            color="primary"
            onClick={() => {
              const now = new Date();
              setSelectedMes(now.getMonth() + 1);
              setSelectedAño(now.getFullYear());
            }}
            sx={{ minHeight: 40 }}
          />
          <Chip 
            label="Mes Siguiente" 
            variant="outlined"
            onClick={() => {
              if (selectedMes === 12) {
                setSelectedMes(1);
                setSelectedAño(selectedAño + 1);
              } else {
                setSelectedMes(selectedMes + 1);
              }
            }}
            sx={{ minHeight: 40 }}
          />
        </Box>
      </Box>

      {/* Dashboard Mobile-First */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ 
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: 3,
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
            transition: 'all 0.2s ease'
          }}>
            <CardContent sx={{ py: { xs: 3, sm: 2 } }}>
              <Typography variant="h2" component="div" color="success.main" sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem' },
                fontWeight: 700,
                mb: 1
              }}>
                {pagados}
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                ✅ Al Día
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ 
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: 3,
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
            transition: 'all 0.2s ease'
          }}>
            <CardContent sx={{ py: { xs: 3, sm: 2 } }}>
              <Typography variant="h2" component="div" color="warning.main" sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem' },
                fontWeight: 700,
                mb: 1
              }}>
                {morosos}
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                ⚠️ Morosos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ 
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: 3,
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
            transition: 'all 0.2s ease'
          }}>
            <CardContent sx={{ py: { xs: 3, sm: 2 } }}>
              <Typography variant="h2" component="div" color="error.main" sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem' },
                fontWeight: 700,
                mb: 1
              }}>
                {inactivos}
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                ❌ Inactivos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ 
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: 3,
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
            transition: 'all 0.2s ease'
          }}>
            <CardContent sx={{ py: { xs: 3, sm: 2 } }}>
              <Typography variant="h2" component="div" color="primary.main" sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 700,
                mb: 1
              }}>
                ${(totalRecaudado / 1000).toFixed(0)}K
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                💰 Recaudado
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cards Mobile-First con Swipe Actions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {pagosOrdenados.map((pago) => (
          <Box
            key={pago.id}
            sx={{ position: 'relative', overflow: 'hidden', borderRadius: 3 }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              (e.currentTarget as any).startX = touch.clientX;
              (e.currentTarget as any).startY = touch.clientY;
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              const element = e.currentTarget as any;
              const deltaX = touch.clientX - element.startX;
              const deltaY = touch.clientY - element.startY;
              
              if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
                e.preventDefault();
                const card = element.querySelector('.swipe-card');
                if (card) {
                  card.style.transform = `translateX(${deltaX}px)`;
                }
              }
            }}
            onTouchEnd={(e) => {
              const element = e.currentTarget as any;
              const card = element.querySelector('.swipe-card');
              if (card) {
                const transform = card.style.transform;
                const translateX = transform ? parseInt(transform.match(/-?\\d+/)?.[0] || '0') : 0;
                
                if (Math.abs(translateX) > 80) {
                  if (translateX > 0) {
                    // Swipe right → Llamar (si hay teléfono)
                    const alumno = alumnos.find((a: any) => a.id === pago.id);
                    if (alumno?.telefono) {
                      window.open(`tel:${alumno.telefono}`, '_self');
                    }
                  } else {
                    // Swipe left → Pago rápido
                    if (pago.estado === 'Pendiente') {
                      handlePagoRapido(pago);
                    }
                  }
                }
                
                card.style.transform = 'translateX(0px)';
                card.style.transition = 'transform 0.3s ease';
                setTimeout(() => {
                  card.style.transition = '';
                }, 300);
              }
            }}
          >
            {/* Acciones de fondo */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                zIndex: 1
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: 'info.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  pl: 3,
                  color: 'white'
                }}
              >
                <Phone sx={{ mr: 1 }} />
                <Typography variant="body2" fontWeight="bold">Llamar</Typography>
              </Box>
              
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  pr: 3,
                  color: 'white'
                }}
              >
                <Typography variant="body2" fontWeight="bold">Pagar</Typography>
                <AttachMoney sx={{ ml: 1 }} />
              </Box>
            </Box>
            
            <Card 
              className="swipe-card"
              sx={{ 
                borderRadius: 3,
                boxShadow: 2,
                position: 'relative',
                zIndex: 2,
                backgroundColor: 'white',
                borderLeft: `4px solid ${
                  pago.estado === 'Pagado' ? '#4caf50' :
                  pago.dias_atraso > 90 ? '#f44336' :
                  pago.dias_atraso > 0 ? '#ff9800' : '#2196f3'
                }`,
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)'
                },
                transition: 'box-shadow 0.2s ease, transform 0.2s ease'
              }}
            >
            <CardContent sx={{ pb: 1 }}>
              {/* Header con nombre y estado */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {pago.dias_atraso > 90 && <Warning color="error" fontSize="small" />}
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                      {pago.apellido}, {pago.nombre}
                    </Typography>
                  </Box>
                  <Chip
                    icon={pago.estado === 'Pagado' ? <CheckCircle /> : <Cancel />}
                    label={getEstadoTexto(pago)}
                    color={getEstadoColor(pago)}
                    size="medium"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                
                {/* Botón de acción principal */}
                {pago.estado === 'Pendiente' && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<AttachMoney />}
                    onClick={() => handlePagoRapido(pago)}
                    sx={{
                      minHeight: 48,
                      minWidth: 120,
                      borderRadius: 3,
                      fontWeight: 600
                    }}
                  >
                    Pagar
                  </Button>
                )}
              </Box>

              {/* Información detallada */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha Límite:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={pago.dias_atraso > 0 ? 'error.main' : 'text.primary'}
                    fontWeight={pago.dias_atraso > 0 ? 600 : 400}
                  >
                    {new Date(pago.fecha_limite).toLocaleDateString()}
                  </Typography>
                </Box>
                
                {pago.estado === 'Pagado' && (
                  <>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Fecha Pago:
                      </Typography>
                      <Typography variant="body2">
                        {pago.fecha_pago ? new Date(pago.fecha_pago).toLocaleDateString() : '-'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Monto:
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="success.main">
                        {pago.monto ? `$${pago.monto.toLocaleString()}` : '-'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Método:
                      </Typography>
                      <Typography variant="body2">
                        {pago.metodo_pago || '-'}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      
      {/* Floating Action Buttons */}
      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, sm: 16 },
          right: 16,
          zIndex: 1000
        }}
      >
        <Add />
      </Fab>
      
      {/* FAB Secundario para configuración */}
      <Fab
        size="small"
        color="secondary"
        onClick={() => setTarifasOpen(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 140, sm: 76 },
          right: 16,
          zIndex: 999
        }}
      >
        ⚙️
      </Fab>

      {/* Dialog Mobile-First */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullScreen
        maxWidth="sm" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            margin: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: '90vh' },
            height: { xs: '100vh', sm: 'auto' },
            borderRadius: { xs: 0, sm: 3 }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 600,
          textAlign: 'center',
          py: { xs: 3, sm: 2 }
        }}>
          💰 Registrar Pago
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 3, sm: 3 } }}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Seleccionar Alumno
            </Typography>
            <Autocomplete
              options={alumnos}
              getOptionLabel={(alumno: any) => `${alumno.apellido}, ${alumno.nombre}`}
              renderInput={(params) => <TextField {...params} label="Buscar Alumno" size="medium" />}
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
              sx={{ mb: 3 }}
            />
            
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Detalles del Pago
            </Typography>
            <TextField
              fullWidth
              label="Monto"
              type="number"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              size="medium"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
              }}
            />
            
            <FormControl fullWidth size="medium">
              <InputLabel>Método de Pago</InputLabel>
              <Select
                value={formData.metodo_pago}
                label="Método de Pago"
                onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
              >
                <MenuItem value="Efectivo">💵 Efectivo</MenuItem>
                <MenuItem value="Transferencia">💳 Transferencia</MenuItem>
                <MenuItem value="Tarjeta">💳 Tarjeta</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 2 },
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button 
            onClick={handleClose}
            size="large"
            sx={{ 
              minHeight: 48,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 120 }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            size="large"
            sx={{
              minHeight: 48,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 120 },
              borderRadius: 3
            }}
          >
            ✅ Registrar Pago
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Pago Rápido Mobile-First */}
      <Dialog 
        open={pagoRapidoOpen} 
        onClose={() => setPagoRapidoOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            m: 2
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'success.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          ⚡ Pago Rápido
        </DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          {alumnoSeleccionado && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {alumnoSeleccionado.apellido}, {alumnoSeleccionado.nombre}
              </Typography>
              
              <Box sx={{ 
                backgroundColor: 'success.light', 
                borderRadius: 2, 
                p: 2, 
                mb: 2 
              }}>
                <Typography variant="h4" color="success.dark" fontWeight="bold">
                  {(() => {
                    const tarifaRegular = tarifas.find(t => t.nombre === 'regular');
                    const tarifaNueva = tarifas.find(t => t.nombre === 'nueva');
                    const monto = alumnoSeleccionado.dias_atraso > 90 
                      ? (tarifaNueva?.valor || 64000)
                      : (tarifaRegular?.valor || 58000);
                    return `$${monto.toLocaleString()}`;
                  })()} 
                </Typography>
                <Typography variant="body2" color="success.dark">
                  💵 Efectivo
                </Typography>
              </Box>
              
              {alumnoSeleccionado.dias_atraso > 0 && (
                <Box sx={{ 
                  backgroundColor: 'warning.light', 
                  borderRadius: 2, 
                  p: 2, 
                  mb: 2 
                }}>
                  <Typography color="warning.dark" fontWeight="bold">
                    ⚠️ {alumnoSeleccionado.dias_atraso} días de atraso
                  </Typography>
                  {alumnoSeleccionado.dias_atraso > 90 && (
                    <Typography variant="body2" color="warning.dark">
                      Se aplica tarifa para alumnos nuevos
                    </Typography>
                  )}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: 3,
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button 
            onClick={() => setPagoRapidoOpen(false)}
            size="large"
            sx={{ 
              minHeight: 48,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 120 }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmarPagoRapido} 
            variant="contained" 
            color="success"
            size="large"
            sx={{
              minHeight: 48,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 120 },
              borderRadius: 3
            }}
          >
            ✅ Confirmar Pago
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Tarifas Mobile-First */}
      <Dialog 
        open={tarifasOpen} 
        onClose={() => setTarifasOpen(false)} 
fullScreen
        maxWidth="sm" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            margin: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: '90vh' },
            borderRadius: { xs: 0, sm: 3 }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'secondary.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 3, sm: 2 }
        }}>
          ⚙️ Configurar Tarifas
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 3, sm: 3 } }}>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
            Ajusta los valores de las mensualidades
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {tarifas.map((tarifa) => (
              <Card key={tarifa.id} sx={{ 
                borderRadius: 3,
                boxShadow: 2,
                border: editandoTarifa?.id === tarifa.id ? '2px solid' : 'none',
                borderColor: 'primary.main'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {tarifa.nombre === 'regular' ? '👥 Tarifa Regular' : '🆕 Tarifa Nueva'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {tarifa.descripcion}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                    {editandoTarifa?.id === tarifa.id ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <TextField
                          type="number"
                          value={editandoTarifa.valor}
                          onChange={(e) => setEditandoTarifa({...editandoTarifa, valor: Number(e.target.value)})}
                          size="medium"
                          sx={{ flex: 1 }}
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                          }}
                          autoFocus
                        />
                        <Button 
                          variant="contained" 
                          color="success"
                          onClick={() => handleTarifaChange(tarifa.id, editandoTarifa.valor)}
                          sx={{ minHeight: 48, minWidth: 48 }}
                        >
                          ✓
                        </Button>
                        <Button 
                          variant="outlined"
                          onClick={() => setEditandoTarifa(null)}
                          sx={{ minHeight: 48, minWidth: 48 }}
                        >
                          ✗
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                          ${tarifa.valor.toLocaleString()}
                        </Typography>
                        <Button 
                          variant="contained"
                          onClick={() => setEditandoTarifa({id: tarifa.id, valor: tarifa.valor})}
                          sx={{ minHeight: 48, minWidth: 100 }}
                        >
                          ✏️ Editar
                        </Button>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 3, sm: 2 } }}>
          <Button 
            onClick={() => setTarifasOpen(false)}
            variant="contained"
            size="large"
            sx={{ 
              minHeight: 48,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 120 }
            }}
          >
            ✅ Listo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MensualidadesTab;