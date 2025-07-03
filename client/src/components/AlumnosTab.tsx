import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Typography, TableSortLabel,
  TablePagination, Alert, MenuItem
} from '@mui/material';
import AlumnoTableRow from './AlumnoTableRow';
import LoadingSpinner from './LoadingSpinner';
import { useFormValidation } from '../hooks/useFormValidation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { alumnoSchema } from '../utils/validationSchemas';
import AutocompleteField from './AutocompleteField';
import CinturonSelector from './CinturonSelector';
import TurnoSelector from './TurnoSelector';
import FechaSelector from './FechaSelector';
import AlumnoFormProgresivo from './AlumnoFormProgresivo';
import { formatTelefono, getSugerenciasEmail, callesComunes } from '../utils/formatters';
import PullToRefresh from './PullToRefresh';
import LongPressMenu from './LongPressMenu';
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
  'Blanco': ['Lun y Mie 17:00-18:00', 'Lun y Mie 19:00-20:00', 'Mar y Jue 13:00-14:00', 'Vie 17:30-19:10'],
  'Amarillo': ['Lun y Mie 18:00-19:00', 'Mar y Jue 13:00-14:00', 'Vie 19:10-21:00'],
  'Naranja': ['Lun y Mie 20:00-21:00', 'Vie 19:10-21:00'],
  'Verde': ['Lun y Mie 20:00-21:00'],
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
  
  // Hook personalizado para localStorage
  const [alumnosLocal, setAlumnosLocal] = useLocalStorage('alumnos-krav-maga', mockAlumnos);
  
  // Calcular inasistencias desde asistencias registradas
  const calcularInasistencias = (alumnoId: number) => {
    const saved = localStorage.getItem('asistencias-krav-maga');
    const asistencias = saved ? JSON.parse(saved) : [];
    
    // Filtrar asistencias del alumno en los últimos 30 días
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    
    const asistenciasAlumno = asistencias.filter((a: any) => 
      a.alumno_id === alumnoId && 
      new Date(a.fecha) >= hace30Dias
    );
    
    // Contar inasistencias (presente = false)
    return asistenciasAlumno.filter((a: any) => !a.presente).length;
  };
  
  // Alumnos con inasistencias calculadas
  const alumnosConInasistencias = React.useMemo(() => {
    return alumnosLocal.map((alumno: any) => ({
      ...alumno,
      inasistencias_recientes: calcularInasistencias(alumno.id)
    }));
  }, [alumnosLocal]);

  // Sugerencias para autocompletado
  const nombresExistentes = Array.from(new Set(alumnosLocal.map((a: any) => a.nombre))).filter(Boolean);
  const apellidosExistentes = Array.from(new Set(alumnosLocal.map((a: any) => a.apellido))).filter(Boolean);
  const alumnosData = { data: alumnosConInasistencias, total: alumnosConInasistencias.length };
  const isLoading = false;
  const error = null;
  // const { data: alumnosData, isLoading, error } = useAlumnos(page, rowsPerPage, orderBy, order);
  // const createAlumnoMutation = useCreateAlumno();
  // const updateAlumnoMutation = useUpdateAlumno(); // No usado
  // const deleteAlumnoMutation = useDeleteAlumno();
  const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null);
  const [modoProgresivo, setModoProgresivo] = useState(false);
  const initialFormData = {
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    fecha_nacimiento: '',
    fecha_registro: (() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    })(), // Fecha local sin UTC
    grupo: 'Lun y Mie 17:00-18:00',
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

  // Sugerencias de email (después de formData)
  const sugerenciasEmail = getSugerenciasEmail(formData.email);
  
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
  }, [alumnos, order, orderBy, ordenCinturones]);

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
      // Mapear grupo a turnos
      const mapearGrupoATurnos = (grupo: string): number[] => {
        const mapeo: { [key: string]: number[] } = {
          'Lun y Mie 17:00-18:00': [1, 5],
          'Lun y Mie 18:00-19:00': [2, 6],
          'Lun y Mie 19:00-20:00': [3, 7],
          'Lun y Mie 20:00-21:00': [4, 8],
          'Mar y Jue 13:00-14:00': [9, 10],
          'Vie 17:30-19:10': [11],
          'Vie 19:10-21:00': [12]
        };
        return mapeo[grupo] || [];
      };
      
      // Actualizar alumno existente
      const alumnoActualizado = {
        ...editingAlumno,
        ...formData,
        turnos: mapearGrupoATurnos(formData.grupo), // Actualizar turnos basados en grupo
        activo: editingAlumno.activo || 1,
        // Asegurar que fecha_registro se actualice
        fecha_registro: formData.fecha_registro || editingAlumno.fecha_registro
      };
      
      // Actualizar en estado local
      setAlumnosLocal((prevAlumnos: any[]) => {
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
      // Mapear grupo a turnos
      const mapearGrupoATurnos = (grupo: string): number[] => {
        const mapeo: { [key: string]: number[] } = {
          'Lun y Mie 17:00-18:00': [1, 5],
          'Lun y Mie 18:00-19:00': [2, 6],
          'Lun y Mie 19:00-20:00': [3, 7],
          'Lun y Mie 20:00-21:00': [4, 8],
          'Mar y Jue 13:00-14:00': [9, 10],
          'Vie 17:30-19:10': [11],
          'Vie 19:10-21:00': [12]
        };
        return mapeo[grupo] || [];
      };
      
      // Crear nuevo alumno
      const nuevoAlumno = {
        id: Math.max(...alumnosLocal.map((a: any) => a.id)) + 1,
        ...formData,
        fecha_registro: formData.fecha_registro,
        turnos: mapearGrupoATurnos(formData.grupo), // Agregar turnos basados en grupo
        activo: 1,
        inasistencias_recientes: 0
      };
      
      // Agregar a estado local
      setAlumnosLocal((prevAlumnos: any[]) => [...prevAlumnos, nuevoAlumno as any]);
      

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

  const handleRefresh = async () => {
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Aquí podrías recargar datos del servidor
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

  // Renderizar formulario progresivo si está activo
  if (modoProgresivo) {
    return (
      <AlumnoFormProgresivo
        onGuardar={(alumno) => {
          const nuevoAlumno = {
            id: Math.max(...alumnosLocal.map((a: any) => a.id)) + 1,
            ...alumno,
            activo: 1,
            inasistencias_recientes: 0
          };
          setAlumnosLocal((prev: any[]) => [...prev, nuevoAlumno]);
          setModoProgresivo(false);
          alert('✅ Alumno creado exitosamente');
        }}
        onCancelar={() => setModoProgresivo(false)}
      />
    );
  }

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
          Nuevo Alumno
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar los alumnos: {(error as any)?.message || 'Error desconocido'}
        </Alert>
      )}
      
      {isLoading && <LoadingSpinner message="Cargando alumnos..." />}

      <PullToRefresh onRefresh={handleRefresh}>
        <TableContainer component={Paper} sx={{ 
        overflowX: 'auto',
        borderRadius: 3,
        boxShadow: 3
      }}>
        <Table sx={{ 
          tableLayout: 'fixed',
          width: '100%',
          '& .MuiTableHead-root': {
            backgroundColor: '#e3f2fd'
          },
          '& .MuiTableCell-head': {
            fontWeight: 'bold',
            color: 'black',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'center'
          }
        }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box' }}>Nombre</TableCell>
              <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box' }}>Apellido</TableCell>
              <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box' }}>Teléfono</TableCell>
              <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box' }}>Email</TableCell>
              <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box' }}>Turno</TableCell>
              <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box' }}>Grado</TableCell>
              <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box' }}>Registro</TableCell>
              <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box' }}>Faltas</TableCell>
              <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && alumnosOrdenados.map((alumno: any) => (
                <TableRow key={alumno.id}>
                  <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box', textAlign: 'center' }}>{alumno.nombre}</TableCell>
                  <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box', textAlign: 'center' }}>{alumno.apellido}</TableCell>
                  <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box', textAlign: 'center' }}>{alumno.telefono}</TableCell>
                  <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box', textAlign: 'center' }}>{alumno.email}</TableCell>
                  <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box', textAlign: 'center' }}>{alumno.grupo}</TableCell>
                  <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box', textAlign: 'center' }}>
                    <Chip
                      label={alumno.cinturon}
                      size="small"
                      sx={{
                        backgroundColor: getCinturonColor(alumno.cinturon),
                        color: alumno.cinturon === 'Blanco' ? 'black' : 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box', textAlign: 'center' }}>
                    {alumno.fecha_registro || 'Sin fecha'}
                  </TableCell>
                  <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box', textAlign: 'center' }}>
                    <Chip 
                      label={(alumno as any).inasistencias_recientes || 0} 
                      color={(alumno as any).inasistencias_recientes > 3 ? "error" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ width: '140px !important', minWidth: '140px !important', maxWidth: '140px !important', padding: '8px !important', boxSizing: 'border-box', textAlign: 'center' }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEdit(alumno)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </PullToRefresh>
      
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
              <AutocompleteField
                label="Nombre"
                value={formData.nombre}
                onChange={(value) => setValue('nombre', value)}
                suggestions={nombresExistentes}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AutocompleteField
                label="Apellido"
                value={formData.apellido}
                onChange={(value) => setValue('apellido', value)}
                suggestions={apellidosExistentes}
                error={!!errors.apellido}
                helperText={errors.apellido}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AutocompleteField
                label="Teléfono"
                value={formData.telefono}
                onChange={(value) => setValue('telefono', value)}
                suggestions={[]}
                type="tel"
                inputMode="tel"
                error={!!errors.telefono}
                helperText={errors.telefono}
                formatter={formatTelefono}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AutocompleteField
                label="Email"
                value={formData.email}
                onChange={(value) => setValue('email', value)}
                suggestions={sugerenciasEmail}
                type="email"
                inputMode="email"
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FechaSelector
                label="Fecha de Nacimiento"
                value={formData.fecha_nacimiento}
                onChange={(value) => setValue('fecha_nacimiento', value)}
                error={!!errors.fecha_nacimiento}
                helperText={errors.fecha_nacimiento}
                max={new Date().toISOString().split('T')[0]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FechaSelector
                label="Fecha de Registro"
                value={formData.fecha_registro}
                onChange={(value) => setValue('fecha_registro', value)}
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
            <Grid item xs={12}>
              <CinturonSelector
                value={formData.cinturon}
                onChange={(nuevoCinturon) => {
                  const turnosParaCinturon = turnosPorCinturon[nuevoCinturon as keyof typeof turnosPorCinturon] || [];
                  setTurnosDisponibles(turnosParaCinturon);
                  setValue('cinturon', nuevoCinturon);
                  setValue('grupo', turnosParaCinturon.length > 0 ? turnosParaCinturon[0] : '');
                }}
                label="Cinturón"
              />
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
                  setAlumnosLocal((prevAlumnos: any[]) => 
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