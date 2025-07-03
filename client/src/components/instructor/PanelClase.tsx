import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Alert, Chip } from '@mui/material';
import { ArrowBack, CheckCircle, Refresh } from '@mui/icons-material';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { TemaCurriculum, ProgresoGrupo, Recordatorio, SesionClase } from '../../types/instructor';

interface PanelClaseProps {
  turnoId: number;
  onVolver: () => void;
}

const PanelClase: React.FC<PanelClaseProps> = ({ turnoId, onVolver }) => {
  const [temas] = useLocalStorage<TemaCurriculum[]>('curriculum-temas', []);
  const [progreso, setProgreso] = useLocalStorage<ProgresoGrupo[]>('progreso-grupos', []);
  const [recordatorios] = useLocalStorage<Recordatorio[]>('recordatorios-instructor', []);
  const [sesiones, setSesiones] = useLocalStorage<SesionClase[]>('sesiones-clases', []);
  
  const [claseIniciada, setClaseIniciada] = useState(false);
  const [temaSugerido, setTemaSugerido] = useState<TemaCurriculum | null>(null);
  const [temaAnterior, setTemaAnterior] = useState<TemaCurriculum | null>(null);

  useEffect(() => {
    cargarDatosClase();
  }, [turnoId]);

  const cargarDatosClase = () => {
    const progresoGrupo = progreso.find(p => p.turno_id === turnoId);
    
    if (progresoGrupo) {
      const temaActual = temas.find(t => t.id === progresoGrupo.ultimo_tema_id);
      setTemaAnterior(temaActual || null);
      
      // Buscar siguiente tema
      if (temaActual) {
        const siguienteTema = temas.find(t => 
          t.cinturon === temaActual.cinturon && 
          t.orden === temaActual.orden + 1
        );
        setTemaSugerido(siguienteTema || null);
      }
    } else {
      // Primer tema del cinturón básico
      const primerTema = temas.find(t => t.cinturon === 'Blanco' && t.orden === 1);
      setTemaSugerido(primerTema || null);
    }
  };

  const recordatoriosInicio = recordatorios.filter(r => 
    r.momento === 'inicio' && 
    r.activo && 
    new Date(r.fecha_activacion) <= new Date() &&
    (!r.turno_id || r.turno_id === turnoId)
  );

  const finalizarClase = (tipo: 'nuevo' | 'repaso') => {
    if (!temaSugerido) return;

    // Registrar sesión
    const nuevaSesion: SesionClase = {
      id: Date.now(),
      turno_id: turnoId,
      fecha: new Date().toISOString().split('T')[0],
      tema_id: temaSugerido.id,
      tipo
    };
    setSesiones([...sesiones, nuevaSesion]);

    // Actualizar progreso solo si es tema nuevo
    if (tipo === 'nuevo') {
      const nuevoProgreso = progreso.filter(p => p.turno_id !== turnoId);
      nuevoProgreso.push({
        id: Date.now(),
        turno_id: turnoId,
        ultimo_tema_id: temaSugerido.id,
        fecha_ultima_clase: new Date().toISOString().split('T')[0],
        tipo_ultima_clase: tipo
      });
      setProgreso(nuevoProgreso);
    }

    setClaseIniciada(false);
    onVolver();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={onVolver} sx={{ mb: 2 }}>
        Volver
      </Button>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Panel de Clase - Turno {turnoId}
      </Typography>

      {/* Recordatorios de inicio */}
      {recordatoriosInicio.map(recordatorio => (
        <Alert key={recordatorio.id} severity="info" sx={{ mb: 2 }}>
          <Typography variant="h6">{recordatorio.titulo}</Typography>
          <Typography>{recordatorio.contenido}</Typography>
        </Alert>
      ))}

      {/* Información de la clase */}
      <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
        {temaAnterior && (
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                📖 Tema de la Clase Anterior
              </Typography>
              <Typography variant="h5">{temaAnterior.titulo}</Typography>
              <Chip label={temaAnterior.cinturon} size="small" />
            </CardContent>
          </Card>
        )}

        {temaSugerido && (
          <Card sx={{ border: 2, borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                🎯 Tema Sugerido para Hoy
              </Typography>
              <Typography variant="h5">{temaSugerido.titulo}</Typography>
              <Chip label={temaSugerido.cinturon} color="primary" size="small" />
              {temaSugerido.descripcion && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {temaSugerido.descripcion}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Botones de acción */}
      {!claseIniciada ? (
        <Button 
          variant="contained" 
          size="large" 
          fullWidth
          onClick={() => setClaseIniciada(true)}
        >
          Iniciar Clase
        </Button>
      ) : (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
          <Button 
            variant="contained" 
            color="success"
            startIcon={<CheckCircle />}
            onClick={() => finalizarClase('nuevo')}
          >
            Tema Nuevo Enseñado
          </Button>
          <Button 
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => finalizarClase('repaso')}
          >
            Se Repasó
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PanelClase;