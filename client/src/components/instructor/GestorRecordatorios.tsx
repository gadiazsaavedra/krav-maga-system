import React, { useState } from 'react';
import { 
  Box, Typography, Button, Card, CardContent, TextField, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, IconButton, Chip, Switch,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { ArrowBack, Add, Edit, Delete, Notifications } from '@mui/icons-material';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Recordatorio } from '../../types/instructor';

interface GestorRecordatoriosProps {
  onVolver: () => void;
}

const GestorRecordatorios: React.FC<GestorRecordatoriosProps> = ({ onVolver }) => {
  const [recordatorios, setRecordatorios] = useLocalStorage<Recordatorio[]>('recordatorios-instructor', []);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [recordatorioEditando, setRecordatorioEditando] = useState<Recordatorio | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    fecha_activacion: new Date().toISOString().split('T')[0],
    momento: 'inicio' as 'inicio' | 'final',
    turno_id: ''
  });

  const abrirDialog = (recordatorio?: Recordatorio) => {
    if (recordatorio) {
      setRecordatorioEditando(recordatorio);
      setFormData({
        titulo: recordatorio.titulo,
        contenido: recordatorio.contenido,
        fecha_activacion: recordatorio.fecha_activacion,
        momento: recordatorio.momento,
        turno_id: recordatorio.turno_id?.toString() || ''
      });
    } else {
      setRecordatorioEditando(null);
      setFormData({
        titulo: '',
        contenido: '',
        fecha_activacion: new Date().toISOString().split('T')[0],
        momento: 'inicio',
        turno_id: ''
      });
    }
    setDialogAbierto(true);
  };

  const guardarRecordatorio = () => {
    if (!formData.titulo.trim() || !formData.contenido.trim()) return;

    if (recordatorioEditando) {
      // Editar recordatorio existente
      setRecordatorios(recordatorios.map(r => 
        r.id === recordatorioEditando.id 
          ? { 
              ...r, 
              titulo: formData.titulo,
              contenido: formData.contenido,
              fecha_activacion: formData.fecha_activacion,
              momento: formData.momento,
              turno_id: formData.turno_id ? parseInt(formData.turno_id) : undefined
            }
          : r
      ));
    } else {
      // Crear nuevo recordatorio
      const nuevoRecordatorio: Recordatorio = {
        id: Date.now(),
        titulo: formData.titulo,
        contenido: formData.contenido,
        fecha_activacion: formData.fecha_activacion,
        momento: formData.momento,
        activo: true,
        turno_id: formData.turno_id ? parseInt(formData.turno_id) : undefined
      };
      setRecordatorios([...recordatorios, nuevoRecordatorio]);
    }

    setDialogAbierto(false);
  };

  const toggleActivo = (id: number) => {
    setRecordatorios(recordatorios.map(r => 
      r.id === id ? { ...r, activo: !r.activo } : r
    ));
  };

  const eliminarRecordatorio = (id: number) => {
    if (window.confirm('¿Eliminar este recordatorio?')) {
      setRecordatorios(recordatorios.filter(r => r.id !== id));
    }
  };

  const recordatoriosActivos = recordatorios.filter(r => r.activo);
  const recordatoriosInactivos = recordatorios.filter(r => !r.activo);

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={onVolver} sx={{ mb: 2 }}>
        Volver
      </Button>

      <Typography variant="h5" sx={{ mb: 3 }}>
        🔔 Gestor de Recordatorios
      </Typography>

      <Button 
        startIcon={<Add />} 
        variant="contained" 
        onClick={() => abrirDialog()}
        sx={{ mb: 3 }}
      >
        Nuevo Recordatorio
      </Button>

      {/* Recordatorios activos */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Notifications color="primary" />
            Recordatorios Activos ({recordatoriosActivos.length})
          </Typography>
          <List>
            {recordatoriosActivos.map(recordatorio => (
              <ListItem key={recordatorio.id} divider>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {recordatorio.titulo}
                      <Chip 
                        label={recordatorio.momento === 'inicio' ? 'Inicio' : 'Final'} 
                        size="small"
                        color={recordatorio.momento === 'inicio' ? 'success' : 'warning'}
                      />
                      {recordatorio.turno_id && (
                        <Chip label={`Turno ${recordatorio.turno_id}`} size="small" variant="outlined" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">{recordatorio.contenido}</Typography>
                      <Typography variant="caption">
                        Activo desde: {new Date(recordatorio.fecha_activacion).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
                <Switch
                  checked={recordatorio.activo}
                  onChange={() => toggleActivo(recordatorio.id)}
                />
                <IconButton onClick={() => abrirDialog(recordatorio)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => eliminarRecordatorio(recordatorio.id)} color="error">
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
            {recordatoriosActivos.length === 0 && (
              <ListItem>
                <ListItemText primary="No hay recordatorios activos" />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>

      {/* Dialog para crear/editar recordatorio */}
      <Dialog open={dialogAbierto} onClose={() => setDialogAbierto(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {recordatorioEditando ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Título"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Contenido"
            multiline
            rows={3}
            value={formData.contenido}
            onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Fecha de Activación"
            type="date"
            value={formData.fecha_activacion}
            onChange={(e) => setFormData({ ...formData, fecha_activacion: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Momento</InputLabel>
            <Select
              value={formData.momento}
              onChange={(e) => setFormData({ ...formData, momento: e.target.value as 'inicio' | 'final' })}
            >
              <MenuItem value="inicio">Al Inicio de la Clase</MenuItem>
              <MenuItem value="final">Al Final de la Clase</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Turno Específico (opcional)"
            type="number"
            value={formData.turno_id}
            onChange={(e) => setFormData({ ...formData, turno_id: e.target.value })}
            inputProps={{ inputMode: 'numeric' }}
            helperText="Dejar vacío para aplicar a todos los turnos"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAbierto(false)}>Cancelar</Button>
          <Button onClick={guardarRecordatorio} variant="contained">
            {recordatorioEditando ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestorRecordatorios;