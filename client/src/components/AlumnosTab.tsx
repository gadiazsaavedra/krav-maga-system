import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Typography, TableSortLabel,
  TablePagination, Alert, MenuItem
} from '@mui/material';
import AlumnoTableRow from './AlumnoTableRow';
import LoadingSpinner from './LoadingSpinner';
import DemoMessage from './DemoMessage';
import { useFormValidation } from '../hooks/useFormValidation';
import { alumnoSchema } from '../utils/validationSchemas';
import { useCreateAlumno, useUpdateAlumno, useDeleteAlumno } from '../hooks/useAlumnos';
import { mockAlumnos } from '../data/mockData';
import { Add, Edit } from '@mui/icons-material';

// Datos estáticos para demostración
// const alumnosIniciales = [
//   { id: 1, nombre: 'Juan', apellido: 'Pérez', telefono: '11-1234-5678', email: 'juan@example.com', fecha_nacimiento: '1990-05-15', grupo: 'Adultos', cinturon: 'Amarillo', fecha_registro: '2024-01-15' },
//   { id: 2, nombre: 'María', apellido: 'González', telefono: '11-2345-6789', email: 'maria@example.com', fecha_nacimiento: '1985-08-22', grupo: 'Adultos', cinturon: 'Verde', fecha_registro: '2024-02-10' },
//   { id: 3, nombre: 'Carlos', apellido: 'Rodríguez', telefono: '11-3456-7890', email: 'carlos@example.com', fecha_nacimiento: '1992-03-10', grupo: 'Jóvenes', cinturon: 'Blanco', fecha_registro: '2024-03-05' },
//   { id: 4, nombre: 'Ana', apellido: 'Martínez', telefono: '11-4567-8901', email: 'ana@example.com', fecha_nacimiento: '1988-12-05', grupo: 'Adultos', cinturon: 'Azul', fecha_registro: '2024-01-20' }
// ];

interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fecha_nacimiento: string;
  grupo: string;
  cinturon: string;
  fecha_registro: string;
  inasistencias_recientes?: number;
  activo?: number;
}

type Order = 'asc' | 'desc';
type OrderBy = 'nombre' | 'apellido' | 'cinturon';

const cinturones = ['Blanco', 'Amarillo', 'Naranja', 'Verde', 'Azul', 'Marrón', 'Negro'];
// Mapeo de turnos disponibles por cinturón
const turnosPorCinturon = {
  'Blanco': ['Lunes y Miércoles 17:00-18:00', 'Lunes y Miércoles 19:00-20:00', 'Martes y Jueves 13:00-14:00', 'Viernes 17:30-19:10'],
  'Amarillo': ['Lunes y Miércoles 18:00-19:00', 'Martes y Jueves 13:00-14:00', 'Viernes 19:10-21:00'],
  'Naranja': ['Lunes y Miércoles 20:00-21:00', 'Viernes 19:10-21:00'],
  'Verde': ['Lunes y Miércoles 20:00-21:00'],
  'Azul': [],
  'Marrón': [],
  'Negro': []
};

