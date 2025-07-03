import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, LinearProgress, IconButton,
  Slide, Paper, Container
} from '@mui/material';
import { ArrowBack, ArrowForward, Check, Close } from '@mui/icons-material';

interface Campo {
  key: string;
  label: string;
  component: React.ReactNode;
  required: boolean;
  validator?: (value: any) => string | null;
}

interface FormularioProgresivoProps {
  campos: Campo[];
  valores: Record<string, any>;
  onCambio: (key: string, value: any) => void;
  onGuardar: () => void;
  onCancelar: () => void;
  titulo: string;
}

const FormularioProgresivo: React.FC<FormularioProgresivoProps> = ({
  campos,
  valores,
  onCambio,
  onGuardar,
  onCancelar,
  titulo
}) => {
  const [pasoActual, setPasoActual] = useState(0);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [direccion, setDireccion] = useState<'left' | 'right'>('right');

  // Filtrar solo campos requeridos
  const camposEsenciales = campos.filter(campo => campo.required);
  const campoActual = camposEsenciales[pasoActual];
  const progreso = ((pasoActual + 1) / camposEsenciales.length) * 100;

  // Validación en tiempo real
  useEffect(() => {
    if (campoActual && campoActual.validator) {
      const valor = valores[campoActual.key];
      const error = campoActual.validator(valor);
      setErrores(prev => ({
        ...prev,
        [campoActual.key]: error || ''
      }));
    }
  }, [valores, campoActual]);

  // Guardado automático
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('formulario-temp', JSON.stringify(valores));
    }, 1000);
    return () => clearTimeout(timer);
  }, [valores]);

  const puedeAvanzar = () => {
    if (!campoActual) return false;
    const valor = valores[campoActual.key];
    const tieneError = errores[campoActual.key];
    return valor && !tieneError;
  };

  const siguientePaso = () => {
    if (pasoActual < camposEsenciales.length - 1) {
      setDireccion('right');
      setPasoActual(pasoActual + 1);
    } else {
      onGuardar();
    }
  };

  const pasoAnterior = () => {
    if (pasoActual > 0) {
      setDireccion('left');
      setPasoActual(pasoActual - 1);
    }
  };

  if (!campoActual) return null;

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={onCancelar} sx={{ mr: 1 }}>
            <Close />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {titulo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pasoActual + 1} de {camposEsenciales.length}
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progreso} sx={{ height: 6, borderRadius: 3 }} />
      </Box>

      {/* Campo actual */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 4 }}>
        <Slide direction={direccion === 'right' ? 'left' : 'right'} in={true} key={pasoActual}>
          <Paper elevation={0} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 300 }}>
              {campoActual.label}
            </Typography>
            
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              {React.cloneElement(campoActual.component as React.ReactElement, {
                value: valores[campoActual.key] || '',
                onChange: (value: any) => onCambio(campoActual.key, value),
                error: !!errores[campoActual.key],
                helperText: errores[campoActual.key],
                autoFocus: true,
                fullWidth: true,
                size: 'large'
              })}
            </Box>

            {/* Validación visual */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              {valores[campoActual.key] && (
                errores[campoActual.key] ? 
                  <Close color="error" sx={{ fontSize: 40 }} /> :
                  <Check color="success" sx={{ fontSize: 40 }} />
              )}
            </Box>
          </Paper>
        </Slide>
      </Box>

      {/* Navegación */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        p: 3,
        borderTop: 1,
        borderColor: 'divider'
      }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={pasoAnterior}
          disabled={pasoActual === 0}
          size="large"
        >
          Anterior
        </Button>
        
        <Button
          endIcon={pasoActual === camposEsenciales.length - 1 ? <Check /> : <ArrowForward />}
          onClick={siguientePaso}
          disabled={!puedeAvanzar()}
          variant="contained"
          size="large"
        >
          {pasoActual === camposEsenciales.length - 1 ? 'Finalizar' : 'Siguiente'}
        </Button>
      </Box>
    </Container>
  );
};

export default FormularioProgresivo;