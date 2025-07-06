import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, 
  List, ListItem, ListItemText, ListItemIcon, Divider
} from '@mui/material';
import {
  AttachMoney, School, Store, Add, Payment, Warning, CheckCircle
} from '@mui/icons-material';

const FinanzasTab: React.FC = () => {
  const [pagos, setPagos] = useState<any[]>([]);
  const [renovaciones, setRenovaciones] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    // Cargar pagos
    const savedPagos = localStorage.getItem('pagos-krav-maga');
    const pagosLocal = savedPagos ? JSON.parse(savedPagos) : [];
    setPagos(pagosLocal);

    // Cargar renovaciones
    const savedRenovaciones = localStorage.getItem('renovaciones-krav-maga');
    const renovacionesLocal = savedRenovaciones ? JSON.parse(savedRenovaciones) : [];
    setRenovaciones(renovacionesLocal);

    // Cargar pedidos (simulado)
    const pedidosMock = [
      { id: 1, alumno: 'Pérez, Juan', producto: 'Remera M', monto: 2500, estado: 'Pedido' },
      { id: 2, alumno: 'González, María', producto: 'Short L', monto: 3000, estado: 'Recibido' },
      { id: 3, alumno: 'López, Ana', producto: 'Guantes', monto: 4500, estado: 'Entregado' }
    ];
    setPedidos(pedidosMock);
  }, []);

  // Estadísticas
  const pagosPendientes = pagos.filter(p => p.estado === 'Pendiente').length;
  const renovacionesPendientes = renovaciones.filter(r => 
    !r.pago_realizado || !r.formulario_entregado || !r.apto_fisico_entregado
  ).length;
  const pedidosPendientes = pedidos.filter(p => p.estado !== 'Entregado').length;
  const totalRecaudado = pagos
    .filter(p => p.estado === 'Pagado')
    .reduce((sum, p) => sum + (p.monto || 0), 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          fontWeight: 600,
          color: 'primary.main'
        }}>
          💰 Finanzas
        </Typography>
      </Box>



      {/* Pagos pendientes */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Payment color="warning" />
              Mensualidades Pendientes
            </Typography>

          </Box>
          
          <List>
            {pagos.filter(p => p.estado === 'Pendiente').slice(0, 5).map((pago, index) => (
              <React.Fragment key={pago.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${pago.apellido}, ${pago.nombre}`}
                    secondary={`${pago.dias_atraso || 0} días de atraso`}
                  />
                  <Typography variant="h6" color="warning.main" fontWeight="bold">
                    $58K
                  </Typography>
                </ListItem>
                {index < Math.min(pagos.filter(p => p.estado === 'Pendiente').length - 1, 4) && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Renovaciones pendientes */}
      {renovacionesPendientes > 0 && (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <School color="error" />
              Renovaciones Incompletas
            </Typography>
            
            <List>
              {renovaciones.filter(r => 
                !r.pago_realizado || !r.formulario_entregado || !r.apto_fisico_entregado
              ).slice(0, 5).map((renovacion, index) => {
                const pendientes = [];
                if (!renovacion.pago_realizado) pendientes.push('Pago');
                if (!renovacion.formulario_entregado) pendientes.push('Formulario');
                if (!renovacion.apto_fisico_entregado) pendientes.push('Apto Físico');
                
                return (
                  <React.Fragment key={renovacion.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <School color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${renovacion.apellido}, ${renovacion.nombre}`}
                        secondary={`Faltan: ${pendientes.join(', ')}`}
                      />
                      <Chip
                        label={`${3 - pendientes.length}/3`}
                        color={pendientes.length === 1 ? 'warning' : 'error'}
                        size="small"
                      />
                    </ListItem>
                    {index < Math.min(renovacionesPendientes - 1, 4) && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Pedidos de indumentaria */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Store color="info" />
            Pedidos de Indumentaria
          </Typography>
          
          <List>
            {pedidos.slice(0, 5).map((pedido, index) => (
              <React.Fragment key={pedido.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Store color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary={pedido.alumno}
                    secondary={pedido.producto}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      ${pedido.monto.toLocaleString()}
                    </Typography>
                    <Chip
                      label={pedido.estado}
                      color={
                        pedido.estado === 'Entregado' ? 'success' :
                        pedido.estado === 'Recibido' ? 'info' : 'warning'
                      }
                      size="small"
                    />
                  </Box>
                </ListItem>
                {index < Math.min(pedidos.length - 1, 4) && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>


    </Box>
  );
};

export default FinanzasTab;