const AlumnosTab: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('apellido');
  
  // Estado local para alumnos con persistencia
  const [alumnosLocal, setAlumnosLocal] = useState(() => {
    const saved = localStorage.getItem('alumnos-krav-maga');
    return saved ? JSON.parse(saved) : mockAlumnos;
  });
  
  // Guardar en localStorage cuando cambie el estado
  React.useEffect(() => {
    localStorage.setItem('alumnos-krav-maga', JSON.stringify(alumnosLocal));
  }, [alumnosLocal]);
  const alumnosData = { data: alumnosLocal, total: alumnosLocal.length };
  const isLoading = false;
  const error = null;
  // const { data: alumnosData, isLoading, error } = useAlumnos(page, rowsPerPage, orderBy, order);
  // const createAlumnoMutation = useCreateAlumno();
  const updateAlumnoMutation = useUpdateAlumno();
  // const deleteAlumnoMutation = useDeleteAlumno();
  const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null);
  const initialFormData = {
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    fecha_nacimiento: '',
    fecha_registro: '',
    grupo: 'Lunes y Miércoles 17:00-18:00',
    cinturon: 'Blanco'
  };
  
  const {
    values: formData,
    errors,
    // isValid,
    setValue,
    setAllValues,
    validateAll,
    reset
  } = useFormValidation({
    schema: alumnoSchema,
    initialValues: initialFormData
  });
  
  // Turnos disponibles basados en el cinturón seleccionado
  const [turnosDisponibles, setTurnosDisponibles] = useState<string[]>(turnosPorCinturon['Blanco']);
  
  const alumnos = (alumnosData as any)?.data || [];
  const totalAlumnos = (alumnosData as any)?.total || 0;

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);
    setPage(0);
  };

  // Orden jerárquico de cinturones
  const ordenCinturones = ['Blanco', 'Amarillo', 'Naranja', 'Verde', 'Azul', 'Marrón', 'Negro'];
  
  // Ordenar alumnos localmente
  const alumnosOrdenados = React.useMemo(() => {
    if (!alumnos || alumnos.length === 0) return [];
    
    return [...alumnos].sort((a, b) => {
      if (orderBy === 'cinturon') {
        const aIndex = ordenCinturones.indexOf(a.cinturon || 'Blanco');
        const bIndex = ordenCinturones.indexOf(b.cinturon || 'Blanco');
        
        if (order === 'asc') {
          return aIndex - bIndex;
        } else {
          return bIndex - aIndex;
        }
      } else {
        let aValue = '';
        let bValue = '';
        
        if (orderBy === 'nombre') {
          aValue = a.nombre || '';
          bValue = b.nombre || '';
        } else if (orderBy === 'apellido') {
          aValue = a.apellido || '';
          bValue = b.apellido || '';
        }
        
        if (order === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
    });
  }, [alumnos, order, orderBy]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = async () => {
    const isFormValid = await validateAll();
    if (!isFormValid) {
      alert('Por favor corrige los errores en el formulario');
      return;
    }
    
    if (editingAlumno) {
      // Actualizar alumno existente
      const alumnoActualizado = {
        ...editingAlumno,
        ...formData,
        activo: editingAlumno.activo || 1,
        // Asegurar que fecha_registro se actualice
        fecha_registro: formData.fecha_registro || editingAlumno.fecha_registro
      };
      
      // Actualizar en estado local
      setAlumnosLocal((prevAlumnos: Alumno[]) => {
        const index = prevAlumnos.findIndex(a => a.id === editingAlumno.id);
        if (index !== -1) {
          const nuevosAlumnos = [...prevAlumnos];
          nuevosAlumnos[index] = alumnoActualizado as any;
          return nuevosAlumnos;
        }
        return prevAlumnos;
      });
      
      alert('✅ Alumno actualizado exitosamente');
    } else {
      // Crear nuevo alumno
      const nuevoAlumno = {
        id: Math.max(...alumnosLocal.map((a: Alumno) => a.id)) + 1,
        ...formData,
        fecha_registro: formData.fecha_registro || new Date().toISOString().split('T')[0],
        activo: 1,
        inasistencias_recientes: 0
      };
      
      // Agregar a estado local
      setAlumnosLocal((prevAlumnos: Alumno[]) => [...prevAlumnos, nuevoAlumno as any]);
      
      alert('✅ Alumno creado exitosamente');
    }
    
    handleClose();
    // Ya no necesitamos reload porque usamos estado local
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAlumno(null);
    reset();
    setTurnosDisponibles(turnosPorCinturon['Blanco']);
  };

  const handleEdit = (alumno: any) => {
    setEditingAlumno(alumno);
    const cinturon = alumno.cinturon || 'Blanco';
    const turnosParaCinturon = turnosPorCinturon[cinturon as keyof typeof turnosPorCinturon] || [];
    setTurnosDisponibles(turnosParaCinturon);
    
    // Verificar si el turno actual es válido para el cinturón
    const turnoActual = alumno.grupo || '';
    let turnoValido = '';
    
    // Verificar manualmente si el turno está en la lista
    let turnoEncontrado = false;
    for (const t of turnosParaCinturon) {
      if (t === turnoActual) {
        turnoEncontrado = true;
        break;
      }
    }
    
    if (turnoEncontrado) {
      turnoValido = turnoActual;
    } else if (turnosParaCinturon.length > 0) {
      turnoValido = turnosParaCinturon[0];
    }
    
    setAllValues({
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      telefono: alumno.telefono || '',
      email: alumno.email || '',
      fecha_nacimiento: alumno.fecha_nacimiento || '',
      fecha_registro: alumno.fecha_registro || '',
      grupo: turnoValido,
      cinturon: cinturon
    });
    setOpen(true);
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

  return (
    <Box>
      {/* <DemoMessage /> */}
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
          🥋 Alumnos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          size="large"
          sx={{ 
            minHeight: { xs: 56, sm: 48 },
            fontSize: { xs: '1rem', sm: '1rem' },
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-1px)'
            }
          }}
        >
          Nuevo
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar los alumnos: {(error as any)?.message || 'Error desconocido'}
        </Alert>
      )}
      
      {isLoading && <LoadingSpinner message="Cargando alumnos..." />}

      <TableContainer component={Paper} sx={{ 
        overflowX: 'auto',
        borderRadius: 3,
        boxShadow: 3,
        '& .MuiTable-root': {
          minWidth: { xs: 600, sm: 'auto' }
        },
        '& .MuiTableHead-root': {
          backgroundColor: 'primary.dark',
          '& .MuiTableCell-head': {
            color: 'black',
            fontWeight: 700,
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            textShadow: '1px 1px 2px rgba(255,255,255,0.5)',
            letterSpacing: '0.5px'
          }
        },
        '& .MuiTableRow-root:nth-of-type(even)': {
          backgroundColor: 'grey.50'
        },
        '& .MuiTableRow-root:hover': {
          backgroundColor: 'grey.100'
        }
      }}>
        <Table size="small">
          <TableHead>
            <AlumnoTableRow isHeader>
              <TableCell sx={{ minWidth: 100 }}>
                <TableSortLabel
                  active={orderBy === 'nombre'}
                  direction={orderBy === 'nombre' ? order : 'asc'}
                  onClick={() => handleRequestSort('nombre')}
                >
                  Nombre
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <TableSortLabel
                  active={orderBy === 'apellido'}
                  direction={orderBy === 'apellido' ? order : 'asc'}
                  onClick={() => handleRequestSort('apellido')}
                >
                  Apellido
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ minWidth: 100 }}>📱 Tel</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Turno</TableCell>
              <TableCell sx={{ minWidth: 80 }}>
                <TableSortLabel
                  active={orderBy === 'cinturon'}
                  direction={orderBy === 'cinturon' ? order : 'asc'}
                  onClick={() => handleRequestSort('cinturon')}
                >
                  🥋 Grado
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Registro</TableCell>
              <TableCell sx={{ minWidth: 60 }}>❌ Faltas</TableCell>
              <TableCell sx={{ minWidth: 60 }}>⚙️</TableCell>
            </AlumnoTableRow>
          </TableHead>
          <TableBody>
            {!isLoading && alumnosOrdenados.map((alumno: any) => (
              <TableRow key={alumno.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {alumno.nombre}
                    </Typography>
                    <Typography variant="caption" sx={{ display: { xs: 'block', sm: 'none' } }}>
                      {alumno.apellido}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  {alumno.apellido}
                </TableCell>
                <TableCell>{alumno.telefono}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  {alumno.email}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                  <Typography variant="caption">
                    {alumno.grupo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={alumno.cinturon}
                    sx={{
                      backgroundColor: getCinturonColor(alumno.cinturon),
                      color: alumno.cinturon === 'Blanco' ? 'black' : 'white'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Typography variant="caption">
                    {alumno.fecha_registro ? 
                      new Date(alumno.fecha_registro).toLocaleDateString() : 
                      new Date().toLocaleDateString()
                    }
                  </Typography>
                </TableCell>
                <TableCell>
                  {(alumno as any).inasistencias_recientes ? (
                    <Chip 
                      label={(alumno as any).inasistencias_recientes} 
                      color={(alumno as any).inasistencias_recientes > 3 ? "error" : "warning"}
                      size="small"
                      title="Inasistencias en los últimos 30 días"
                    />
                  ) : (
                    <Chip label="0" color="success" size="small" title="Sin inasistencias recientes" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="medium" 
                    onClick={() => handleEdit(alumno)}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        transform: 'scale(1.1)'
                      },
                      minWidth: { xs: 44, sm: 40 },
                      minHeight: { xs: 44, sm: 40 }
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={totalAlumnos}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth

        sx={{
          '& .MuiDialog-paper': {
            margin: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: '90vh' },
            height: { xs: '100vh', sm: 'auto' },
            maxWidth: { xs: '100vw', sm: 'md' },
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
          {editingAlumno ? '✏️ Editar Alumno' : '➕ Nuevo Alumno'}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 3, sm: 3 } }}>
          <Grid container spacing={{ xs: 3, sm: 2 }} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => setValue('nombre', e.target.value)}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                value={formData.apellido}
                onChange={(e) => setValue('apellido', e.target.value)}
                error={!!errors.apellido}
                helperText={errors.apellido}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setValue('telefono', e.target.value)}
                error={!!errors.telefono}
                helperText={errors.telefono}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setValue('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => setValue('fecha_nacimiento', e.target.value)}
                error={!!errors.fecha_nacimiento}
                helperText={errors.fecha_nacimiento}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiInputBase-root': {
                    minHeight: 56,
                    height: 56
                  },
                  '& .MuiInputBase-input': {
                    height: '1.4375em',
                    padding: '16.5px 14px'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de Registro"
                type="date"
                value={formData.fecha_registro}
                onChange={(e) => setValue('fecha_registro', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiInputBase-root': {
                    minHeight: 56,
                    height: 56
                  },
                  '& .MuiInputBase-input': {
                    height: '1.4375em',
                    padding: '16.5px 14px'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Turno"
                value={formData.grupo}
                onChange={(e) => setValue('grupo', e.target.value)}
              >
                {turnosDisponibles.map((turno) => (
                  <MenuItem key={turno} value={turno}>
                    {turno}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Cinturón"
                value={formData.cinturon}
                onChange={(e) => {
                  const nuevoCinturon = e.target.value;
                  const turnosParaCinturon = turnosPorCinturon[nuevoCinturon as keyof typeof turnosPorCinturon] || [];
                  setTurnosDisponibles(turnosParaCinturon);
                  setValue('cinturon', nuevoCinturon);
                  setValue('grupo', turnosParaCinturon.length > 0 ? turnosParaCinturon[0] : '');
                }}
              >
                {cinturones.map((cinturon) => (
                  <MenuItem key={cinturon} value={cinturon}>
                    {cinturon}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: editingAlumno ? 'space-between' : 'flex-end',
          p: { xs: 3, sm: 2 },
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          {editingAlumno && (
            <Button 
              onClick={() => {
                if (window.confirm(`¿Eliminar a ${editingAlumno.nombre} ${editingAlumno.apellido}?`)) {
                  // Eliminar del estado local
                  setAlumnosLocal((prevAlumnos: Alumno[]) => 
                    prevAlumnos.filter(alumno => alumno.id !== editingAlumno.id)
                  );
                  handleClose();
                  alert('✅ Alumno eliminado exitosamente');
                }
              }}
              color="error"
              variant="outlined"
            >
              Eliminar
            </Button>
          )}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            width: { xs: '100%', sm: 'auto' },
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button 
              onClick={handleClose} 
              size="large"
              sx={{ 
                minHeight: 48,
                textTransform: 'none',
                fontWeight: 600
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
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 3,
                boxShadow: 3
              }}
            >
              {editingAlumno ? '✅ Actualizar' : '➕ Crear'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlumnosTab;