import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Paper, IconButton, Chip, Typography,
  TablePagination, Alert, MenuItem, Card, CardContent, CardActions,
  Collapse, Divider, Fab, InputAdornment, Stepper, Step, StepLabel,
  MobileStepper
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { ExpandMore, Phone, Email, Search, Clear, Edit as EditIcon, Call } from '@mui/icons-material';
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
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [swipedCard, setSwipedCard] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = 3;
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
  
  // Filtrar y ordenar alumnos
  const alumnosOrdenados = React.useMemo(() => {
    if (!alumnos || alumnos.length === 0) return [];
    
    // Filtrar por término de búsqueda
    const alumnosFiltrados = alumnos.filter((alumno: any) => {
      if (!searchTerm) return true;
      const termino = searchTerm.toLowerCase();
      return (
        alumno.nombre?.toLowerCase().includes(termino) ||
        alumno.apellido?.toLowerCase().includes(termino) ||
        alumno.telefono?.includes(termino) ||
        alumno.email?.toLowerCase().includes(termino) ||
        alumno.cinturon?.toLowerCase().includes(termino)
      );
    });
    
    // Ordenar resultados filtrados
    return [...alumnosFiltrados].sort((a, b) => {
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
  }, [alumnos, order, orderBy, ordenCinturones, searchTerm]);

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
    setActiveStep(0);
    reset();
    setTurnosDisponibles(turnosPorCinturon['Blanco']);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
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
          color: 'primary.main'
        }}>
          🥋 Alumnos
        </Typography>
        
        {/* Search Bar */}
        <TextField
          placeholder="Buscar alumnos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ width: '100%', mt: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar los alumnos: {(error as any)?.message || 'Error desconocido'}
        </Alert>
      )}
      
      {isLoading && <LoadingSpinner message="Cargando alumnos..." />}

      <PullToRefresh onRefresh={handleRefresh}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {!isLoading && alumnosOrdenados.map((alumno: any) => (
            <Box
              key={alumno.id}
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
                
                // Solo swipe horizontal
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
                  e.preventDefault();
                  const card = element.querySelector('.swipe-card');
                  if (card) {
                    card.style.transform = `translateX(${deltaX}px)`;
                    
                    // Mostrar acciones
                    if (deltaX > 80) {
                      setSwipedCard(alumno.id);
                    } else if (deltaX < -80) {
                      setSwipedCard(alumno.id);
                    }
                  }
                }
              }}
              onTouchEnd={(e) => {
                const element = e.currentTarget as any;
                const card = element.querySelector('.swipe-card');
                if (card) {
                  const transform = card.style.transform;
                  const translateX = transform ? parseInt(transform.match(/-?\d+/)?.[0] || '0') : 0;
                  
                  if (Math.abs(translateX) > 80) {
                    // Ejecutar acción
                    if (translateX > 0) {
                      // Swipe right → Llamar
                      window.open(`tel:${alumno.telefono}`, '_self');
                    } else {
                      // Swipe left → Editar
                      handleEdit(alumno);
                    }
                  }
                  
                  // Reset posición
                  card.style.transform = 'translateX(0px)';
                  card.style.transition = 'transform 0.3s ease';
                  setTimeout(() => {
                    card.style.transition = '';
                    setSwipedCard(null);
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
                {/* Acción izquierda - Llamar */}
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    pl: 3,
                    color: 'white'
                  }}
                >
                  <Call sx={{ mr: 1 }} />
                  <Typography variant="body2" fontWeight="bold">Llamar</Typography>
                </Box>
                
                {/* Acción derecha - Editar */}
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    pr: 3,
                    color: 'white'
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">Editar</Typography>
                  <EditIcon sx={{ ml: 1 }} />
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
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease'
                }}
              >
              <CardContent sx={{ pb: 1 }}>
                {/* Información principal */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                      {alumno.nombre} {alumno.apellido}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Chip
                        label={alumno.cinturon}
                        size="small"
                        sx={{
                          backgroundColor: getCinturonColor(alumno.cinturon),
                          color: alumno.cinturon === 'Blanco' ? 'black' : 'white',
                          fontWeight: 600
                        }}
                      />
                      <Chip 
                        label={`${(alumno as any).inasistencias_recientes || 0} faltas`}
                        color={(alumno as any).inasistencias_recientes > 3 ? "error" : "success"}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <IconButton 
                    onClick={() => handleEdit(alumno)}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        transform: 'scale(1.1)'
                      },
                      minWidth: 48,
                      minHeight: 48
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Box>

                {/* Acciones rápidas */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button
                    startIcon={<Phone />}
                    variant="outlined"
                    size="small"
                    href={`tel:${alumno.telefono}`}
                    sx={{ flex: 1, minHeight: 44 }}
                  >
                    {alumno.telefono}
                  </Button>
                  <IconButton
                    onClick={() => setExpandedCard(expandedCard === alumno.id ? null : alumno.id)}
                    sx={{
                      transform: expandedCard === alumno.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      minWidth: 44,
                      minHeight: 44
                    }}
                  >
                    <ExpandMore />
                  </IconButton>
                </Box>

                {/* Información expandible */}
                <Collapse in={expandedCard === alumno.id}>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {alumno.email || 'Sin email'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Turno:</Typography>
                      <Typography variant="body2">{alumno.grupo || 'Sin turno'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Registro:</Typography>
                      <Typography variant="body2">{alumno.fecha_registro || 'Sin fecha'}</Typography>
                    </Box>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
            </Box>
          ))}
        </Box>
      </PullToRefresh>
      
      {/* Floating Action Button */}
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
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, minHeight: 400 }}>
          {/* Mobile Stepper */}
          <MobileStepper
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            sx={{ mb: 3, backgroundColor: 'transparent' }}
            nextButton={<div />}
            backButton={<div />}
          />
          
          {/* Paso 1: Datos Básicos */}
          {activeStep === 0 && (
            <Box sx={{ py: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: 'primary.main' }}>
                👤 Datos Básicos
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <AutocompleteField
                    label="Nombre"
                    value={formData.nombre}
                    onChange={(value) => setValue('nombre', value)}
                    suggestions={nombresExistentes}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                  />
                </Grid>
                <Grid item xs={12}>
                  <AutocompleteField
                    label="Apellido"
                    value={formData.apellido}
                    onChange={(value) => setValue('apellido', value)}
                    suggestions={apellidosExistentes}
                    error={!!errors.apellido}
                    helperText={errors.apellido}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FechaSelector
                    label="Fecha de Nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={(value) => setValue('fecha_nacimiento', value)}
                    error={!!errors.fecha_nacimiento}
                    helperText={errors.fecha_nacimiento}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* Paso 2: Contacto */}
          {activeStep === 1 && (
            <Box sx={{ py: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: 'primary.main' }}>
                📞 Contacto
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <FechaSelector
                    label="Fecha de Registro"
                    value={formData.fecha_registro}
                    onChange={(value) => setValue('fecha_registro', value)}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* Paso 3: Krav Maga */}
          {activeStep === 2 && (
            <Box sx={{ py: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: 'primary.main' }}>
                🥋 Krav Maga
              </Typography>
              <Grid container spacing={3}>
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Turno"
                    value={formData.grupo}
                    onChange={(e) => setValue('grupo', e.target.value)}
                    size="medium"
                  >
                    {turnosDisponibles.map((turno) => (
                      <MenuItem key={turno} value={turno}>
                        {turno}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'space-between',
          p: { xs: 2, sm: 2 },
          gap: 1
        }}>
          {/* Botón Atrás */}
          <Button
            onClick={activeStep === 0 ? handleClose : handleBack}
            startIcon={activeStep === 0 ? undefined : <KeyboardArrowLeft />}
            sx={{ minHeight: 48, minWidth: 100 }}
          >
            {activeStep === 0 ? 'Cancelar' : 'Atrás'}
          </Button>
          
          {/* Indicador de paso */}
          <Typography variant="body2" color="text.secondary">
            {activeStep + 1} de {maxSteps}
          </Typography>
          
          {/* Botón Siguiente/Guardar */}
          <Button
            onClick={activeStep === maxSteps - 1 ? handleSubmit : handleNext}
            endIcon={activeStep === maxSteps - 1 ? undefined : <KeyboardArrowRight />}
            variant="contained"
            sx={{ minHeight: 48, minWidth: 100 }}
          >
            {activeStep === maxSteps - 1 ? (editingAlumno ? 'Actualizar' : 'Crear') : 'Siguiente'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlumnosTab;