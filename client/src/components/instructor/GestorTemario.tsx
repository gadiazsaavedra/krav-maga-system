import React, { useState } from 'react';
import { 
  Box, Typography, Button, Card, CardContent, TextField, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, IconButton, Chip
} from '@mui/material';
import { ArrowBack, Add, Edit, Delete, DragIndicator } from '@mui/icons-material';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { TemaCurriculum } from '../../types/instructor';

interface GestorTemarioProps {
  onVolver: () => void;
}

const cinturones = ['Blanco', 'Amarillo', 'Naranja', 'Verde', 'Azul', 'Marrón', 'Negro'];

const GestorTemario: React.FC<GestorTemarioProps> = ({ onVolver }) => {
  const [temas, setTemas] = useLocalStorage<TemaCurriculum[]>('curriculum-temas', []);
  const [cinturonSeleccionado, setCinturonSeleccionado] = useState('Blanco');
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [temaEditando, setTemaEditando] = useState<TemaCurriculum | null>(null);
  const [formData, setFormData] = useState({ titulo: '', descripcion: '' });

  const temasPorCinturon = temas
    .filter(t => t.cinturon === cinturonSeleccionado)
    .sort((a, b) => a.orden - b.orden);

  const abrirDialog = (tema?: TemaCurriculum) => {
    if (tema) {
      setTemaEditando(tema);
      setFormData({ titulo: tema.titulo, descripcion: tema.descripcion || '' });
    } else {
      setTemaEditando(null);
      setFormData({ titulo: '', descripcion: '' });
    }
    setDialogAbierto(true);
  };

  const guardarTema = () => {
    if (!formData.titulo.trim()) return;

    if (temaEditando) {
      // Editar tema existente
      setTemas(temas.map(t => 
        t.id === temaEditando.id 
          ? { ...t, titulo: formData.titulo, descripcion: formData.descripcion }
          : t
      ));
    } else {
      // Crear nuevo tema
      const maxOrden = Math.max(...temasPorCinturon.map(t => t.orden), 0);
      const nuevoTema: TemaCurriculum = {
        id: Date.now(),
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        orden: maxOrden + 1,
        cinturon: cinturonSeleccionado
      };
      setTemas([...temas, nuevoTema]);
    }

    setDialogAbierto(false);
    setFormData({ titulo: '', descripcion: '' });
  };

  const eliminarTema = (id: number) => {
    if (window.confirm('¿Eliminar este tema?')) {
      setTemas(temas.filter(t => t.id !== id));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={onVolver} sx={{ mb: 2 }}>
        Volver
      </Button>

      <Typography variant="h5" sx={{ mb: 3 }}>
        📚 Gestor de Temario
      </Typography>

      {/* Selector de cinturón */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {cinturones.map(cinturon => (
          <Chip
            key={cinturon}
            label={cinturon}
            onClick={() => setCinturonSeleccionado(cinturon)}
            color={cinturonSeleccionado === cinturon ? 'primary' : 'default'}
            variant={cinturonSeleccionado === cinturon ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      {/* Lista de temas */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Temas - {cinturonSeleccionado} ({temasPorCinturon.length})
            </Typography>
            <Button startIcon={<Add />} onClick={() => abrirDialog()}>
              Agregar Tema
            </Button>
          </Box>

          <List>
            {temasPorCinturon.map((tema, index) => (
              <ListItem key={tema.id} divider>
                <IconButton size="small">
                  <DragIndicator />
                </IconButton>
                <ListItemText
                  primary={`${index + 1}. ${tema.titulo}`}
                  secondary={tema.descripcion}
                />
                <IconButton onClick={() => abrirDialog(tema)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => eliminarTema(tema.id)} color="error">
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
            {temasPorCinturon.length === 0 && (
              <ListItem>
                <ListItemText primary="No hay temas para este cinturón" />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>

      {/* Dialog para agregar/editar tema */}
      <Dialog open={dialogAbierto} onClose={() => setDialogAbierto(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {temaEditando ? 'Editar Tema' : 'Nuevo Tema'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Título del Tema"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Descripción (opcional)"
            multiline
            rows={3}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAbierto(false)}>Cancelar</Button>
          <Button onClick={guardarTema} variant="contained">
            {temaEditando ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestorTemario;