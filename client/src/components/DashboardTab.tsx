import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, List, ListItem, ListItemIcon, ListItemText,
  Checkbox, FormControlLabel, IconButton, Tabs, Tab
} from '@mui/material';
import {
  Add, Phone, MoreHoriz, School, Store, Schedule, Person, Assessment, Inventory, MenuBook, Delete, Edit, Save, Cancel, Help
} from '@mui/icons-material';
import ToggleSwitch from './ToggleSwitch';

interface DashboardTabProps {
  onNavigate: (tabIndex: number, action?: string) => void;
  t: (key: keyof typeof import('../i18n/translations').translations.es) => string;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ onNavigate, t }) => {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [pagos, setPagos] = useState<any[]>([]);
  const [asistenciasHoy, setAsistenciasHoy] = useState<any[]>([]);
  const [renovaciones, setRenovaciones] = useState<any[]>([]);
  
  // Estados para modals
  const [nuevoAlumnoOpen, setNuevoAlumnoOpen] = useState(false);
  const [asistenciaOpen, setAsistenciaOpen] = useState(false);
  const [pagoRapidoOpen, setPagoRapidoOpen] = useState(false);
  const [morosoSeleccionado, setMorosoSeleccionado] = useState<any>(null);
  const [verMasOpen, setVerMasOpen] = useState(false);
  const [pedidosOpen, setPedidosOpen] = useState(false);
  const [nuevoPedidoOpen, setNuevoPedidoOpen] = useState(false);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [stockOpen, setStockOpen] = useState(false);
  const [stock, setStock] = useState<any[]>([]);
  const [editandoPrecio, setEditandoPrecio] = useState<number | null>(null);
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [editandoMinimo, setEditandoMinimo] = useState<number | null>(null);
  const [nuevoMinimo, setNuevoMinimo] = useState('');
  const [nuevaIndumentariaOpen, setNuevaIndumentariaOpen] = useState(false);
  const [temarioOpen, setTemarioOpen] = useState(false);
  const [cinturonSeleccionado, setCinturonSeleccionado] = useState('Blanco');
  const [historialClases, setHistorialClases] = useState<any[]>([]);
  const [nuevaClaseOpen, setNuevaClaseOpen] = useState(false);
  const [nuevaClase, setNuevaClase] = useState({
    fecha: new Date().toISOString().split('T')[0],
    cinturon: 'Blanco',
    tema: '',
    tipo: 'Nuevo', // Nuevo o Repaso
    notas: ''
  });
  const [gestionTemarioOpen, setGestionTemarioOpen] = useState(false);
  const [temarios, setTemarios] = useState<any>({});
  const [nuevoTemaOpen, setNuevoTemaOpen] = useState(false);
  const [nuevoTema, setNuevoTema] = useState('');
  const [editandoTema, setEditandoTema] = useState<{cinturon: string, index: number, tema: string} | null>(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<any>(null);
  const [renovacionesOpen, setRenovacionesOpen] = useState(false);
  const [examenesOpen, setExamenesOpen] = useState(false);
  const [renovacionesAnuales, setRenovacionesAnuales] = useState<any[]>([]);
  const [examenes, setExamenes] = useState<any[]>([]);
  const [filtroRenovacion, setFiltroRenovacion] = useState('Todos');
  const [filtroExamen, setFiltroExamen] = useState('Todos');
  const [editandoRenovacion, setEditandoRenovacion] = useState<any>(null);
  const [editandoExamen, setEditandoExamen] = useState<any>(null);
  const [tabExamen, setTabExamen] = useState(0);
  const [proximosExamenes, setProximosExamenes] = useState<any[]>([]);
  const [nuevoProximoExamenOpen, setNuevoProximoExamenOpen] = useState(false);
  const [fechaProximoExamen, setFechaProximoExamen] = useState('');
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState('');
  const [herramientasOpen, setHerramientasOpen] = useState(false);
  const [cronometroOpen, setCronometroOpen] = useState(false);
  const [tiempo, setTiempo] = useState(180);
  const [corriendo, setCorriendo] = useState(false);
  const [notasAlumnoOpen, setNotasAlumnoOpen] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<any>(null);
  const [notasProgreso, setNotasProgreso] = useState<any[]>([]);
  const [planificadorOpen, setPlanificadorOpen] = useState(false);
  const [estadisticasOpen, setEstadisticasOpen] = useState(false);
  const [reportesOpen, setReportesOpen] = useState(false);
  const [tabReporte, setTabReporte] = useState(0);
  const [periodoReporte, setPeriodoReporte] = useState('mes-actual');
  const [filtroReporte, setFiltroReporte] = useState('todos');
  const [gestionAlumnosOpen, setGestionAlumnosOpen] = useState(false);
  const [editarAlumnoOpen, setEditarAlumnoOpen] = useState(false);
  const [alumnoEditando, setAlumnoEditando] = useState<any>(null);
  const [busquedaAlumno, setBusquedaAlumno] = useState('');
  const [configMontosOpen, setConfigMontosOpen] = useState(false);
  const [montos, setMontos] = useState({
    renovacionAnual: 15000,
    examenBlanco: 8000,
    examenAmarillo: 9000,
    examenNaranja: 10000,
    examenVerde: 11000,
    examenAzul: 12000,
    examenMarron: 13000,
    examenNegro: 15000
  });
  const [mensualidadesOpen, setMensualidadesOpen] = useState(false);
  const [configMensualidadOpen, setConfigMensualidadOpen] = useState(false);
  const [mensualidades, setMensualidades] = useState<any[]>([]);
  const [configMensualidad, setConfigMensualidad] = useState({
    montoContinuo: 25000,
    montoInterrumpido: 30000,
    mesesParaContinuo: 3,
    toleranciaFaltas: 1
  });
  const [morososOpen, setMorososOpen] = useState(false);
  const [busquedaMoroso, setBusquedaMoroso] = useState('');
  const [controlAsistenciasOpen, setControlAsistenciasOpen] = useState(false);
  const [ayudaOpen, setAyudaOpen] = useState(false);
  const [ayudaModulo, setAyudaModulo] = useState('');
  const [filtroAsistencia, setFiltroAsistencia] = useState('Todos');
  const [todasAsistencias, setTodasAsistencias] = useState<any[]>([]);
  const [turnosOpen, setTurnosOpen] = useState(false);
  const [turnos, setTurnos] = useState<any[]>([]);
  const [nuevoTurnoOpen, setNuevoTurnoOpen] = useState(false);
  const [nuevoTurno, setNuevoTurno] = useState({
    dia: '',
    horaInicio: '',
    horaFin: '',
    cinturones: [] as string[]
  });
  const [nuevaIndumentaria, setNuevaIndumentaria] = useState({
    producto: '',
    talla: '',
    cantidad: '',
    precio: '',
    stockMinimo: ''
  });
  
  // Form data para nuevo pedido
  const [nuevoPedido, setNuevoPedido] = useState({
    alumno_id: '',
    alumno_nombre: '',
    producto: '',
    talla: '',
    precio: '',
    estado: 'Pedido',
    pagado: false
  });
  
  // Form data
  const [nuevoAlumno, setNuevoAlumno] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    cinturon: 'Blanco'
  });

  // Función para sincronizar renovaciones con alumnos
  const sincronizarRenovaciones = (alumnosActuales: any[]) => {
    const savedRenovacionesAnuales = localStorage.getItem('renovaciones-anuales-krav-maga');
    let renovacionesAnualesLocal: any[] = savedRenovacionesAnuales ? JSON.parse(savedRenovacionesAnuales) : [];
    
    // Generar renovaciones para todos los alumnos
    const renovacionesDinamicas = alumnosActuales.map((alumno: any) => {
      // Buscar si ya existe renovación para este alumno
      const renovacionExistente = renovacionesAnualesLocal.find((r: any) => 
        r.alumno === `${alumno.apellido}, ${alumno.nombre}` || r.alumno_id === alumno.id
      );
      
      // Si existe, usar datos existentes, si no, crear nueva
      return renovacionExistente || {
        id: alumno.id,
        alumno_id: alumno.id,
        alumno: `${alumno.apellido}, ${alumno.nombre}`,
        ficha: false,
        certificado: false,
        fechaCertificado: null,
        pago: false,
        montoPago: 15000,
        fechaPago: null,
        notas: 'Renovación pendiente'
      };
    });
    
    setRenovacionesAnuales(renovacionesDinamicas);
    localStorage.setItem('renovaciones-anuales-krav-maga', JSON.stringify(renovacionesDinamicas));
  };

  useEffect(() => {
    // Cargar datos para dashboard
    const savedAlumnos = localStorage.getItem('alumnos-krav-maga');
    const alumnosLocal = savedAlumnos ? JSON.parse(savedAlumnos) : [];
    setAlumnos(alumnosLocal);

    const savedPagos = localStorage.getItem('pagos-krav-maga');
    const pagosLocal = savedPagos ? JSON.parse(savedPagos) : [];
    setPagos(pagosLocal);

    const savedAsistencias = localStorage.getItem('asistencias-krav-maga');
    const todasAsistencias = savedAsistencias ? JSON.parse(savedAsistencias) : [];
    const hoy = new Date().toISOString().split('T')[0];
    const asistenciasDeHoy = todasAsistencias.filter((a: any) => a.fecha === hoy);
    setAsistenciasHoy(asistenciasDeHoy);

    const savedRenovaciones = localStorage.getItem('renovaciones-krav-maga');
    const renovacionesLocal = savedRenovaciones ? JSON.parse(savedRenovaciones) : [];
    setRenovaciones(renovacionesLocal);
    
    // Cargar pedidos
    const savedPedidos = localStorage.getItem('pedidos-krav-maga');
    const pedidosLocal = savedPedidos ? JSON.parse(savedPedidos) : [
      { id: 1, alumno_nombre: 'Juan Pérez', producto: 'Remera', talla: 'M', precio: 2500, estado: 'Pedido', fecha: '2024-01-15', pagado: false },
      { id: 2, alumno_nombre: 'María González', producto: 'Short', talla: 'L', precio: 3000, estado: 'Recibido', fecha: '2024-01-10', pagado: true },
      { id: 3, alumno_nombre: 'Pedro López', producto: 'Guantes', talla: 'L', precio: 4500, estado: 'Entregado', fecha: '2024-01-05', pagado: true }
    ];
    setPedidos(pedidosLocal);
    if (!savedPedidos) {
      localStorage.setItem('pedidos-krav-maga', JSON.stringify(pedidosLocal));
    }
    
    // Cargar stock
    const savedStock = localStorage.getItem('stock-krav-maga');
    const stockLocal = savedStock ? JSON.parse(savedStock) : [
      { id: 1, producto: 'Remera', talla: 'S', cantidad: 15, precio: 2500, stockMinimo: 8 },
      { id: 2, producto: 'Remera', talla: 'M', cantidad: 8, precio: 2500, stockMinimo: 10 },
      { id: 3, producto: 'Remera', talla: 'L', cantidad: 12, precio: 2500, stockMinimo: 8 },
      { id: 4, producto: 'Short', talla: 'M', cantidad: 5, precio: 3000, stockMinimo: 5 },
      { id: 5, producto: 'Short', talla: 'L', cantidad: 3, precio: 3000, stockMinimo: 4 },
      { id: 6, producto: 'Pantalón', talla: 'M', cantidad: 0, precio: 3500, stockMinimo: 3 },
      { id: 7, producto: 'Pantalón', talla: 'L', cantidad: 2, precio: 3500, stockMinimo: 4 },
      { id: 8, producto: 'Guantes', talla: 'L', cantidad: 10, precio: 4500, stockMinimo: 6 },
      { id: 9, producto: 'Protector Bucal', talla: 'Único', cantidad: 20, precio: 1500, stockMinimo: 12 }
    ];
    setStock(stockLocal);
    if (!savedStock) {
      localStorage.setItem('stock-krav-maga', JSON.stringify(stockLocal));
    }
    
    // Cargar historial de clases
    const savedHistorial = localStorage.getItem('historial-clases-krav-maga');
    const historialLocal = savedHistorial ? JSON.parse(savedHistorial) : [
      { id: 1, fecha: '2024-01-15', cinturon: 'Blanco', tema: 'Posición de guardia', tipo: 'Nuevo', notas: 'Buena recepción' },
      { id: 2, fecha: '2024-01-12', cinturon: 'Amarillo', tema: 'Defensa contra agarres', tipo: 'Repaso', notas: 'Necesita más práctica' },
      { id: 3, fecha: '2024-01-10', cinturon: 'Blanco', tema: 'Golpes básicos', tipo: 'Nuevo', notas: 'Excelente participación' }
    ];
    setHistorialClases(historialLocal);
    if (!savedHistorial) {
      localStorage.setItem('historial-clases-krav-maga', JSON.stringify(historialLocal));
    }
    
    // Cargar turnos
    const savedTurnos = localStorage.getItem('turnos-krav-maga');
    const turnosLocal = savedTurnos ? JSON.parse(savedTurnos) : [
      { id: 1, dia: 'Lunes', horaInicio: '17:00', horaFin: '18:00', cinturones: ['Blanco'] },
      { id: 2, dia: 'Lunes', horaInicio: '18:00', horaFin: '19:00', cinturones: ['Amarillo'] },
      { id: 3, dia: 'Lunes', horaInicio: '19:00', horaFin: '20:00', cinturones: ['Blanco'] },
      { id: 4, dia: 'Lunes', horaInicio: '20:00', horaFin: '21:00', cinturones: ['Naranja', 'Verde'] },
      { id: 5, dia: 'Miércoles', horaInicio: '17:00', horaFin: '18:00', cinturones: ['Blanco'] },
      { id: 6, dia: 'Miércoles', horaInicio: '18:00', horaFin: '19:00', cinturones: ['Amarillo'] },
      { id: 7, dia: 'Miércoles', horaInicio: '19:00', horaFin: '20:00', cinturones: ['Blanco'] },
      { id: 8, dia: 'Miércoles', horaInicio: '20:00', horaFin: '21:00', cinturones: ['Naranja', 'Verde'] },
      { id: 9, dia: 'Martes', horaInicio: '13:00', horaFin: '14:00', cinturones: ['Blanco', 'Amarillo'] },
      { id: 10, dia: 'Jueves', horaInicio: '13:00', horaFin: '14:00', cinturones: ['Blanco', 'Amarillo'] },
      { id: 11, dia: 'Viernes', horaInicio: '17:30', horaFin: '19:10', cinturones: ['Blanco'] },
      { id: 12, dia: 'Viernes', horaInicio: '19:10', horaFin: '21:00', cinturones: ['Blanco', 'Amarillo', 'Naranja'] }
    ];
    setTurnos(turnosLocal);
    if (!savedTurnos) {
      localStorage.setItem('turnos-krav-maga', JSON.stringify(turnosLocal));
    }
    
    // Cargar temarios
    const savedTemarios = localStorage.getItem('temarios-krav-maga');
    const temariosLocal = savedTemarios ? JSON.parse(savedTemarios) : {
      'Blanco': [
        'Posición de guardia',
        'Golpes básicos (puño, palma)',
        'Patadas básicas',
        'Defensa contra empujón',
        'Caída hacia atrás',
        'Liberación de agarres básicos'
      ],
      'Amarillo': [
        'Defensa contra agarres de muñeca',
        'Defensa contra estrangulación frontal',
        'Golpes de rodilla',
        'Patada frontal',
        'Combinaciones básicas',
        'Caída lateral'
      ],
      'Naranja': [
        'Defensa contra agarres por detrás',
        'Defensa contra estrangulación lateral',
        'Golpes de codo',
        'Patada circular',
        'Trabajo en el suelo básico',
        'Defensa contra empujón con dos manos'
      ],
      'Verde': [
        'Defensa contra oso (bear hug)',
        'Defensa contra headlock',
        'Patadas altas',
        'Combinaciones avanzadas',
        'Defensa en el suelo',
        'Defensa contra multiple atacantes'
      ],
      'Azul': [
        'Defensa contra armas blancas',
        'Defensa contra palo/bastón',
        'Técnicas de desarme',
        'Combate en espacios reducidos',
        'Defensa contra amenaza de arma',
        'Técnicas de control'
      ],
      'Marrón': [
        'Defensa contra arma de fuego',
        'Técnicas de protección de terceros',
        'Combate avanzado',
        'Situaciones de estrés',
        'Defensa en vehículos',
        'Técnicas de instructor'
      ]
    };
    setTemarios(temariosLocal);
    if (!savedTemarios) {
      localStorage.setItem('temarios-krav-maga', JSON.stringify(temariosLocal));
    }
    
    // Seleccionar turno actual por defecto
    const horaActual = new Date().getHours();
    const diaActual = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
    const diaFormateado = diaActual.charAt(0).toUpperCase() + diaActual.slice(1);
    
    const turnoActual = turnosLocal.find((t: any) => {
      const [horaInicio] = t.horaInicio.split(':').map(Number);
      const [horaFin] = t.horaFin.split(':').map(Number);
      return t.dia === diaFormateado && horaActual >= horaInicio && horaActual <= horaFin;
    });
    
    setTurnoSeleccionado(turnoActual || turnosLocal[0] || null);
    
    // Sincronizar renovaciones con alumnos cargados
    sincronizarRenovaciones(alumnosLocal);
    
    // Cargar exámenes
    const savedExamenes = localStorage.getItem('examenes-krav-maga');
    const examenesLocal = savedExamenes ? JSON.parse(savedExamenes) : [
      { id: 1, alumno: 'Ana Martínez', cinturonActual: 'Blanco', cinturonObjetivo: 'Amarillo', formulario: true, pago: true, montoPago: 8000, fechaPago: '2024-01-08', resultado: 'Aprobado', fechaExamen: '2024-01-20', notas: 'Excelente desempeño' },
      { id: 2, alumno: 'Carlos Ruiz', cinturonActual: 'Verde', cinturonObjetivo: 'Azul', formulario: true, pago: false, montoPago: 12000, fechaPago: null, resultado: 'Pendiente', fechaExamen: '2024-02-15', notas: 'Falta pago' },
      { id: 3, alumno: 'Lucía Torres', cinturonActual: 'Amarillo', cinturonObjetivo: 'Naranja', formulario: false, pago: false, montoPago: 9000, fechaPago: null, resultado: 'Pendiente', fechaExamen: null, notas: 'Falta formulario y pago' }
    ];
    setExamenes(examenesLocal);
    if (!savedExamenes) {
      localStorage.setItem('examenes-krav-maga', JSON.stringify(examenesLocal));
    }
    
    // Cargar próximos exámenes
    const savedProximosExamenes = localStorage.getItem('proximos-examenes-krav-maga');
    const proximosExamenesLocal = savedProximosExamenes ? JSON.parse(savedProximosExamenes) : [
      { id: 1, alumno: 'Juan Pérez', cinturonActual: 'Blanco', cinturonObjetivo: 'Amarillo', fechaExamen: '2024-02-15', formulario: true, pago: true, listo: true },
      { id: 2, alumno: 'María López', cinturonActual: 'Amarillo', cinturonObjetivo: 'Naranja', fechaExamen: '2024-02-15', formulario: true, pago: false, listo: false },
      { id: 3, alumno: 'Pedro Ruiz', cinturonActual: 'Verde', cinturonObjetivo: 'Azul', fechaExamen: '2024-02-15', formulario: false, pago: true, listo: false }
    ];
    setProximosExamenes(proximosExamenesLocal);
    if (!savedProximosExamenes) {
      localStorage.setItem('proximos-examenes-krav-maga', JSON.stringify(proximosExamenesLocal));
    }
    
    // Cargar notas de progreso
    const savedNotas = localStorage.getItem('notas-progreso-krav-maga');
    const notasLocal = savedNotas ? JSON.parse(savedNotas) : [
      { id: 1, alumno_id: 1, alumno_nombre: 'Juan Pérez', fecha: '2024-01-15', nota: 'Excelente progreso en golpes básicos. Necesita trabajar patadas.', instructor: 'Sensei Martínez' },
      { id: 2, alumno_id: 2, alumno_nombre: 'María González', fecha: '2024-01-12', nota: 'Buena técnica defensiva. Falta confianza en combate.', instructor: 'Sensei Martínez' }
    ];
    setNotasProgreso(notasLocal);
    if (!savedNotas) {
      localStorage.setItem('notas-progreso-krav-maga', JSON.stringify(notasLocal));
    }
    
    // Cargar configuración de montos
    const savedMontos = localStorage.getItem('montos-krav-maga');
    const montosLocal = savedMontos ? JSON.parse(savedMontos) : {
      renovacionAnual: 15000,
      examenBlanco: 8000,
      examenAmarillo: 9000,
      examenNaranja: 10000,
      examenVerde: 11000,
      examenAzul: 12000,
      examenMarron: 13000,
      examenNegro: 15000
    };
    setMontos(montosLocal);
    if (!savedMontos) {
      localStorage.setItem('montos-krav-maga', JSON.stringify(montosLocal));
    }
    
    // Cargar configuración de mensualidades
    const savedConfigMensualidad = localStorage.getItem('config-mensualidad-krav-maga');
    const configMensualidadLocal = savedConfigMensualidad ? JSON.parse(savedConfigMensualidad) : {
      montoContinuo: 25000,
      montoInterrumpido: 30000,
      mesesParaContinuo: 3,
      toleranciaFaltas: 1
    };
    setConfigMensualidad(configMensualidadLocal);
    if (!savedConfigMensualidad) {
      localStorage.setItem('config-mensualidad-krav-maga', JSON.stringify(configMensualidadLocal));
    }
    
    // Cargar mensualidades - generar desde alumnos
    const savedMensualidades = localStorage.getItem('mensualidades-krav-maga');
    let mensualidadesLocal: any[] = savedMensualidades ? JSON.parse(savedMensualidades) : [];
    
    // Generar mensualidades para todos los alumnos
    const mensualidadesDinamicas = alumnosLocal.map((alumno: any) => {
      const mensualidadExistente = mensualidadesLocal.find((m: any) => 
        m.alumno === `${alumno.apellido}, ${alumno.nombre}` || m.alumno_id === alumno.id
      );
      
      return mensualidadExistente || {
        id: alumno.id,
        alumno_id: alumno.id,
        alumno: `${alumno.apellido}, ${alumno.nombre}`,
        estado: 'Continuo',
        ultimoPago: null,
        monto: 25000,
        pagado: false,
        fechaPago: null,
        faltasConsecutivas: 0
      };
    });
    
    setMensualidades(mensualidadesDinamicas);
    localStorage.setItem('mensualidades-krav-maga', JSON.stringify(mensualidadesDinamicas));
    
    // Cargar todas las asistencias para análisis
    const savedTodasAsistencias = localStorage.getItem('asistencias-krav-maga');
    const todasAsistenciasLocal = savedTodasAsistencias ? JSON.parse(savedTodasAsistencias) : [
      { id: 1, alumno_id: 1, alumno_nombre: 'Juan', alumno_apellido: 'Pérez', fecha: '2024-01-15', presente: true },
      { id: 2, alumno_id: 2, alumno_nombre: 'María', alumno_apellido: 'González', fecha: '2024-01-15', presente: false },
      { id: 3, alumno_id: 3, alumno_nombre: 'Pedro', alumno_apellido: 'López', fecha: '2024-01-15', presente: true },
      { id: 4, alumno_id: 1, alumno_nombre: 'Juan', alumno_apellido: 'Pérez', fecha: '2024-01-12', presente: false },
      { id: 5, alumno_id: 2, alumno_nombre: 'María', alumno_apellido: 'González', fecha: '2024-01-12', presente: false },
      { id: 6, alumno_id: 4, alumno_nombre: 'Ana', alumno_apellido: 'Martínez', fecha: '2024-01-12', presente: true },
      { id: 7, alumno_id: 1, alumno_nombre: 'Juan', alumno_apellido: 'Pérez', fecha: '2024-01-10', presente: true },
      { id: 8, alumno_id: 2, alumno_nombre: 'María', alumno_apellido: 'González', fecha: '2024-01-10', presente: false }
    ];
    setTodasAsistencias(todasAsistenciasLocal);
    if (!savedTodasAsistencias) {
      localStorage.setItem('asistencias-krav-maga', JSON.stringify(todasAsistenciasLocal));
    }
  }, []);

  // Sincronizar renovaciones y mensualidades cuando cambian los alumnos
  useEffect(() => {
    if (alumnos.length > 0) {
      // Sincronizar renovaciones
      sincronizarRenovaciones(alumnos);
      
      // Sincronizar mensualidades
      const savedMensualidades = localStorage.getItem('mensualidades-krav-maga');
      let mensualidadesLocal: any[] = savedMensualidades ? JSON.parse(savedMensualidades) : [];
      
      const mensualidadesDinamicas = alumnos.map((alumno: any) => {
        const mensualidadExistente = mensualidadesLocal.find((m: any) => 
          m.alumno === `${alumno.apellido}, ${alumno.nombre}` || m.alumno_id === alumno.id
        );
        
        return mensualidadExistente || {
          id: alumno.id,
          alumno_id: alumno.id,
          alumno: `${alumno.apellido}, ${alumno.nombre}`,
          estado: 'Continuo',
          ultimoPago: null,
          monto: 25000,
          pagado: false,
          fechaPago: null,
          faltasConsecutivas: 0
        };
      });
      
      setMensualidades(mensualidadesDinamicas);
      localStorage.setItem('mensualidades-krav-maga', JSON.stringify(mensualidadesDinamicas));
    }
  }, [alumnos]);

  // Estadísticas
  const totalAlumnos = alumnos.length;
  const asistenciasHoyCount = asistenciasHoy.filter(a => a.presente).length;
  const pagosPendientes = pagos.filter(p => p.estado === 'Pendiente').length;
  const renovacionesPendientes = renovaciones.filter(r => 
    !r.pago_realizado || !r.formulario_entregado || !r.apto_fisico_entregado
  ).length;

  // Variables para alertas inteligentes
  const horaActual = new Date().getHours();
  
  // Calcular stock crítico
  const stockCritico = stock.filter(item => {
    const pedidosPendientes = pedidos.filter(p => 
      p.producto === item.producto && 
      p.talla === item.talla && 
      p.estado === 'Pedido'
    ).length;
    const stockDisponible = item.cantidad - pedidosPendientes;
    return stockDisponible <= (item.stockMinimo || 3); // Usar stock mínimo personalizado
  });
  const sinStock = stockCritico.filter(item => {
    const pedidosPendientes = pedidos.filter(p => 
      p.producto === item.producto && 
      p.talla === item.talla && 
      p.estado === 'Pedido'
    ).length;
    return (item.cantidad - pedidosPendientes) === 0;
  });
  
  // Próximas clases (simulado)
  const proximasClases = [
    { hora: '17:00', nivel: 'Blanco', alumnos: 8 },
    { hora: '18:00', nivel: 'Amarillo', alumnos: 12 },
    { hora: '19:00', nivel: 'Blanco', alumnos: 15 },
    { hora: '20:00', nivel: 'Naranja/Verde', alumnos: 10 }
  ].filter(clase => parseInt(clase.hora.split(':')[0]) > horaActual);

  return (
    <Box>
      {/* Header contextual para clase */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 700,
          color: 'primary.main',
          mb: 2,
          textAlign: 'center',
          fontSize: { xs: '1.3rem', sm: '1.5rem' }
        }}>
          🎯 {t('classInProgress')}
        </Typography>
        
        <Card sx={{ p: 2, mb: 2, borderRadius: 3, boxShadow: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Seleccionar Turno</InputLabel>
            <Select
              value={turnoSeleccionado?.id || ''}
              label="Seleccionar Turno"
              onChange={(e) => {
                const turno = turnos.find(t => t.id === e.target.value);
                setTurnoSeleccionado(turno);
              }}
              sx={{
                fontSize: { xs: '1rem', sm: '0.9rem' },
                '& .MuiSelect-select': {
                  py: { xs: 1.5, sm: 1 }
                }
              }}
            >
              {turnos.map((turno) => (
                <MenuItem 
                  key={turno.id} 
                  value={turno.id}
                  sx={{ 
                    fontSize: { xs: '1rem', sm: '0.9rem' },
                    py: { xs: 1.5, sm: 1 }
                  }}
                >
                  {turno.dia} {turno.horaInicio}-{turno.horaFin} ({turno.cinturones.join(', ')})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Card>
        
        {turnoSeleccionado && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              mb: 0.5
            }}>
              {turnoSeleccionado.dia} - {turnoSeleccionado.horaInicio} a {turnoSeleccionado.horaFin}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
              {turnoSeleccionado.cinturones.map((cinturon: string, index: number) => (
                <Chip
                  key={index}
                  label={cinturon}
                  size="small"
                  sx={{
                    bgcolor: 
                      cinturon === 'Blanco' ? '#ffffff' :
                      cinturon === 'Amarillo' ? '#ffeb3b' :
                      cinturon === 'Naranja' ? '#ff9800' :
                      cinturon === 'Verde' ? '#4caf50' :
                      cinturon === 'Azul' ? '#2196f3' :
                      cinturon === 'Marrón' ? '#795548' : '#000000',
                    color: 
                      cinturon === 'Blanco' ? '#000000' :
                      cinturon === 'Amarillo' ? '#000000' :
                      cinturon === 'Naranja' ? '#ffffff' :
                      cinturon === 'Verde' ? '#ffffff' :
                      cinturon === 'Azul' ? '#ffffff' :
                      cinturon === 'Marrón' ? '#ffffff' : '#ffffff',
                    border: cinturon === 'Blanco' ? '1px solid #ccc' : 'none',
                    fontWeight: 600
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* PASO 1: Tomar Asistencia */}
      <Card sx={{ mb: 3, borderLeft: '6px solid #1976d2' }}>
        <CardContent sx={{ py: 2 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: 'primary.main',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            1️⃣ {t('takeAttendance')}
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => setAsistenciaOpen(true)}
            sx={{
              width: '100%',
              py: 3,
              fontSize: { xs: '1.2rem', sm: '1.4rem' },
              fontWeight: 700,
              borderRadius: 3,
              boxShadow: 4,
              '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
              transition: 'all 0.2s ease'
            }}
          >
            {t('markPresent')}
          </Button>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            {totalAlumnos} alumnos esperados
          </Typography>
        </CardContent>
      </Card>

      {/* PASO 2: Última Clase Recordatorio */}
      <Card sx={{ mb: 3, borderLeft: '6px solid #ff9800' }}>
        <CardContent sx={{ py: 2 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: 'warning.main',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            2️⃣ {t('lastClassReminder')}
          </Typography>
          
          {(() => {
            if (!turnoSeleccionado) return null;
            
            // Buscar última clase de cualquier cinturón del turno seleccionado
            const ultimaClase = historialClases
              .filter(c => turnoSeleccionado.cinturones.includes(c.cinturon))
              .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
            
            if (!ultimaClase) {
              return (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    🆕 Primera clase de este turno
                  </Typography>
                </Box>
              );
            }
            
            return (
              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  📚 "{ultimaClase.tema}" ({ultimaClase.cinturon})
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {new Date(ultimaClase.fecha).toLocaleDateString('es-ES')} - {ultimaClase.tipo}
                </Typography>
                {ultimaClase.notas && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    📝 {ultimaClase.notas}
                  </Typography>
                )}
              </Box>
            );
          })()}
          
          {/* Alerta de Morosos */}
          {(() => {
            const morosos = mensualidades.filter(m => !m.pagado);
            if (morosos.length === 0) return null;
            
            return (
              <Card sx={{ 
                mt: 2,
                borderLeft: '6px solid #f44336',
                bgcolor: 'error.light',
                color: 'error.contrastText'
              }}>
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 1 }
                  }}>
                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        🚨 {morosos.length} alumnos morosos
                      </Typography>
                      <Typography variant="body2">
                        Requieren contacto urgente
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      onClick={() => setMorososOpen(true)}
                      sx={{
                        width: { xs: '100%', sm: 'auto' },
                        py: { xs: 2, sm: 1.5 },
                        fontSize: { xs: '1.1rem', sm: '1rem' },
                        fontWeight: 600
                      }}
                    >
                      Ver Morosos
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })()}
        </CardContent>
      </Card>



      {/* PASO 3: Opciones para Hoy */}
      <Card sx={{ mb: 3, borderLeft: '6px solid #4caf50' }}>
        <CardContent sx={{ py: 2 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: 'success.main',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            3️⃣ {t('todayOptions')}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={() => {
                  const cinturonPrincipal = turnoSeleccionado?.cinturones[0] || 'Blanco';
                  setNuevaClase({...nuevaClase, tipo: 'Repaso', cinturon: cinturonPrincipal});
                  setNuevaClaseOpen(true);
                }}
                sx={{
                  width: '100%',
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                {t('review')}
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                  const cinturonPrincipal = turnoSeleccionado?.cinturones[0] || 'Blanco';
                  setNuevaClase({...nuevaClase, tipo: 'Nuevo', cinturon: cinturonPrincipal});
                  setNuevaClaseOpen(true);
                }}
                sx={{
                  width: '100%',
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                {t('newTopic')}
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setTemarioOpen(true)}
                sx={{
                  width: '100%',
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                {t('syllabus')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Panel de Control Avanzado */}
      <Card sx={{ 
        mb: 3, 
        borderLeft: '6px solid #9c27b0',
        background: 'linear-gradient(90deg, #f3e5f5, #ffffff)',
        borderRadius: 3,
        boxShadow: 3
      }}>
        <CardContent sx={{ py: { xs: 3, sm: 3 } }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: 'secondary.main',
            mb: 3,
            textAlign: 'center',
            fontSize: { xs: '1.3rem', sm: '1.5rem' }
          }}>
            🏛️ PANEL DE CONTROL AVANZADO
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Person sx={{ fontSize: { xs: '1.8rem', sm: '2rem' }, color: 'primary.main', mb: 0.5 }} />
                <Typography variant="caption" sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  fontWeight: 600
                }}>
                  Alumnos
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Assessment sx={{ fontSize: { xs: '1.8rem', sm: '2rem' }, color: 'success.main', mb: 0.5 }} />
                <Typography variant="caption" sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  fontWeight: 600
                }}>
                  Reportes
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Store sx={{ fontSize: { xs: '1.8rem', sm: '2rem' }, color: 'warning.main', mb: 0.5 }} />
                <Typography variant="caption" sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  fontWeight: 600
                }}>
                  Tienda
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <School sx={{ fontSize: { xs: '1.8rem', sm: '2rem' }, color: 'info.main', mb: 0.5 }} />
                <Typography variant="caption" sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  fontWeight: 600
                }}>
                  Exámenes
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Button
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            onClick={() => setVerMasOpen(true)}
            sx={{ 
              py: { xs: 2.5, sm: 2 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 700,
              borderRadius: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            {t('accessAllFunctions')}
          </Button>
          
          {/* Botón de Ayuda */}
          <Button
            variant="outlined"
            color="info"
            size="large"
            startIcon={<Help />}
            onClick={() => {
              setAyudaModulo('general');
              setAyudaOpen(true);
            }}
            sx={{ 
              mt: 2,
              py: { xs: 1.5, sm: 1 },
              fontSize: { xs: '1rem', sm: '0.9rem' },
              fontWeight: 600,
              width: '100%'
            }}
          >
            {t('helpGuide')}
          </Button>
        </CardContent>
      </Card>
      
      {/* Modal Nuevo Alumno */}
      <Dialog open={nuevoAlumnoOpen} onClose={() => setNuevoAlumnoOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          ➕ {t('newStudent')}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={nuevoAlumno.nombre}
                onChange={(e) => setNuevoAlumno({...nuevoAlumno, nombre: e.target.value})}
                size="medium"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                value={nuevoAlumno.apellido}
                onChange={(e) => setNuevoAlumno({...nuevoAlumno, apellido: e.target.value})}
                size="medium"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={nuevoAlumno.telefono}
                onChange={(e) => setNuevoAlumno({...nuevoAlumno, telefono: e.target.value})}
                size="medium"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="medium">
                <InputLabel>Cinturón</InputLabel>
                <Select
                  value={nuevoAlumno.cinturon}
                  label="Cinturón"
                  onChange={(e) => setNuevoAlumno({...nuevoAlumno, cinturon: e.target.value})}
                >
                  <MenuItem value="Blanco">🤍 Blanco</MenuItem>
                  <MenuItem value="Amarillo">🟡 Amarillo</MenuItem>
                  <MenuItem value="Naranja">🟠 Naranja</MenuItem>
                  <MenuItem value="Verde">🟢 Verde</MenuItem>
                  <MenuItem value="Azul">🔵 Azul</MenuItem>
                  <MenuItem value="Marrón">🟤 Marrón</MenuItem>
                  <MenuItem value="Negro">⚫ Negro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button onClick={() => setNuevoAlumnoOpen(false)} size="large" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {t('cancel')}
          </Button>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            onClick={() => {
              // Guardar alumno
              const nuevoId = Math.max(...alumnos.map(a => a.id), 0) + 1;
              const alumnoCompleto = { ...nuevoAlumno, id: nuevoId, turnos: [] };
              const nuevosAlumnos = [...alumnos, alumnoCompleto];
              localStorage.setItem('alumnos-krav-maga', JSON.stringify(nuevosAlumnos));
              setAlumnos(nuevosAlumnos);
              setNuevoAlumno({ nombre: '', apellido: '', telefono: '', cinturon: 'Blanco' });
              setNuevoAlumnoOpen(false);
            }}
          >
            ✅ {t('create')} Alumno
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Asistencia Rápida */}
      <Dialog open={asistenciaOpen} onClose={() => setAsistenciaOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{
          backgroundColor: 'success.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          ✅ {t('takeAttendance')}
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {alumnos
              .filter(alumno => turnoSeleccionado?.cinturones.includes(alumno.cinturon))
              .slice(0, 10)
              .map((alumno) => {
              const asistencia = asistenciasHoy.find(a => a.alumno_id === alumno.id);
              const presente = asistencia?.presente || false;
              
              return (
                <Card key={alumno.id} sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {alumno.apellido}, {alumno.nombre}
                      </Typography>
                      <ToggleSwitch
                        checked={presente}
                        onChange={(checked) => {
                          // Actualizar asistencia
                          const nuevaAsistencia = {
                            id: Date.now(),
                            alumno_id: alumno.id,
                            alumno_nombre: alumno.nombre,
                            alumno_apellido: alumno.apellido,
                            turno_id: 1,
                            fecha: new Date().toISOString().split('T')[0],
                            presente: checked
                          };
                          
                          const nuevasAsistencias = asistenciasHoy.filter(a => a.alumno_id !== alumno.id);
                          if (checked) nuevasAsistencias.push(nuevaAsistencia);
                          
                          setAsistenciasHoy(nuevasAsistencias);
                          
                          // Guardar en localStorage
                          const todasAsistencias = JSON.parse(localStorage.getItem('asistencias-krav-maga') || '[]');
                          const filtradas = todasAsistencias.filter((a: any) => 
                            !(a.alumno_id === alumno.id && a.fecha === new Date().toISOString().split('T')[0])
                          );
                          if (checked) filtradas.push(nuevaAsistencia);
                          localStorage.setItem('asistencias-krav-maga', JSON.stringify(filtradas));
                        }}
                        label=""
                        size="medium"
                        color={presente ? "success" : "error"}
                      />
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setAsistenciaOpen(false)} 
            variant="contained" 
            size="large" 
            sx={{ width: '100%' }}
          >
            ✅ {t('close')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Pago Rápido */}
      <Dialog open={pagoRapidoOpen} onClose={() => setPagoRapidoOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: 'warning.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          💰 Cobrar Pago
        </DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          {morosoSeleccionado && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {morosoSeleccionado.apellido}, {morosoSeleccionado.nombre}
              </Typography>
              <Typography variant="h4" color="warning.main" fontWeight="bold" sx={{ mb: 2 }}>
                $58.000
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {morosoSeleccionado.dias_atraso || 0} días de atraso
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<Phone />}
                  onClick={() => {
                    if (morosoSeleccionado.telefono) {
                      window.open(`tel:${morosoSeleccionado.telefono}`, '_self');
                    }
                  }}
                >
                  Llamar
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    // Marcar como pagado
                    const nuevosPagos = pagos.map(p => 
                      p.id === morosoSeleccionado.id 
                        ? { ...p, estado: 'Pagado', fecha_pago: new Date().toISOString().split('T')[0], monto: 58000 }
                        : p
                    );
                    setPagos(nuevosPagos);
                    localStorage.setItem('pagos-krav-maga', JSON.stringify(nuevosPagos));
                    setPagoRapidoOpen(false);
                  }}
                >
                  ✅ Marcar Pagado
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPagoRapidoOpen(false)} sx={{ width: '100%' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Ver Más Funciones */}
      <Dialog 
        open={verMasOpen} 
        onClose={() => setVerMasOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 600
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          📊 Todas las Funciones
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'auto' }}>
          <List>
            <ListItem 
              button 
              onClick={() => {
                setVerMasOpen(false);
                setGestionAlumnosOpen(true);
              }}
              sx={{ 
                py: { xs: 3, sm: 2 },
                px: { xs: 3, sm: 2 },
                minHeight: { xs: 80, sm: 'auto' },
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 56, sm: 40 } }}>
                <Person color="primary" sx={{ fontSize: { xs: '2rem', sm: '1.5rem' } }} />
              </ListItemIcon>
              <ListItemText 
                primary={t('studentManagement')} 
                secondary="Crear, editar, eliminar y administrar alumnos"
                primaryTypographyProps={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
                secondaryTypographyProps={{
                  fontSize: { xs: '0.9rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              onClick={() => {
                setVerMasOpen(false);
                setPedidosOpen(true);
              }}
              sx={{ 
                py: { xs: 3, sm: 2 },
                px: { xs: 3, sm: 2 },
                minHeight: { xs: 80, sm: 'auto' },
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 56, sm: 40 } }}>
                <Store color="secondary" sx={{ fontSize: { xs: '2rem', sm: '1.5rem' } }} />
              </ListItemIcon>
              <ListItemText 
                primary={t('store')} 
                secondary="Gestionar pedidos de ropa y equipos"
                primaryTypographyProps={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
                secondaryTypographyProps={{
                  fontSize: { xs: '0.9rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              onClick={() => {
                setVerMasOpen(false);
                setStockOpen(true);
              }}
              sx={{ 
                py: { xs: 3, sm: 2 },
                px: { xs: 3, sm: 2 },
                minHeight: { xs: 80, sm: 'auto' },
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 56, sm: 40 } }}>
                <Inventory color="primary" sx={{ fontSize: { xs: '2rem', sm: '1.5rem' } }} />
              </ListItemIcon>
              <ListItemText 
                primary="Stock de Indumentaria" 
                secondary="Control de inventario y existencias"
                primaryTypographyProps={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
                secondaryTypographyProps={{
                  fontSize: { xs: '0.9rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              onClick={() => {
                setVerMasOpen(false);
                setTemarioOpen(true);
              }}
              sx={{ 
                py: { xs: 3, sm: 2 },
                px: { xs: 3, sm: 2 },
                minHeight: { xs: 80, sm: 'auto' },
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 56, sm: 40 } }}>
                <MenuBook color="secondary" sx={{ fontSize: { xs: '2rem', sm: '1.5rem' } }} />
              </ListItemIcon>
              <ListItemText 
                primary={t('syllabusClasses')} 
                secondary="Planificar y consultar temas por cinturón"
                primaryTypographyProps={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
                secondaryTypographyProps={{
                  fontSize: { xs: '0.9rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              onClick={() => {
                setVerMasOpen(false);
                setRenovacionesOpen(true);
              }}
              sx={{ 
                py: { xs: 3, sm: 2 },
                px: { xs: 3, sm: 2 },
                minHeight: { xs: 80, sm: 'auto' },
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 56, sm: 40 } }}>
                <Assessment color="warning" sx={{ fontSize: { xs: '2rem', sm: '1.5rem' } }} />
              </ListItemIcon>
              <ListItemText 
                primary={t('annualRenewals')} 
                secondary="Gestionar fichas, certificados y pagos"
                primaryTypographyProps={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
                secondaryTypographyProps={{
                  fontSize: { xs: '0.9rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              onClick={() => {
                setVerMasOpen(false);
                setExamenesOpen(true);
              }}
              sx={{ 
                py: { xs: 3, sm: 2 },
                px: { xs: 3, sm: 2 },
                minHeight: { xs: 80, sm: 'auto' },
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 56, sm: 40 } }}>
                <School color="info" sx={{ fontSize: { xs: '2rem', sm: '1.5rem' } }} />
              </ListItemIcon>
              <ListItemText 
                primary={t('exams')} 
                secondary="Gestionar formularios, pagos y resultados"
                primaryTypographyProps={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
                secondaryTypographyProps={{
                  fontSize: { xs: '0.9rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              onClick={() => {
                setVerMasOpen(false);
                setTurnosOpen(true);
              }}
              sx={{ 
                py: { xs: 3, sm: 2 },
                px: { xs: 3, sm: 2 },
                minHeight: { xs: 80, sm: 'auto' },
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 56, sm: 40 } }}>
                <Schedule color="success" sx={{ fontSize: { xs: '2rem', sm: '1.5rem' } }} />
              </ListItemIcon>
              <ListItemText 
                primary={t('schedules')} 
                secondary="Ver y modificar horarios de clases"
                primaryTypographyProps={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
                secondaryTypographyProps={{
                  fontSize: { xs: '0.9rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              onClick={() => {
                setVerMasOpen(false);
                setHerramientasOpen(true);
              }}
              sx={{ 
                py: { xs: 3, sm: 2 },
                px: { xs: 3, sm: 2 },
                minHeight: { xs: 80, sm: 'auto' },
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 56, sm: 40 } }}>
                <Person color="warning" sx={{ fontSize: { xs: '2rem', sm: '1.5rem' } }} />
              </ListItemIcon>
              <ListItemText 
                primary={t('instructorTools')} 
                secondary="Cronómetro, notas, estadísticas y más"
                primaryTypographyProps={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
                secondaryTypographyProps={{
                  fontSize: { xs: '0.9rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              onClick={() => {
                setVerMasOpen(false);
                setMensualidadesOpen(true);
              }}
              sx={{ 
                py: { xs: 3, sm: 2 },
                px: { xs: 3, sm: 2 },
                minHeight: { xs: 80, sm: 'auto' },
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 56, sm: 40 } }}>
                <Assessment color="primary" sx={{ fontSize: { xs: '2rem', sm: '1.5rem' } }} />
              </ListItemIcon>
              <ListItemText 
                primary={t('monthlyPayments')} 
                secondary="Control de pagos mensuales"
                primaryTypographyProps={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
                secondaryTypographyProps={{
                  fontSize: { xs: '0.9rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              onClick={() => {
                setVerMasOpen(false);
                setControlAsistenciasOpen(true);
              }}
              sx={{ 
                py: { xs: 3, sm: 2 },
                px: { xs: 3, sm: 2 },
                minHeight: { xs: 80, sm: 'auto' },
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 56, sm: 40 } }}>
                <Assessment color="info" sx={{ fontSize: { xs: '2rem', sm: '1.5rem' } }} />
              </ListItemIcon>
              <ListItemText 
                primary={t('attendanceControl')} 
                secondary="Historial e inasistencias por alumno"
                primaryTypographyProps={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
                secondaryTypographyProps={{
                  fontSize: { xs: '0.9rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              onClick={() => {
                setVerMasOpen(false);
                setConfigMontosOpen(true);
              }}
              sx={{ 
                py: { xs: 3, sm: 2 },
                px: { xs: 3, sm: 2 },
                minHeight: { xs: 80, sm: 'auto' },
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 56, sm: 40 } }}>
                <Assessment color="success" sx={{ fontSize: { xs: '2rem', sm: '1.5rem' } }} />
              </ListItemIcon>
              <ListItemText 
                primary={t('configureAmounts')} 
                secondary="Renovaciones y exámenes"
                primaryTypographyProps={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
                secondaryTypographyProps={{
                  fontSize: { xs: '0.9rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              onClick={() => {
                setVerMasOpen(false);
                setReportesOpen(true);
              }}
              sx={{ 
                py: { xs: 3, sm: 2 },
                px: { xs: 3, sm: 2 },
                minHeight: { xs: 80, sm: 'auto' }
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 56, sm: 40 } }}>
                <Assessment color="info" sx={{ fontSize: { xs: '2rem', sm: '1.5rem' } }} />
              </ListItemIcon>
              <ListItemText 
                primary={t('reports')} 
                secondary="Dashboard interactivo con exportación"
                primaryTypographyProps={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
                secondaryTypographyProps={{
                  fontSize: { xs: '0.9rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setVerMasOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Pedidos de Indumentaria */}
      <Dialog open={pedidosOpen} onClose={() => setPedidosOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{
          backgroundColor: 'secondary.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          🛍️ {t('store')}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 2, textAlign: 'right' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setNuevoPedidoOpen(true)}
              sx={{ mb: 2 }}
            >
              {t('newOrder')}
            </Button>
          </Box>
          
          <List>
            {pedidos.map((pedido) => (
              <Card key={pedido.id} sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {pedido.alumno_nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {pedido.producto} - Talla {pedido.talla} - ${pedido.precio.toLocaleString()}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Pedido: {pedido.fecha}
                        </Typography>
                        <Chip
                          label={pedido.pagado ? t('paid') : t('pending')}
                          color={pedido.pagado ? 'success' : 'error'}
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={pedido.estado}
                        color={
                          pedido.estado === 'Entregado' ? 'success' :
                          pedido.estado === 'Recibido' ? 'info' : 'warning'
                        }
                        size="small"
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {!pedido.pagado && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => {
                              const nuevosPedidos = pedidos.map(p => 
                                p.id === pedido.id ? { ...p, pagado: true } : p
                              );
                              setPedidos(nuevosPedidos);
                              localStorage.setItem('pedidos-krav-maga', JSON.stringify(nuevosPedidos));
                            }}
                          >
                            {t('markPaid')}
                          </Button>
                        )}
                        {pedido.estado !== 'Entregado' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              const nuevoEstado = pedido.estado === 'Pedido' ? 'Recibido' : 'Entregado';
                              const nuevosPedidos = pedidos.map(p => 
                                p.id === pedido.id ? { ...p, estado: nuevoEstado } : p
                              );
                              setPedidos(nuevosPedidos);
                              localStorage.setItem('pedidos-krav-maga', JSON.stringify(nuevosPedidos));
                              
                              // DESCONTAR STOCK AL MARCAR COMO RECIBIDO
                              if (nuevoEstado === 'Recibido') {
                                const nuevoStock = stock.map(s => 
                                  s.producto === pedido.producto && s.talla === pedido.talla
                                    ? { ...s, cantidad: Math.max(0, s.cantidad - 1) }
                                    : s
                                );
                                setStock(nuevoStock);
                                localStorage.setItem('stock-krav-maga', JSON.stringify(nuevoStock));
                              }
                            }}
                          >
                            {pedido.estado === 'Pedido' ? 'Marcar Recibido' : 'Marcar Entregado'}
                          </Button>
                        )}
                        
                        {pedido.estado === 'Pedido' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => {
                              if (window.confirm(`¿Cancelar pedido de ${pedido.alumno_nombre}?`)) {
                                const nuevosPedidos = pedidos.filter(p => p.id !== pedido.id);
                                setPedidos(nuevosPedidos);
                                localStorage.setItem('pedidos-krav-maga', JSON.stringify(nuevosPedidos));
                              }
                            }}
                          >
                            Cancelar Pedido
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPedidosOpen(false)} variant="outlined" sx={{ width: '100%' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Nuevo Pedido */}
      <Dialog open={nuevoPedidoOpen} onClose={() => setNuevoPedidoOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: 'secondary.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          🛍️ {t('newOrder')}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Alumno</InputLabel>
                <Select
                  value={nuevoPedido.alumno_id}
                  label="Alumno"
                  onChange={(e) => {
                    const alumnoId = e.target.value;
                    const alumno = alumnos.find(a => a.id.toString() === alumnoId);
                    setNuevoPedido({
                      ...nuevoPedido, 
                      alumno_id: alumnoId,
                      alumno_nombre: alumno ? `${alumno.apellido}, ${alumno.nombre}` : ''
                    });
                  }}
                >
                  {alumnos.map((alumno) => (
                    <MenuItem key={alumno.id} value={alumno.id.toString()}>
                      {alumno.apellido}, {alumno.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Producto</InputLabel>
                <Select
                  value={nuevoPedido.producto}
                  label="Producto"
                  onChange={(e) => {
                    setNuevoPedido({...nuevoPedido, producto: e.target.value, talla: '', precio: ''});
                  }}
                >
                  <MenuItem value="Remera">👕 Remera</MenuItem>
                  <MenuItem value="Short">🩳 Short</MenuItem>
                  <MenuItem value="Pantalón">👖 Pantalón</MenuItem>
                  <MenuItem value="Kimono">🥋 Kimono</MenuItem>
                  <MenuItem value="Guantes">🥊 Guantes</MenuItem>
                  <MenuItem value="Protector Bucal">🦷 Protector Bucal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Talla</InputLabel>
                <Select
                  value={nuevoPedido.talla}
                  label="Talla"
                  onChange={(e) => {
                    const tallaSeleccionada = e.target.value;
                    const itemStock = stock.find(s => s.producto === nuevoPedido.producto && s.talla === tallaSeleccionada);
                    setNuevoPedido({
                      ...nuevoPedido, 
                      talla: tallaSeleccionada,
                      precio: itemStock ? itemStock.precio.toString() : ''
                    });
                  }}
                >
                  {stock
                    .filter(s => s.producto === nuevoPedido.producto)
                    .map((item) => {
                      // Calcular stock disponible considerando pedidos pendientes
                      const pedidosPendientes = pedidos.filter(p => 
                        p.producto === item.producto && 
                        p.talla === item.talla && 
                        p.estado === 'Pedido'
                      ).length;
                      const stockDisponible = item.cantidad - pedidosPendientes;
                      
                      return (
                        <MenuItem 
                          key={`${item.producto}-${item.talla}`} 
                          value={item.talla}
                          disabled={stockDisponible <= 0}
                        >
                          {item.talla} {stockDisponible <= 0 ? '(Sin Stock)' : `(${stockDisponible} disponibles)`}
                        </MenuItem>
                      );
                    })
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={nuevoPedido.precio}
                onChange={(e) => setNuevoPedido({...nuevoPedido, precio: e.target.value})}
                InputProps={{
                  startAdornment: '$'
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button onClick={() => setNuevoPedidoOpen(false)} size="large" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            onClick={() => {
              // Verificar stock disponible considerando pedidos pendientes
              const itemStock = stock.find(s => s.producto === nuevoPedido.producto && s.talla === nuevoPedido.talla);
              const pedidosPendientes = pedidos.filter(p => 
                p.producto === nuevoPedido.producto && 
                p.talla === nuevoPedido.talla && 
                p.estado === 'Pedido'
              ).length;
              const stockDisponible = itemStock ? itemStock.cantidad - pedidosPendientes : 0;
              
              if (!itemStock || stockDisponible <= 0) {
                alert('⚠️ No hay stock disponible para este producto y talla');
                return;
              }
              
              const nuevoId = Math.max(...pedidos.map(p => p.id), 0) + 1;
              const pedidoCompleto = {
                ...nuevoPedido,
                id: nuevoId,
                precio: parseInt(nuevoPedido.precio),
                fecha: new Date().toISOString().split('T')[0]
              };
              
              // Actualizar pedidos (SIN descontar stock todavía)
              const nuevosPedidos = [...pedidos, pedidoCompleto];
              setPedidos(nuevosPedidos);
              localStorage.setItem('pedidos-krav-maga', JSON.stringify(nuevosPedidos));
              
              setNuevoPedido({ alumno_id: '', alumno_nombre: '', producto: '', talla: '', precio: '', estado: 'Pedido', pagado: false });
              setNuevoPedidoOpen(false);
            }}
          >
            ✅ Crear Pedido
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Stock de Indumentaria */}
      <Dialog open={stockOpen} onClose={() => setStockOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          📎 Stock de Indumentaria
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 2, textAlign: 'right' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setNuevaIndumentariaOpen(true)}
              sx={{ mb: 2 }}
            >
              Nueva Indumentaria
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            {stock.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx={{ 
                  borderRadius: 2,
                  border: item.cantidad === 0 ? '2px solid #f44336' : 
                         item.cantidad <= (item.stockMinimo || 3) ? '2px solid #ff9800' : '2px solid #4caf50'
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {item.producto}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Talla: {item.talla}
                    </Typography>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700,
                      color: item.cantidad === 0 ? 'error.main' : 
                             item.cantidad <= (item.stockMinimo || 3) ? 'warning.main' : 'success.main',
                      mb: 1
                    }}>
                      {item.cantidad}
                    </Typography>
                    
                    {editandoMinimo === item.id ? (
                      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption">Mínimo:</Typography>
                        <TextField
                          size="small"
                          type="number"
                          value={nuevoMinimo}
                          onChange={(e) => setNuevoMinimo(e.target.value)}
                          sx={{ width: 60 }}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => {
                            const minimo = parseInt(nuevoMinimo);
                            if (minimo >= 0) {
                              const nuevoStock = stock.map(s => 
                                s.id === item.id ? { ...s, stockMinimo: minimo } : s
                              );
                              setStock(nuevoStock);
                              localStorage.setItem('stock-krav-maga', JSON.stringify(nuevoStock));
                            }
                            setEditandoMinimo(null);
                            setNuevoMinimo('');
                          }}
                        >
                          ✓
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setEditandoMinimo(null);
                            setNuevoMinimo('');
                          }}
                        >
                          ✕
                        </Button>
                      </Box>
                    ) : (
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          display: 'block',
                          mb: 1,
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => {
                          setEditandoMinimo(item.id);
                          setNuevoMinimo((item.stockMinimo || 3).toString());
                        }}
                      >
                        Mínimo: {item.stockMinimo || 3} 📝
                      </Typography>
                    )}
                    {editandoPrecio === item.id ? (
                      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          size="small"
                          type="number"
                          value={nuevoPrecio}
                          onChange={(e) => setNuevoPrecio(e.target.value)}
                          InputProps={{
                            startAdornment: '$',
                            style: { fontSize: '0.9rem' }
                          }}
                          sx={{ width: 100 }}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => {
                            const precio = parseInt(nuevoPrecio);
                            if (precio > 0) {
                              const nuevoStock = stock.map(s => 
                                s.id === item.id ? { ...s, precio: precio } : s
                              );
                              setStock(nuevoStock);
                              localStorage.setItem('stock-krav-maga', JSON.stringify(nuevoStock));
                            }
                            setEditandoPrecio(null);
                            setNuevoPrecio('');
                          }}
                        >
                          ✓
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setEditandoPrecio(null);
                            setNuevoPrecio('');
                          }}
                        >
                          ✕
                        </Button>
                      </Box>
                    ) : (
                      <Typography 
                        variant="body2" 
                        color="primary.main" 
                        sx={{ 
                          mb: 2, 
                          fontWeight: 600,
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => {
                          setEditandoPrecio(item.id);
                          setNuevoPrecio(item.precio.toString());
                        }}
                      >
                        ${item.precio.toLocaleString()} 📝
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          if (item.cantidad > 0) {
                            const nuevoStock = stock.map(s => 
                              s.id === item.id ? { ...s, cantidad: s.cantidad - 1 } : s
                            );
                            setStock(nuevoStock);
                            localStorage.setItem('stock-krav-maga', JSON.stringify(nuevoStock));
                          }
                        }}
                        disabled={item.cantidad === 0}
                      >
                        -1
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => {
                          const nuevoStock = stock.map(s => 
                            s.id === item.id ? { ...s, cantidad: s.cantidad + 1 } : s
                          );
                          setStock(nuevoStock);
                          localStorage.setItem('stock-krav-maga', JSON.stringify(nuevoStock));
                        }}
                      >
                        +1
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar ${item.producto} ${item.talla} del stock?`)) {
                            const nuevoStock = stock.filter(s => s.id !== item.id);
                            setStock(nuevoStock);
                            localStorage.setItem('stock-krav-maga', JSON.stringify(nuevoStock));
                          }
                        }}
                        sx={{ mt: 1, width: '100%' }}
                      >
                        Eliminar
                      </Button>
                    </Box>
                    
                    {item.cantidad === 0 && (
                      <Chip
                        label="SIN STOCK"
                        color="error"
                        size="small"
                        sx={{ mt: 1, fontWeight: 600 }}
                      />
                    )}
                    {item.cantidad > 0 && item.cantidad <= (item.stockMinimo || 3) && (
                      <Chip
                        label="STOCK BAJO"
                        color="warning"
                        size="small"
                        sx={{ mt: 1, fontWeight: 600 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setStockOpen(false)} variant="outlined" sx={{ width: '100%' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Nueva Indumentaria */}
      <Dialog open={nuevaIndumentariaOpen} onClose={() => setNuevaIndumentariaOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          🛍️ Nueva Indumentaria
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Producto</InputLabel>
                <Select
                  value={nuevaIndumentaria.producto}
                  label="Producto"
                  onChange={(e) => setNuevaIndumentaria({...nuevaIndumentaria, producto: e.target.value})}
                >
                  <MenuItem value="Remera">👕 Remera</MenuItem>
                  <MenuItem value="Short">🩳 Short</MenuItem>
                  <MenuItem value="Pantalón">👖 Pantalón</MenuItem>
                  <MenuItem value="Kimono">🥋 Kimono</MenuItem>
                  <MenuItem value="Guantes">🥊 Guantes</MenuItem>
                  <MenuItem value="Protector Bucal">🦷 Protector Bucal</MenuItem>
                  <MenuItem value="Camiseta">👕 Camiseta</MenuItem>
                  <MenuItem value="Sudadera">👚 Sudadera</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Talla</InputLabel>
                <Select
                  value={nuevaIndumentaria.talla}
                  label="Talla"
                  onChange={(e) => setNuevaIndumentaria({...nuevaIndumentaria, talla: e.target.value})}
                >
                  <MenuItem value="XS">XS</MenuItem>
                  <MenuItem value="S">S</MenuItem>
                  <MenuItem value="M">M</MenuItem>
                  <MenuItem value="L">L</MenuItem>
                  <MenuItem value="XL">XL</MenuItem>
                  <MenuItem value="XXL">XXL</MenuItem>
                  <MenuItem value="Único">Único</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cantidad Inicial"
                type="number"
                value={nuevaIndumentaria.cantidad}
                onChange={(e) => setNuevaIndumentaria({...nuevaIndumentaria, cantidad: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={nuevaIndumentaria.precio}
                onChange={(e) => setNuevaIndumentaria({...nuevaIndumentaria, precio: e.target.value})}
                InputProps={{
                  startAdornment: '$'
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Stock Mínimo"
                type="number"
                value={nuevaIndumentaria.stockMinimo}
                onChange={(e) => setNuevaIndumentaria({...nuevaIndumentaria, stockMinimo: e.target.value})}
                helperText="Cantidad mínima antes de mostrar alerta"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button onClick={() => setNuevaIndumentariaOpen(false)} size="large" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            onClick={() => {
              const nuevoId = Math.max(...stock.map(s => s.id), 0) + 1;
              const indumentariaCompleta = {
                id: nuevoId,
                producto: nuevaIndumentaria.producto,
                talla: nuevaIndumentaria.talla,
                cantidad: parseInt(nuevaIndumentaria.cantidad) || 0,
                precio: parseInt(nuevaIndumentaria.precio) || 0,
                stockMinimo: parseInt(nuevaIndumentaria.stockMinimo) || 3
              };
              const nuevoStock = [...stock, indumentariaCompleta];
              setStock(nuevoStock);
              localStorage.setItem('stock-krav-maga', JSON.stringify(nuevoStock));
              setNuevaIndumentaria({ producto: '', talla: '', cantidad: '', precio: '', stockMinimo: '' });
              setNuevaIndumentariaOpen(false);
            }}
          >
            ✅ Crear Indumentaria
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Temario de Clases */}
      <Dialog 
        open={temarioOpen} 
        onClose={() => setTemarioOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 900px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 1000
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'secondary.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          📚 Temario de Clases
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          {/* Selector de Cinturón - Mobile First */}
          <Card sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3,
            borderRadius: 3,
            boxShadow: 3
          }}>
            <Typography variant="h5" sx={{ 
              mb: 2,
              fontWeight: 700,
              textAlign: 'center',
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}>
              Seleccionar Cinturón
            </Typography>
            <FormControl fullWidth>
              <Select
                value={cinturonSeleccionado}
                onChange={(e) => setCinturonSeleccionado(e.target.value)}
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  '& .MuiSelect-select': {
                    py: { xs: 2, sm: 1.5 }
                  }
                }}
              >
                <MenuItem value="Blanco" sx={{ fontSize: { xs: '1.1rem', sm: '1rem' }, py: { xs: 1.5, sm: 1 } }}>🤍 Blanco</MenuItem>
                <MenuItem value="Amarillo" sx={{ fontSize: { xs: '1.1rem', sm: '1rem' }, py: { xs: 1.5, sm: 1 } }}>🟡 Amarillo</MenuItem>
                <MenuItem value="Naranja" sx={{ fontSize: { xs: '1.1rem', sm: '1rem' }, py: { xs: 1.5, sm: 1 } }}>🟠 Naranja</MenuItem>
                <MenuItem value="Verde" sx={{ fontSize: { xs: '1.1rem', sm: '1rem' }, py: { xs: 1.5, sm: 1 } }}>🟢 Verde</MenuItem>
                <MenuItem value="Azul" sx={{ fontSize: { xs: '1.1rem', sm: '1rem' }, py: { xs: 1.5, sm: 1 } }}>🔵 Azul</MenuItem>
                <MenuItem value="Marrón" sx={{ fontSize: { xs: '1.1rem', sm: '1rem' }, py: { xs: 1.5, sm: 1 } }}>🟤 Marrón</MenuItem>
              </Select>
            </FormControl>
          </Card>
              
          {/* Sugerencia - Mobile First */}
          <Card sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3,
            bgcolor: 'info.light',
            borderRadius: 3,
            boxShadow: 3
          }}>
            <Typography variant="h5" sx={{ 
              mb: 2,
              fontWeight: 700,
              textAlign: 'center',
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}>
              💡 Sugerencia
            </Typography>
            {(() => {
              const ultimaClase = historialClases
                .filter(c => c.cinturon === cinturonSeleccionado)
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
              
              if (!ultimaClase) {
                return (
                  <Typography variant="body1" sx={{ 
                    textAlign: 'center',
                    fontSize: { xs: '1rem', sm: '0.875rem' },
                    mb: 2
                  }}>
                    Comenzar con el primer tema del temario
                  </Typography>
                );
              }
              
              const sugerencia = ultimaClase.tipo === 'Nuevo' ? 'Repaso' : 'Nuevo';
              return (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ 
                    fontSize: { xs: '1rem', sm: '0.875rem' },
                    mb: 1
                  }}>
                    Última clase: <strong>{ultimaClase.tema}</strong> ({ultimaClase.tipo})
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    color: 'info.dark',
                    fontSize: { xs: '1.1rem', sm: '1rem' }
                  }}>
                    Sugerencia: {sugerencia === 'Repaso' ? 'Repasar tema anterior' : 'Introducir tema nuevo'}
                  </Typography>
                </Box>
              );
            })()}
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setNuevaClaseOpen(true)}
                sx={{
                  flex: 1,
                  py: { xs: 2, sm: 1.5 },
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
              >
                Registrar Clase
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setGestionTemarioOpen(true)}
                sx={{
                  flex: 1,
                  py: { xs: 2, sm: 1.5 },
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  fontWeight: 600
                }}
              >
                Gestionar Temario
              </Button>
            </Box>
          </Card>
            
          {/* Temario por Cinturón - Mobile First */}
          <Card sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3,
            borderRadius: 3,
            boxShadow: 3
          }}>
            <Typography variant="h5" sx={{ 
              mb: 2,
              fontWeight: 700,
              textAlign: 'center',
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}>
              Temario {cinturonSeleccionado}
            </Typography>
            <List>
                  {(() => {
                    const temarios = {
                      'Blanco': [
                        'Posición de guardia',
                        'Golpes básicos (puño, palma)',
                        'Patadas básicas',
                        'Defensa contra empujón',
                        'Caída hacia atrás',
                        'Liberación de agarres básicos'
                      ],
                      'Amarillo': [
                        'Defensa contra agarres de muñeca',
                        'Defensa contra estrangulación frontal',
                        'Golpes de rodilla',
                        'Patada frontal',
                        'Combinaciones básicas',
                        'Caída lateral'
                      ],
                      'Naranja': [
                        'Defensa contra agarres por detrás',
                        'Defensa contra estrangulación lateral',
                        'Golpes de codo',
                        'Patada circular',
                        'Trabajo en el suelo básico',
                        'Defensa contra empujón con dos manos'
                      ],
                      'Verde': [
                        'Defensa contra oso (bear hug)',
                        'Defensa contra headlock',
                        'Patadas altas',
                        'Combinaciones avanzadas',
                        'Defensa en el suelo',
                        'Defensa contra multiple atacantes'
                      ],
                      'Azul': [
                        'Defensa contra armas blancas',
                        'Defensa contra palo/bastón',
                        'Técnicas de desarme',
                        'Combate en espacios reducidos',
                        'Defensa contra amenaza de arma',
                        'Técnicas de control'
                      ],
                      'Marrón': [
                        'Defensa contra arma de fuego',
                        'Técnicas de protección de terceros',
                        'Combate avanzado',
                        'Situaciones de estrés',
                        'Defensa en vehículos',
                        'Técnicas de instructor'
                      ]
                    };
                    
                    return (temarios[cinturonSeleccionado as keyof typeof temarios] || []).map((tema: string, index: number) => (
                      <ListItem key={index} sx={{ 
                        py: { xs: 1.5, sm: 0.5 },
                        borderBottom: '1px solid',
                        borderColor: 'grey.200',
                        '&:last-child': { borderBottom: 'none' }
                      }}>
                        <ListItemText 
                          primary={`${index + 1}. ${tema}`}
                          primaryTypographyProps={{ 
                            fontSize: { xs: '1rem', sm: '0.9rem' },
                            fontWeight: 500
                          }}
                        />
                      </ListItem>
                    ));
                  })()}
            </List>
          </Card>
          
          {/* Historial de Clases - Mobile First */}
          <Card sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3,
            borderRadius: 3,
            boxShadow: 3
          }}>
            <Typography variant="h5" sx={{ 
              mb: 2,
              fontWeight: 700,
              textAlign: 'center',
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}>
              Historial Reciente
            </Typography>
            <List>
                  {historialClases
                    .filter(c => c.cinturon === cinturonSeleccionado)
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    .slice(0, 5)
                    .map((clase) => (
                      <Card key={clase.id} sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'grey.200'
                      }}>
                        <CardContent sx={{ p: { xs: 2, sm: 2 } }}>
                          <Box sx={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 1, sm: 0 }
                          }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ 
                                fontSize: { xs: '1rem', sm: '0.9rem' },
                                fontWeight: 600,
                                mb: 0.5
                              }}>
                                {clase.tema}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{
                                fontSize: { xs: '0.9rem', sm: '0.8rem' },
                                mb: clase.notas ? 0.5 : 0
                              }}>
                                {new Date(clase.fecha).toLocaleDateString('es-ES')} - {clase.tipo}
                              </Typography>
                              {clase.notas && (
                                <Typography variant="body2" sx={{ 
                                  fontStyle: 'italic',
                                  fontSize: { xs: '0.9rem', sm: '0.8rem' }
                                }}>
                                  {clase.notas}
                                </Typography>
                              )}
                            </Box>
                            <Chip
                              label={clase.tipo}
                              size={window.innerWidth < 600 ? 'medium' : 'small'}
                              color={clase.tipo === 'Nuevo' ? 'primary' : 'secondary'}
                              sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '0.9rem', sm: '0.8rem' }
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  }
            </List>
          </Card>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setTemarioOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Registrar Nueva Clase */}
      <Dialog open={nuevaClaseOpen} onClose={() => setNuevaClaseOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: 'secondary.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          📝 Registrar Clase
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha"
                type="date"
                value={nuevaClase.fecha}
                onChange={(e) => setNuevaClase({...nuevaClase, fecha: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Cinturón</InputLabel>
                <Select
                  value={nuevaClase.cinturon}
                  label="Cinturón"
                  onChange={(e) => setNuevaClase({...nuevaClase, cinturon: e.target.value})}
                >
                  <MenuItem value="Blanco">🤍 Blanco</MenuItem>
                  <MenuItem value="Amarillo">🟡 Amarillo</MenuItem>
                  <MenuItem value="Naranja">🟠 Naranja</MenuItem>
                  <MenuItem value="Verde">🟢 Verde</MenuItem>
                  <MenuItem value="Azul">🔵 Azul</MenuItem>
                  <MenuItem value="Marrón">🟤 Marrón</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tema de la Clase"
                value={nuevaClase.tema}
                onChange={(e) => setNuevaClase({...nuevaClase, tema: e.target.value})}
                placeholder="Ej: Posición de guardia"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Clase</InputLabel>
                <Select
                  value={nuevaClase.tipo}
                  label="Tipo de Clase"
                  onChange={(e) => setNuevaClase({...nuevaClase, tipo: e.target.value})}
                >
                  <MenuItem value="Nuevo">🆕 Tema Nuevo</MenuItem>
                  <MenuItem value="Repaso">🔄 Repaso</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas (Opcional)"
                multiline
                rows={3}
                value={nuevaClase.notas}
                onChange={(e) => setNuevaClase({...nuevaClase, notas: e.target.value})}
                placeholder="Observaciones sobre el progreso de los alumnos..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button onClick={() => setNuevaClaseOpen(false)} size="large" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            onClick={() => {
              const nuevoId = Math.max(...historialClases.map(h => h.id), 0) + 1;
              const claseCompleta = { ...nuevaClase, id: nuevoId };
              const nuevoHistorial = [...historialClases, claseCompleta];
              setHistorialClases(nuevoHistorial);
              localStorage.setItem('historial-clases-krav-maga', JSON.stringify(nuevoHistorial));
              setNuevaClase({
                fecha: new Date().toISOString().split('T')[0],
                cinturon: 'Blanco',
                tema: '',
                tipo: 'Nuevo',
                notas: ''
              });
              setNuevaClaseOpen(false);
            }}
          >
            ✅ Registrar Clase
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Turnos y Horarios */}
      <Dialog 
        open={turnosOpen} 
        onClose={() => setTurnosOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 800
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'success.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          📅 Turnos y Horarios
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setNuevoTurnoOpen(true)}
              size="large"
              sx={{ 
                mb: 2,
                px: { xs: 4, sm: 3 },
                py: { xs: 2, sm: 1.5 },
                fontSize: { xs: '1.1rem', sm: '1rem' },
                fontWeight: 600,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Nuevo Turno
            </Button>
          </Box>
          
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(dia => {
            const turnosDelDia = turnos.filter(t => t.dia === dia);
            if (turnosDelDia.length === 0) return null;
            
            return (
              <Card key={dia} sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    mb: 3, 
                    color: 'primary.main',
                    fontSize: { xs: '1.3rem', sm: '1.5rem' },
                    textAlign: 'center',
                    borderBottom: '2px solid',
                    borderColor: 'primary.main',
                    pb: 1
                  }}>
                    {dia}
                  </Typography>
                  
                  {turnosDelDia
                    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                    .map((turno) => (
                      <Card key={turno.id} sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'grey.200'
                      }}>
                        <CardContent sx={{ p: { xs: 2, sm: 2 } }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 2, sm: 1 }
                          }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ 
                                fontWeight: 700,
                                fontSize: { xs: '1.1rem', sm: '1rem' },
                                color: 'primary.main',
                                mb: 1
                              }}>
                                {turno.horaInicio} - {turno.horaFin}
                              </Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                gap: 1, 
                                flexWrap: 'wrap'
                              }}>
                                {turno.cinturones.map((cinturon: string, index: number) => (
                                  <Chip
                                    key={index}
                                    label={cinturon}
                                    size={window.innerWidth < 600 ? 'medium' : 'small'}
                                    sx={{
                                      bgcolor: 
                                        cinturon === 'Blanco' ? '#ffffff' :
                                        cinturon === 'Amarillo' ? '#ffeb3b' :
                                        cinturon === 'Naranja' ? '#ff9800' :
                                        cinturon === 'Verde' ? '#4caf50' :
                                        cinturon === 'Azul' ? '#2196f3' :
                                        cinturon === 'Marrón' ? '#795548' : '#000000',
                                      color: 
                                        cinturon === 'Blanco' ? '#000000' :
                                        cinturon === 'Amarillo' ? '#000000' :
                                        cinturon === 'Naranja' ? '#ffffff' :
                                        cinturon === 'Verde' ? '#ffffff' :
                                        cinturon === 'Azul' ? '#ffffff' :
                                        cinturon === 'Marrón' ? '#ffffff' : '#ffffff',
                                      border: cinturon === 'Blanco' ? '1px solid #ccc' : 'none',
                                      fontWeight: 600,
                                      fontSize: { xs: '0.9rem', sm: '0.8rem' }
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                            
                            <Button
                              variant="outlined"
                              color="error"
                              size={window.innerWidth < 600 ? 'large' : 'small'}
                              startIcon={<Delete />}
                              onClick={() => {
                                if (window.confirm(`¿Eliminar turno ${turno.horaInicio}-${turno.horaFin} del ${dia}?`)) {
                                  const nuevosTurnos = turnos.filter(t => t.id !== turno.id);
                                  setTurnos(nuevosTurnos);
                                  localStorage.setItem('turnos-krav-maga', JSON.stringify(nuevosTurnos));
                                }
                              }}
                              sx={{
                                minWidth: { xs: '100%', sm: 'auto' },
                                py: { xs: 1.5, sm: 0.5 },
                                fontSize: { xs: '1rem', sm: '0.875rem' },
                                fontWeight: 600
                              }}
                            >
                              Eliminar
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  }
                </CardContent>
              </Card>
            );
          })}
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setTurnosOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Nuevo Turno */}
      <Dialog open={nuevoTurnoOpen} onClose={() => setNuevoTurnoOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: 'success.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          📅 Nuevo Turno
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Día de la Semana</InputLabel>
                <Select
                  value={nuevoTurno.dia}
                  label="Día de la Semana"
                  onChange={(e) => setNuevoTurno({...nuevoTurno, dia: e.target.value})}
                >
                  <MenuItem value="Lunes">Lunes</MenuItem>
                  <MenuItem value="Martes">Martes</MenuItem>
                  <MenuItem value="Miércoles">Miércoles</MenuItem>
                  <MenuItem value="Jueves">Jueves</MenuItem>
                  <MenuItem value="Viernes">Viernes</MenuItem>
                  <MenuItem value="Sábado">Sábado</MenuItem>
                  <MenuItem value="Domingo">Domingo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Hora Inicio"
                type="time"
                value={nuevoTurno.horaInicio}
                onChange={(e) => setNuevoTurno({...nuevoTurno, horaInicio: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Hora Fin"
                type="time"
                value={nuevoTurno.horaFin}
                onChange={(e) => setNuevoTurno({...nuevoTurno, horaFin: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Cinturones para este turno:
              </Typography>
              {['Blanco', 'Amarillo', 'Naranja', 'Verde', 'Azul', 'Marrón'].map((cinturon) => (
                <FormControlLabel
                  key={cinturon}
                  control={
                    <Checkbox
                      checked={nuevoTurno.cinturones.includes(cinturon)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNuevoTurno({
                            ...nuevoTurno,
                            cinturones: [...nuevoTurno.cinturones, cinturon]
                          });
                        } else {
                          setNuevoTurno({
                            ...nuevoTurno,
                            cinturones: nuevoTurno.cinturones.filter(c => c !== cinturon)
                          });
                        }
                      }}
                    />
                  }
                  label={cinturon}
                  sx={{ display: 'block' }}
                />
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button onClick={() => setNuevoTurnoOpen(false)} size="large" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            onClick={() => {
              const nuevoId = Math.max(...turnos.map(t => t.id), 0) + 1;
              const turnoCompleto = {
                id: nuevoId,
                dia: nuevoTurno.dia,
                horaInicio: nuevoTurno.horaInicio,
                horaFin: nuevoTurno.horaFin,
                cinturones: nuevoTurno.cinturones
              };
              const nuevosTurnos = [...turnos, turnoCompleto];
              setTurnos(nuevosTurnos);
              localStorage.setItem('turnos-krav-maga', JSON.stringify(nuevosTurnos));
              setNuevoTurno({ dia: '', horaInicio: '', horaFin: '', cinturones: [] });
              setNuevoTurnoOpen(false);
            }}
          >
            ✅ Crear Turno
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Gestionar Temario */}
      <Dialog 
        open={gestionTemarioOpen} 
        onClose={() => setGestionTemarioOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 700
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'secondary.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          ⚙️ Gestionar Temario {cinturonSeleccionado}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          
          {/* Botón Agregar Tema */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setNuevoTemaOpen(true)}
              size="large"
              sx={{ 
                px: { xs: 4, sm: 3 },
                py: { xs: 2, sm: 1.5 },
                fontSize: { xs: '1.1rem', sm: '1rem' },
                fontWeight: 600,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Agregar Tema
            </Button>
          </Box>
          
          {/* Lista de Temas Editables */}
          <List>
            {(temarios[cinturonSeleccionado as keyof typeof temarios] || []).map((tema: string, index: number) => (
              <Card key={index} sx={{ 
                mb: 2,
                borderRadius: 2,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 2 } }}>
                  {editandoTema?.cinturon === cinturonSeleccionado && editandoTema?.index === index ? (
                    // Modo edición
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                      <TextField
                        fullWidth
                        value={editandoTema.tema}
                        onChange={(e) => setEditandoTema({...editandoTema, tema: e.target.value})}
                        sx={{ 
                          '& .MuiInputBase-input': {
                            fontSize: { xs: '1rem', sm: '0.9rem' },
                            py: { xs: 1.5, sm: 1 }
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<Save />}
                          onClick={() => {
                            const nuevosTemarios = {...temarios};
                            nuevosTemarios[cinturonSeleccionado][index] = editandoTema.tema;
                            setTemarios(nuevosTemarios);
                            localStorage.setItem('temarios-krav-maga', JSON.stringify(nuevosTemarios));
                            setEditandoTema(null);
                          }}
                          sx={{ 
                            flex: { xs: 1, sm: 'none' },
                            fontSize: { xs: '1rem', sm: '0.875rem' }
                          }}
                        >
                          Guardar
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={() => setEditandoTema(null)}
                          sx={{ 
                            flex: { xs: 1, sm: 'none' },
                            fontSize: { xs: '1rem', sm: '0.875rem' }
                          }}
                        >
                          Cancelar
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    // Modo visualización
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 2, sm: 1 }
                    }}>
                      <Typography variant="body1" sx={{ 
                        flex: 1,
                        fontSize: { xs: '1rem', sm: '0.9rem' },
                        fontWeight: 500
                      }}>
                        {index + 1}. {tema}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<Edit />}
                          onClick={() => setEditandoTema({cinturon: cinturonSeleccionado, index, tema})}
                          sx={{ 
                            flex: { xs: 1, sm: 'none' },
                            fontSize: { xs: '1rem', sm: '0.875rem' }
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => {
                            if (window.confirm(`¿Eliminar tema "${tema}"?`)) {
                              const nuevosTemarios = {...temarios};
                              nuevosTemarios[cinturonSeleccionado].splice(index, 1);
                              setTemarios(nuevosTemarios);
                              localStorage.setItem('temarios-krav-maga', JSON.stringify(nuevosTemarios));
                            }
                          }}
                          sx={{ 
                            flex: { xs: 1, sm: 'none' },
                            fontSize: { xs: '1rem', sm: '0.875rem' }
                          }}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setGestionTemarioOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Nuevo Tema */}
      <Dialog open={nuevoTemaOpen} onClose={() => setNuevoTemaOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: 'secondary.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          ➕ Nuevo Tema - {cinturonSeleccionado}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Nombre del Tema"
            value={nuevoTema}
            onChange={(e) => setNuevoTema(e.target.value)}
            placeholder="Ej: Defensa contra agarres laterales"
            sx={{ mt: 2 }}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button onClick={() => setNuevoTemaOpen(false)} size="large" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            onClick={() => {
              if (nuevoTema.trim()) {
                const nuevosTemarios = {...temarios};
                if (!nuevosTemarios[cinturonSeleccionado]) {
                  nuevosTemarios[cinturonSeleccionado] = [];
                }
                nuevosTemarios[cinturonSeleccionado].push(nuevoTema.trim());
                setTemarios(nuevosTemarios);
                localStorage.setItem('temarios-krav-maga', JSON.stringify(nuevosTemarios));
                setNuevoTema('');
                setNuevoTemaOpen(false);
              }
            }}
          >
            ✅ Agregar Tema
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Renovaciones Anuales */}
      <Dialog 
        open={renovacionesOpen} 
        onClose={() => setRenovacionesOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 900
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'warning.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          📅 Renovaciones Anuales
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          
          {/* Filtros */}
          <Card sx={{ p: 2, mb: 3, borderRadius: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Filtrar por Estado</InputLabel>
              <Select
                value={filtroRenovacion}
                label="Filtrar por Estado"
                onChange={(e) => setFiltroRenovacion(e.target.value)}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="Completo">Completo</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Sin Pago">Sin Pago</MenuItem>
              </Select>
            </FormControl>
          </Card>
          
          {/* Lista de Renovaciones */}
          {(renovacionesAnuales as any)
            .filter((r: any) => {
              if (filtroRenovacion === 'Todos') return true;
              if (filtroRenovacion === 'Completo') return r.ficha && r.certificado && r.pago;
              if (filtroRenovacion === 'Pendiente') return !r.ficha || !r.certificado || !r.pago;
              if (filtroRenovacion === 'Sin Pago') return !r.pago;
              return true;
            })
            .map((renovacion: any) => (
              <Card key={renovacion.id} sx={{ 
                mb: 3,
                borderRadius: 3,
                border: '2px solid',
                borderColor: (renovacion.ficha && renovacion.certificado && renovacion.pago) ? 'success.main' : 'warning.main'
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    {renovacion.alumno}
                  </Typography>
                  
                  {/* Estado de Requisitos */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                          checked={renovacion.ficha}
                          onChange={(e) => {
                            const nuevasRenovaciones = (renovacionesAnuales as any[]).map((r: any) => 
                              r.id === renovacion.id ? { ...r, ficha: e.target.checked } : r
                            );
                            setRenovacionesAnuales(nuevasRenovaciones);
                            localStorage.setItem('renovaciones-anuales-krav-maga', JSON.stringify(nuevasRenovaciones));
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Ficha Completada
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                          checked={renovacion.certificado}
                          onChange={(e) => {
                            const nuevasRenovaciones = (renovacionesAnuales as any[]).map((r: any) => 
                              r.id === renovacion.id ? { 
                                ...r, 
                                certificado: e.target.checked, 
                                fechaCertificado: e.target.checked ? new Date().toISOString().split('T')[0] : null 
                              } : r
                            );
                            setRenovacionesAnuales(nuevasRenovaciones);
                            localStorage.setItem('renovaciones-anuales-krav-maga', JSON.stringify(nuevasRenovaciones));
                          }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Certificado Médico
                          </Typography>
                          {renovacion.certificado && renovacion.fechaCertificado && (
                            <Typography variant="caption" color="text.secondary">
                              {new Date(renovacion.fechaCertificado).toLocaleDateString('es-ES')}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                          checked={renovacion.pago}
                          onChange={(e) => {
                            const nuevasRenovaciones = (renovacionesAnuales as any[]).map((r: any) => 
                              r.id === renovacion.id ? { 
                                ...r, 
                                pago: e.target.checked, 
                                fechaPago: e.target.checked ? new Date().toISOString().split('T')[0] : null 
                              } : r
                            );
                            setRenovacionesAnuales(nuevasRenovaciones);
                            localStorage.setItem('renovaciones-anuales-krav-maga', JSON.stringify(nuevasRenovaciones));
                          }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Pago (${montos.renovacionAnual?.toLocaleString()})
                          </Typography>
                          {renovacion.pago && renovacion.fechaPago && (
                            <Typography variant="caption" color="text.secondary">
                              {new Date(renovacion.fechaPago).toLocaleDateString('es-ES')}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  {/* Notas */}
                  {renovacion.notas && (
                    <Typography variant="body2" sx={{ 
                      fontStyle: 'italic',
                      bgcolor: 'grey.100',
                      p: 1,
                      borderRadius: 1,
                      mt: 1
                    }}>
                      📝 {renovacion.notas}
                    </Typography>
                  )}
                  
                  {/* Estado General */}
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Chip
                      label={(renovacion.ficha && renovacion.certificado && renovacion.pago) ? t('complete') : t('pending')}
                      color={(renovacion.ficha && renovacion.certificado && renovacion.pago) ? 'success' : 'warning'}
                      sx={{ fontWeight: 700, fontSize: '0.9rem' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))
          }
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setRenovacionesOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Exámenes de Cinturón */}
      <Dialog 
        open={examenesOpen} 
        onClose={() => setExamenesOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 900
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'info.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          🥋 Exámenes de Cinturón
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'auto' }}>
          
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabExamen} 
              onChange={(e, newValue) => setTabExamen(newValue)}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontSize: { xs: '1rem', sm: '0.9rem' },
                  fontWeight: 600,
                  py: { xs: 2, sm: 1.5 }
                }
              }}
            >
              <Tab label="Historial" />
              <Tab label="Próximos Exámenes" />
            </Tabs>
          </Box>
          
          {/* Tab Historial */}
          {tabExamen === 0 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
          
          {/* Filtros */}
          <Card sx={{ p: 2, mb: 3, borderRadius: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Filtrar por Estado</InputLabel>
              <Select
                value={filtroExamen}
                label="Filtrar por Estado"
                onChange={(e) => setFiltroExamen(e.target.value)}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="Aprobado">Aprobados</MenuItem>
                <MenuItem value="Pendiente">Pendientes</MenuItem>
                <MenuItem value="Sin Pago">Sin Pago</MenuItem>
              </Select>
            </FormControl>
          </Card>
          
          {/* Lista de Exámenes */}
          {examenes
            .filter(e => {
              if (filtroExamen === 'Todos') return true;
              if (filtroExamen === 'Aprobado') return e.resultado === 'Aprobado';
              if (filtroExamen === 'Pendiente') return e.resultado === 'Pendiente';
              if (filtroExamen === 'Sin Pago') return !e.pago;
              return true;
            })
            .map((examen) => (
              <Card key={examen.id} sx={{ 
                mb: 3,
                borderRadius: 3,
                border: '2px solid',
                borderColor: 
                  examen.resultado === 'Aprobado' ? 'success.main' :
                  examen.resultado === 'No Aprobado' ? 'error.main' : 'warning.main'
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                      }}>
                        {examen.alumno}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {examen.cinturonActual} → {examen.cinturonObjetivo}
                      </Typography>
                    </Box>
                    
                    <Chip
                      label={examen.resultado}
                      color={
                        examen.resultado === 'Aprobado' ? 'success' :
                        examen.resultado === 'No Aprobado' ? 'error' : 'warning'
                      }
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  
                  {/* Estado de Requisitos */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                          checked={examen.formulario}
                          onChange={(e) => {
                            const nuevosExamenes = examenes.map(ex => 
                              ex.id === examen.id ? { ...ex, formulario: e.target.checked } : ex
                            );
                            setExamenes(nuevosExamenes);
                            localStorage.setItem('examenes-krav-maga', JSON.stringify(nuevosExamenes));
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Formulario Completado
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                          checked={examen.pago}
                          onChange={(e) => {
                            const nuevosExamenes = examenes.map(ex => 
                              ex.id === examen.id ? { ...ex, pago: e.target.checked, fechaPago: e.target.checked ? new Date().toISOString().split('T')[0] : null } : ex
                            );
                            setExamenes(nuevosExamenes);
                            localStorage.setItem('examenes-krav-maga', JSON.stringify(nuevosExamenes));
                          }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Pago (${(() => {
                              const montoKey = `examen${examen.cinturonObjetivo}` as keyof typeof montos;
                              return montos[montoKey]?.toLocaleString() || examen.montoPago?.toLocaleString();
                            })()})
                          </Typography>
                          {examen.pago && examen.fechaPago && (
                            <Typography variant="caption" color="text.secondary">
                              {new Date(examen.fechaPago).toLocaleDateString('es-ES')}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  {/* Fecha de Examen */}
                  {examen.fechaExamen && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      📅 Fecha de examen: {new Date(examen.fechaExamen).toLocaleDateString('es-ES')}
                    </Typography>
                  )}
                  
                  {/* Resultado */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button
                      variant={examen.resultado === 'Aprobado' ? 'contained' : 'outlined'}
                      color="success"
                      size="small"
                      onClick={() => {
                        const nuevosExamenes = examenes.map(ex => 
                          ex.id === examen.id ? { ...ex, resultado: 'Aprobado' } : ex
                        );
                        setExamenes(nuevosExamenes);
                        localStorage.setItem('examenes-krav-maga', JSON.stringify(nuevosExamenes));
                      }}
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant={examen.resultado === 'No Aprobado' ? 'contained' : 'outlined'}
                      color="error"
                      size="small"
                      onClick={() => {
                        const nuevosExamenes = examenes.map(ex => 
                          ex.id === examen.id ? { ...ex, resultado: 'No Aprobado' } : ex
                        );
                        setExamenes(nuevosExamenes);
                        localStorage.setItem('examenes-krav-maga', JSON.stringify(nuevosExamenes));
                      }}
                    >
                      No Aprobar
                    </Button>
                    <Button
                      variant={examen.resultado === 'Pendiente' ? 'contained' : 'outlined'}
                      color="warning"
                      size="small"
                      onClick={() => {
                        const nuevosExamenes = examenes.map(ex => 
                          ex.id === examen.id ? { ...ex, resultado: 'Pendiente' } : ex
                        );
                        setExamenes(nuevosExamenes);
                        localStorage.setItem('examenes-krav-maga', JSON.stringify(nuevosExamenes));
                      }}
                    >
                      Pendiente
                    </Button>
                  </Box>
                  
                  {/* Notas */}
                  {examen.notas && (
                    <Typography variant="body2" sx={{ 
                      fontStyle: 'italic',
                      bgcolor: 'grey.100',
                      p: 1,
                      borderRadius: 1
                    }}>
                      📝 {examen.notas}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))
          }
            </Box>
          )}
          
          {/* Tab Próximos Exámenes */}
          {tabExamen === 1 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              
              {/* Header con fecha */}
              <Card sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'info.light' }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700,
                  textAlign: 'center',
                  fontSize: { xs: '1.3rem', sm: '1.5rem' },
                  mb: 2
                }}>
                  📅 Próximo Examen
                </Typography>
                
                <Typography variant="h6" sx={{ 
                  textAlign: 'center',
                  fontWeight: 600,
                  color: 'info.dark'
                }}>
                  15 de Febrero 2024
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button
                    variant="outlined"
                    onClick={() => setNuevoProximoExamenOpen(true)}
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '0.9rem' },
                      fontWeight: 600
                    }}
                  >
                    Agregar Candidato
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const nuevaFecha = prompt('Nueva fecha (DD/MM/YYYY):', '15/02/2024');
                      if (nuevaFecha) {
                        alert(`Fecha cambiada a: ${nuevaFecha}`);
                      }
                    }}
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '0.9rem' },
                      fontWeight: 600
                    }}
                  >
                    Cambiar Fecha
                  </Button>
                </Box>
              </Card>
              
              {/* Lista de Candidatos */}
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.2rem', sm: '1.25rem' }
              }}>
                Candidatos Seleccionados ({proximosExamenes.length})
              </Typography>
              
              {proximosExamenes.map((candidato) => (
                <Card key={candidato.id} sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: candidato.listo ? 'success.main' : 'warning.main'
                }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700,
                          fontSize: { xs: '1.1rem', sm: '1.25rem' }
                        }}>
                          {candidato.alumno}
                        </Typography>
                        
                        <Typography variant="body1" sx={{ 
                          color: 'text.secondary',
                          fontWeight: 600,
                          fontSize: { xs: '1rem', sm: '0.9rem' }
                        }}>
                          {candidato.cinturonActual} → {candidato.cinturonObjetivo}
                        </Typography>
                      </Box>
                      
                      <Chip
                        label={candidato.listo ? 'LISTO' : 'PENDIENTE'}
                        color={candidato.listo ? 'success' : 'warning'}
                        sx={{ 
                          fontWeight: 700,
                          fontSize: { xs: '0.9rem', sm: '0.8rem' }
                        }}
                      />
                    </Box>
                    
                    {/* Estado de Requisitos */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Checkbox
                            checked={candidato.formulario}
                            onChange={(e) => {
                              const nuevosProximos = proximosExamenes.map(p => {
                                if (p.id === candidato.id) {
                                  const actualizado = { ...p, formulario: e.target.checked };
                                  actualizado.listo = actualizado.formulario && actualizado.pago;
                                  return actualizado;
                                }
                                return p;
                              });
                              setProximosExamenes(nuevosProximos);
                              localStorage.setItem('proximos-examenes-krav-maga', JSON.stringify(nuevosProximos));
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Formulario Completado
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Checkbox
                            checked={candidato.pago}
                            onChange={(e) => {
                              const nuevosProximos = proximosExamenes.map(p => {
                                if (p.id === candidato.id) {
                                  const actualizado = { ...p, pago: e.target.checked };
                                  actualizado.listo = actualizado.formulario && actualizado.pago;
                                  return actualizado;
                                }
                                return p;
                              });
                              setProximosExamenes(nuevosProximos);
                              localStorage.setItem('proximos-examenes-krav-maga', JSON.stringify(nuevosProximos));
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Pago Realizado
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    {/* Alertas */}
                    {!candidato.formulario && (
                      <Typography variant="body2" sx={{ 
                        bgcolor: 'error.light',
                        color: 'error.dark',
                        p: 1,
                        borderRadius: 1,
                        mb: 1,
                        fontWeight: 600
                      }}>
                        ⚠️ Falta completar formulario
                      </Typography>
                    )}
                    
                    {!candidato.pago && (
                      <Typography variant="body2" sx={{ 
                        bgcolor: 'warning.light',
                        color: 'warning.dark',
                        p: 1,
                        borderRadius: 1,
                        mb: 1,
                        fontWeight: 600
                      }}>
                        💰 Falta realizar pago
                      </Typography>
                    )}
                    
                    {/* Botón eliminar */}
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar a ${candidato.alumno} de los candidatos?`)) {
                            const nuevosProximos = proximosExamenes.filter(p => p.id !== candidato.id);
                            setProximosExamenes(nuevosProximos);
                            localStorage.setItem('proximos-examenes-krav-maga', JSON.stringify(nuevosProximos));
                          }
                        }}
                        sx={{ 
                          fontSize: { xs: '1rem', sm: '0.9rem' },
                          fontWeight: 600
                        }}
                      >
                        Quitar Candidato
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              {/* Sin candidatos */}
              {proximosExamenes.length === 0 && (
                <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    📅 No hay candidatos seleccionados
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Usa "Agregar Candidato" para seleccionar alumnos
                  </Typography>
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setExamenesOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Configurar Montos */}
      <Dialog 
        open={configMontosOpen} 
        onClose={() => setConfigMontosOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 600
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'success.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          ⚙️ Configurar Montos
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 3, sm: 3 }, overflow: 'auto' }}>
          
          {/* Renovación Anual */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: { xs: 3, sm: 3 } }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                mb: 2,
                color: 'warning.main',
                fontSize: { xs: '1.2rem', sm: '1.25rem' }
              }}>
                📅 Renovación Anual
              </Typography>
              
              <TextField
                fullWidth
                label="Monto Renovación Anual"
                type="number"
                value={montos.renovacionAnual}
                onChange={(e) => {
                  const valor = parseInt(e.target.value) || 0;
                  if (valor >= 0) {
                    const nuevosMontos = { ...montos, renovacionAnual: valor };
                    setMontos(nuevosMontos);
                    localStorage.setItem('montos-krav-maga', JSON.stringify(nuevosMontos));
                  }
                }}
                InputProps={{
                  startAdornment: '$',
                  sx: {
                    fontSize: { xs: '1.2rem', sm: '1rem' },
                    '& input': {
                      py: { xs: 2, sm: 1.5 },
                      fontSize: { xs: '1.2rem', sm: '1rem' }
                    }
                  }
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '1.1rem', sm: '1rem' }
                  }
                }}
              />
            </CardContent>
          </Card>
          
          {/* Exámenes de Cinturón */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: { xs: 3, sm: 3 } }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                mb: 3,
                color: 'info.main',
                fontSize: { xs: '1.2rem', sm: '1.25rem' }
              }}>
                🥋 Exámenes de Cinturón
              </Typography>
              
              <Grid container spacing={3}>
                {[
                  { key: 'examenBlanco', label: 'Blanco', color: '#ffffff', textColor: '#000000' },
                  { key: 'examenAmarillo', label: 'Amarillo', color: '#ffeb3b', textColor: '#000000' },
                  { key: 'examenNaranja', label: 'Naranja', color: '#ff9800', textColor: '#ffffff' },
                  { key: 'examenVerde', label: 'Verde', color: '#4caf50', textColor: '#ffffff' },
                  { key: 'examenAzul', label: 'Azul', color: '#2196f3', textColor: '#ffffff' },
                  { key: 'examenMarron', label: 'Marrón', color: '#795548', textColor: '#ffffff' },
                  { key: 'examenNegro', label: 'Negro', color: '#000000', textColor: '#ffffff' }
                ].map((cinturon) => (
                  <Grid item xs={12} sm={6} key={cinturon.key}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        mb: 1 
                      }}>
                        <Box sx={{
                          width: 20,
                          height: 20,
                          bgcolor: cinturon.color,
                          border: cinturon.label === 'Blanco' ? '1px solid #ccc' : 'none',
                          borderRadius: 1
                        }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {cinturon.label}
                        </Typography>
                      </Box>
                      
                      <TextField
                        fullWidth
                        label={`Examen ${cinturon.label}`}
                        type="number"
                        value={montos[cinturon.key as keyof typeof montos]}
                        onChange={(e) => {
                          const valor = parseInt(e.target.value) || 0;
                          if (valor >= 0) {
                            const nuevosMontos = { ...montos, [cinturon.key]: valor };
                            setMontos(nuevosMontos);
                            localStorage.setItem('montos-krav-maga', JSON.stringify(nuevosMontos));
                          }
                        }}
                        InputProps={{
                          startAdornment: '$',
                          sx: {
                            fontSize: { xs: '1.1rem', sm: '0.9rem' },
                            '& input': {
                              py: { xs: 1.5, sm: 1 },
                              fontSize: { xs: '1.1rem', sm: '0.9rem' }
                            }
                          }
                        }}
                        sx={{
                          '& .MuiInputLabel-root': {
                            fontSize: { xs: '1rem', sm: '0.9rem' }
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
          
          {/* Información */}
          <Card sx={{ bgcolor: 'info.light', borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="body2" sx={{ 
                textAlign: 'center',
                fontStyle: 'italic',
                fontSize: { xs: '0.9rem', sm: '0.875rem' }
              }}>
                💾 Los cambios se guardan automáticamente
              </Typography>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setConfigMontosOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Mensualidades */}
      <Dialog 
        open={mensualidadesOpen} 
        onClose={() => setMensualidadesOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 900
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          💰 Mensualidades {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          
          {/* Botón Configurar */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => setConfigMensualidadOpen(true)}
              size="large"
              sx={{ 
                px: { xs: 4, sm: 3 },
                py: { xs: 1.5, sm: 1 },
                fontSize: { xs: '1rem', sm: '0.9rem' },
                fontWeight: 600,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              ⚙️ Configurar Mensualidades
            </Button>
          </Box>
          
          {/* Lista de Mensualidades */}
          {mensualidades.map((mensualidad) => {
            // Calcular estado automático
            const esInterrumpido = mensualidad.faltasConsecutivas > configMensualidad.toleranciaFaltas;
            const montoActual = esInterrumpido ? configMensualidad.montoInterrumpido : configMensualidad.montoContinuo;
            const estadoFinal = esInterrumpido ? 'Interrumpido' : 'Continuo';
            
            return (
              <Card key={mensualidad.id} sx={{ 
                mb: 3,
                borderRadius: 3,
                border: '2px solid',
                borderColor: mensualidad.pagado ? 'success.main' : 'error.main'
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                      }}>
                        {mensualidad.alumno}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={estadoFinal}
                          color={estadoFinal === 'Continuo' ? 'success' : 'warning'}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                        <Chip
                          label={mensualidad.pagado ? t('paid') : t('pending')}
                          color={mensualidad.pagado ? 'success' : 'error'}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700,
                      color: mensualidad.pagado ? 'success.main' : 'error.main',
                      fontSize: { xs: '1.3rem', sm: '1.5rem' }
                    }}>
                      ${montoActual.toLocaleString()}
                    </Typography>
                  </Box>
                  
                  {/* Información adicional */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Último pago: {mensualidad.ultimoPago ? new Date(mensualidad.ultimoPago).toLocaleDateString('es-ES') : 'Nunca'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Faltas consecutivas: {mensualidad.faltasConsecutivas}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  {/* Razón del estado */}
                  {esInterrumpido && (
                    <Typography variant="body2" sx={{ 
                      bgcolor: 'warning.light',
                      p: 1,
                      borderRadius: 1,
                      mb: 2,
                      fontSize: { xs: '0.9rem', sm: '0.875rem' }
                    }}>
                      ⚠️ Monto aumentado por {mensualidad.faltasConsecutivas} faltas consecutivas (límite: {configMensualidad.toleranciaFaltas})
                    </Typography>
                  )}
                  
                  {/* Botones de acción */}
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button
                      variant={mensualidad.pagado ? 'outlined' : 'contained'}
                      color={mensualidad.pagado ? 'success' : 'primary'}
                      onClick={() => {
                        const nuevasMensualidades = mensualidades.map(m => 
                          m.id === mensualidad.id ? { 
                            ...m, 
                            pagado: !m.pagado,
                            fechaPago: !m.pagado ? new Date().toISOString().split('T')[0] : null,
                            ultimoPago: !m.pagado ? new Date().toISOString().split('T')[0] : m.ultimoPago,
                            faltasConsecutivas: !m.pagado ? 0 : m.faltasConsecutivas
                          } : m
                        );
                        setMensualidades(nuevasMensualidades);
                        localStorage.setItem('mensualidades-krav-maga', JSON.stringify(nuevasMensualidades));
                      }}
                      sx={{ flex: 1 }}
                    >
                      {mensualidad.pagado ? 'Marcar Impago' : t('markPaid')}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => {
                        const nuevasMensualidades = mensualidades.map(m => 
                          m.id === mensualidad.id ? { 
                            ...m, 
                            faltasConsecutivas: m.faltasConsecutivas + 1
                          } : m
                        );
                        setMensualidades(nuevasMensualidades);
                        localStorage.setItem('mensualidades-krav-maga', JSON.stringify(nuevasMensualidades));
                      }}
                      sx={{ flex: 1 }}
                    >
                      +1 Falta
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => {
                        const nuevasMensualidades = mensualidades.map(m => 
                          m.id === mensualidad.id ? { 
                            ...m, 
                            faltasConsecutivas: 0
                          } : m
                        );
                        setMensualidades(nuevasMensualidades);
                        localStorage.setItem('mensualidades-krav-maga', JSON.stringify(nuevasMensualidades));
                      }}
                      sx={{ flex: 1 }}
                    >
                      Reset Faltas
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setMensualidadesOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Configurar Mensualidad */}
      <Dialog 
        open={configMensualidadOpen} 
        onClose={() => setConfigMensualidadOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 600
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          ⚙️ Configurar Mensualidades
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 3, sm: 3 }, overflow: 'auto' }}>
          
          {/* Montos */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: { xs: 3, sm: 3 } }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                mb: 3,
                color: 'primary.main',
                fontSize: { xs: '1.2rem', sm: '1.25rem' }
              }}>
                💰 Montos Mensuales
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Monto Continuo"
                    type="number"
                    value={configMensualidad.montoContinuo}
                    onChange={(e) => {
                      const valor = parseInt(e.target.value) || 0;
                      if (valor >= 0) {
                        const nuevaConfig = { ...configMensualidad, montoContinuo: valor };
                        setConfigMensualidad(nuevaConfig);
                        localStorage.setItem('config-mensualidad-krav-maga', JSON.stringify(nuevaConfig));
                      }
                    }}
                    InputProps={{
                      startAdornment: '$',
                      sx: {
                        fontSize: { xs: '1.1rem', sm: '1rem' },
                        '& input': {
                          py: { xs: 2, sm: 1.5 },
                          fontSize: { xs: '1.1rem', sm: '1rem' }
                        }
                      }
                    }}
                    helperText="Alumnos sin interrupciones"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Monto Interrumpido"
                    type="number"
                    value={configMensualidad.montoInterrumpido}
                    onChange={(e) => {
                      const valor = parseInt(e.target.value) || 0;
                      if (valor >= 0) {
                        const nuevaConfig = { ...configMensualidad, montoInterrumpido: valor };
                        setConfigMensualidad(nuevaConfig);
                        localStorage.setItem('config-mensualidad-krav-maga', JSON.stringify(nuevaConfig));
                      }
                    }}
                    InputProps={{
                      startAdornment: '$',
                      sx: {
                        fontSize: { xs: '1.1rem', sm: '1rem' },
                        '& input': {
                          py: { xs: 2, sm: 1.5 },
                          fontSize: { xs: '1.1rem', sm: '1rem' }
                        }
                      }
                    }}
                    helperText="Alumnos con faltas de pago"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Reglas */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: { xs: 3, sm: 3 } }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                mb: 3,
                color: 'warning.main',
                fontSize: { xs: '1.2rem', sm: '1.25rem' }
              }}>
                ⚙️ Reglas Automáticas
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Meses para ser Continuo"
                    type="number"
                    value={configMensualidad.mesesParaContinuo}
                    onChange={(e) => {
                      const valor = parseInt(e.target.value) || 1;
                      if (valor >= 1) {
                        const nuevaConfig = { ...configMensualidad, mesesParaContinuo: valor };
                        setConfigMensualidad(nuevaConfig);
                        localStorage.setItem('config-mensualidad-krav-maga', JSON.stringify(nuevaConfig));
                      }
                    }}
                    InputProps={{
                      sx: {
                        fontSize: { xs: '1.1rem', sm: '1rem' },
                        '& input': {
                          py: { xs: 2, sm: 1.5 },
                          fontSize: { xs: '1.1rem', sm: '1rem' }
                        }
                      }
                    }}
                    helperText="Pagos consecutivos necesarios"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tolerancia de Faltas"
                    type="number"
                    value={configMensualidad.toleranciaFaltas}
                    onChange={(e) => {
                      const valor = parseInt(e.target.value) || 0;
                      if (valor >= 0) {
                        const nuevaConfig = { ...configMensualidad, toleranciaFaltas: valor };
                        setConfigMensualidad(nuevaConfig);
                        localStorage.setItem('config-mensualidad-krav-maga', JSON.stringify(nuevaConfig));
                      }
                    }}
                    InputProps={{
                      sx: {
                        fontSize: { xs: '1.1rem', sm: '1rem' },
                        '& input': {
                          py: { xs: 2, sm: 1.5 },
                          fontSize: { xs: '1.1rem', sm: '1rem' }
                        }
                      }
                    }}
                    helperText="Faltas antes de ser interrumpido"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Información */}
          <Card sx={{ bgcolor: 'info.light', borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="body2" sx={{ 
                textAlign: 'center',
                fontStyle: 'italic',
                fontSize: { xs: '0.9rem', sm: '0.875rem' }
              }}>
                💾 Los cambios se aplican automáticamente a todos los alumnos
              </Typography>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setConfigMensualidadOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Morosos */}
      <Dialog 
        open={morososOpen} 
        onClose={() => setMorososOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 900
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'error.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          🚨 Alumnos Morosos ({mensualidades.filter(m => !m.pagado).length})
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          
          {/* Búsqueda */}
          <Card sx={{ p: 2, mb: 3, borderRadius: 3 }}>
            <TextField
              fullWidth
              label="Buscar alumno moroso"
              value={busquedaMoroso}
              onChange={(e) => setBusquedaMoroso(e.target.value)}
              placeholder="Nombre del alumno..."
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  py: { xs: 2, sm: 1.5 }
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '1.1rem', sm: '1rem' }
                }
              }}
            />
          </Card>
          
          {/* Lista de Morosos */}
          {mensualidades
            .filter(m => !m.pagado)
            .filter(m => m.alumno.toLowerCase().includes(busquedaMoroso.toLowerCase()))
            .sort((a, b) => {
              // Ordenar por días de atraso (más atrasados primero)
              const diasAtrasoA = Math.floor((new Date().getTime() - new Date(a.ultimoPago || '2023-01-01').getTime()) / (1000 * 60 * 60 * 24));
              const diasAtrasoB = Math.floor((new Date().getTime() - new Date(b.ultimoPago || '2023-01-01').getTime()) / (1000 * 60 * 60 * 24));
              return diasAtrasoB - diasAtrasoA;
            })
            .map((moroso) => {
              const diasAtraso = Math.floor((new Date().getTime() - new Date(moroso.ultimoPago || '2023-01-01').getTime()) / (1000 * 60 * 60 * 24));
              const esInterrumpido = moroso.faltasConsecutivas > configMensualidad.toleranciaFaltas;
              const montoActual = esInterrumpido ? configMensualidad.montoInterrumpido : configMensualidad.montoContinuo;
              
              return (
                <Card key={moroso.id} sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  border: '3px solid',
                  borderColor: diasAtraso > 60 ? 'error.main' : diasAtraso > 30 ? 'warning.main' : 'info.main',
                  bgcolor: diasAtraso > 60 ? 'error.light' : diasAtraso > 30 ? 'warning.light' : 'info.light'
                }}>
                  <CardContent sx={{ p: { xs: 3, sm: 3 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 700,
                          fontSize: { xs: '1.3rem', sm: '1.5rem' },
                          color: 'black'
                        }}>
                          {moroso.alumno}
                        </Typography>
                        
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          color: 'black',
                          fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          mt: 0.5
                        }}>
                          Mora: {diasAtraso} días
                        </Typography>
                      </Box>
                      
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700,
                        color: 'black',
                        fontSize: { xs: '1.5rem', sm: '2rem' }
                      }}>
                        ${montoActual.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    {/* Información adicional */}
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Último pago: {moroso.ultimoPago ? new Date(moroso.ultimoPago).toLocaleDateString('es-ES') : 'Nunca'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Estado: {esInterrumpido ? 'Interrumpido' : 'Continuo'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    {/* Acciones rápidas */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Button
                          variant="contained"
                          color="success"
                          fullWidth
                          size="large"
                          onClick={() => {
                            const nuevasMensualidades = mensualidades.map(m => 
                              m.id === moroso.id ? { 
                                ...m, 
                                pagado: true,
                                fechaPago: new Date().toISOString().split('T')[0],
                                ultimoPago: new Date().toISOString().split('T')[0],
                                faltasConsecutivas: 0
                              } : m
                            );
                            setMensualidades(nuevasMensualidades);
                            localStorage.setItem('mensualidades-krav-maga', JSON.stringify(nuevasMensualidades));
                          }}
                          sx={{
                            py: { xs: 2, sm: 1.5 },
                            fontSize: { xs: '1rem', sm: '0.9rem' },
                            fontWeight: 600
                          }}
                        >
                          ✅ Marcar Pagado
                        </Button>
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          size="large"
                          onClick={() => {
                            // Simular llamada
                            window.open(`tel:+541234567890`, '_self');
                          }}
                          sx={{
                            py: { xs: 2, sm: 1.5 },
                            fontSize: { xs: '1rem', sm: '0.9rem' },
                            fontWeight: 600
                          }}
                        >
                          📞 Llamar
                        </Button>
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <Button
                          variant="contained"
                          color="secondary"
                          fullWidth
                          size="large"
                          onClick={() => {
                            // Simular WhatsApp
                            const mensaje = `Hola ${moroso.alumno}, tienes una mensualidad pendiente de $${montoActual.toLocaleString()}. ¿Podrías ponerte al día?`;
                            window.open(`https://wa.me/541234567890?text=${encodeURIComponent(mensaje)}`, '_blank');
                          }}
                          sx={{
                            py: { xs: 2, sm: 1.5 },
                            fontSize: { xs: '1rem', sm: '0.9rem' },
                            fontWeight: 600
                          }}
                        >
                          📱 WhatsApp
                        </Button>
                      </Grid>
                    </Grid>
                    
                    {/* Nivel de urgencia */}
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Chip
                        label={
                          diasAtraso > 60 ? 'CRÍTICO' :
                          diasAtraso > 30 ? 'URGENTE' : 'PENDIENTE'
                        }
                        color={
                          diasAtraso > 60 ? 'error' :
                          diasAtraso > 30 ? 'warning' : 'info'
                        }
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: { xs: '1rem', sm: '0.9rem' },
                          px: 2
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              );
            })
          }
          
          {/* Sin resultados */}
          {mensualidades.filter(m => !m.pagado).filter(m => m.alumno.toLowerCase().includes(busquedaMoroso.toLowerCase())).length === 0 && (
            <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'success.light' }}>
              <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 600 }}>
                {busquedaMoroso ? '🔍 No se encontraron morosos con ese nombre' : '🎉 ¡No hay alumnos morosos!'}
              </Typography>
            </Card>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => {
              setMorososOpen(false);
              setBusquedaMoroso('');
            }} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal de Ayuda */}
      <Dialog 
        open={ayudaOpen} 
        onClose={() => setAyudaOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 800
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'info.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          ❓ Guía Rápida - Sistema Krav Maga
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          
          {/* Guía General */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                mb: 2,
                color: 'primary.main',
                fontSize: { xs: '1.3rem', sm: '1.5rem' }
              }}>
                🏠 Panel Principal
              </Typography>
              
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon><Person color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="1️⃣ Tomar Asistencia" 
                    secondary={t('helpTakeAttendance')}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon><MenuBook color="warning" /></ListItemIcon>
                  <ListItemText 
                    primary="2️⃣ Última Clase" 
                    secondary={t('helpLastClass')}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon><School color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="3️⃣ Opciones para Hoy" 
                    secondary={t('helpTodayOptions')}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          {/* Módulos Principales */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                mb: 2,
                color: 'secondary.main',
                fontSize: { xs: '1.3rem', sm: '1.5rem' }
              }}>
                📊 Módulos Principales
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        💰 Mensualidades
                      </Typography>
                      <Typography variant="body2">
                        • Ver estado de pagos<br/>
                        • Marcar como pagado<br/>
                        • Contactar morosos<br/>
                        • Configurar montos
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card sx={{ bgcolor: 'warning.light', color: 'black' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        📅 Renovaciones
                      </Typography>
                      <Typography variant="body2">
                        • Ficha completada<br/>
                        • Certificado médico<br/>
                        • Pago realizado<br/>
                        • Estados automáticos
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        🛍️ Tienda
                      </Typography>
                      <Typography variant="body2">
                        • Crear pedidos<br/>
                        • Control de stock<br/>
                        • Estados: Pedido → Recibido → Entregado<br/>
                        • Alertas de stock bajo
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card sx={{ bgcolor: 'info.light', color: 'black' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        🥋 Exámenes
                      </Typography>
                      <Typography variant="body2">
                        • Historial completo<br/>
                        • Próximos exámenes<br/>
                        • Requisitos: Formulario + Pago<br/>
                        • Resultados: Aprobado/No aprobado
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Consejos Rápidos */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3, bgcolor: 'success.light' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                mb: 2,
                color: 'success.dark',
                fontSize: { xs: '1.3rem', sm: '1.5rem' }
              }}>
                💡 Consejos Rápidos
              </Typography>
              
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="📱 Optimizado para Móvil" 
                    secondary={t('helpMobileOptimized')}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="💾 Guardado Automático" 
                    secondary={t('helpAutoSave')}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="🔄 Sincronización" 
                    secondary={t('helpSync')}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="🔍 Filtros" 
                    secondary="Usa los filtros para encontrar información específica rápidamente"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          {/* Flujo Diario */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                mb: 2,
                color: 'primary.main',
                fontSize: { xs: '1.3rem', sm: '1.5rem' }
              }}>
                📅 Rutina Diaria (5 minutos)
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Card sx={{ bgcolor: 'grey.100' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      🕰️ Antes de la Clase (2 min)
                    </Typography>
                    <Typography variant="body2">
                      1. Seleccionar turno actual<br/>
                      2. Ver última clase (tema anterior)<br/>
                      3. Decidir: ¿Repaso o tema nuevo?
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'grey.100' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      🏃 Durante la Clase (1 min)
                    </Typography>
                    <Typography variant="body2">
                      1. Botón "Marcar Presentes"<br/>
                      2. Toggle rápido presente/ausente<br/>
                      3. Se guarda automáticamente
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'grey.100' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      ✅ Después de la Clase (2 min)
                    </Typography>
                    <Typography variant="body2">
                      1. Registrar clase (tema y tipo)<br/>
                      2. Agregar notas si es necesario<br/>
                      3. Revisar alertas de morosos
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </CardContent>
          </Card>
          
          {/* Contacto */}
          <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: 'info.light' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                📞 ¿Necesitas más ayuda?
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Consulta el Manual Completo (PDF) o contacta soporte técnico
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Sistema: https://krav-maga-sys.netlify.app
              </Typography>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setAyudaOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar Ayuda
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Control de Asistencias */}
      <Dialog 
        open={controlAsistenciasOpen} 
        onClose={() => setControlAsistenciasOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 900
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'info.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          📊 Control de Asistencias
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          
          {/* Filtros */}
          <Card sx={{ p: 2, mb: 3, borderRadius: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Filtrar Alumnos</InputLabel>
              <Select
                value={filtroAsistencia}
                label="Filtrar Alumnos"
                onChange={(e) => setFiltroAsistencia(e.target.value)}
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  '& .MuiSelect-select': {
                    py: { xs: 1.5, sm: 1 }
                  }
                }}
              >
                <MenuItem value="Todos">Todos los Alumnos</MenuItem>
                <MenuItem value="Problematicos">Con Inasistencias Frecuentes</MenuItem>
                <MenuItem value="Buenos">Buena Asistencia</MenuItem>
                <MenuItem value="Criticos">Críticos (+5 faltas)</MenuItem>
              </Select>
            </FormControl>
          </Card>
          
          {/* Lista de Alumnos con Estadísticas */}
          {(() => {
            // Calcular estadísticas por alumno
            const estadisticasAlumnos = alumnos.map(alumno => {
              const asistenciasAlumno = todasAsistencias.filter(a => a.alumno_id === alumno.id);
              const totalClases = asistenciasAlumno.length;
              const clasesPresente = asistenciasAlumno.filter(a => a.presente).length;
              const clasesFaltadas = totalClases - clasesPresente;
              const porcentajeAsistencia = totalClases > 0 ? Math.round((clasesPresente / totalClases) * 100) : 100;
              
              // Calcular faltas consecutivas recientes
              const asistenciasRecientes = asistenciasAlumno
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .slice(0, 5);
              
              let faltasConsecutivas = 0;
              for (const asistencia of asistenciasRecientes) {
                if (!asistencia.presente) {
                  faltasConsecutivas++;
                } else {
                  break;
                }
              }
              
              const ultimaAsistencia = asistenciasRecientes.find(a => a.presente);
              const fechaUltimaAsistencia = ultimaAsistencia ? ultimaAsistencia.fecha : 'Nunca';
              
              return {
                ...alumno,
                totalClases,
                clasesPresente,
                clasesFaltadas,
                porcentajeAsistencia,
                faltasConsecutivas,
                fechaUltimaAsistencia,
                estado: faltasConsecutivas >= 5 ? 'Critico' : 
                       faltasConsecutivas >= 3 ? 'Problematico' : 
                       porcentajeAsistencia >= 80 ? 'Bueno' : 'Regular'
              };
            });
            
            // Filtrar según selección
            const alumnosFiltrados = estadisticasAlumnos.filter(alumno => {
              if (filtroAsistencia === 'Todos') return true;
              if (filtroAsistencia === 'Problematicos') return alumno.estado === 'Problematico';
              if (filtroAsistencia === 'Buenos') return alumno.estado === 'Bueno';
              if (filtroAsistencia === 'Criticos') return alumno.estado === 'Critico';
              return true;
            });
            
            return alumnosFiltrados
              .sort((a, b) => b.faltasConsecutivas - a.faltasConsecutivas)
              .map((alumno) => (
                <Card key={alumno.id} sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: 
                    alumno.estado === 'Critico' ? 'error.main' :
                    alumno.estado === 'Problematico' ? 'warning.main' :
                    alumno.estado === 'Bueno' ? 'success.main' : 'info.main'
                }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700,
                          fontSize: { xs: '1.1rem', sm: '1.25rem' }
                        }}>
                          {alumno.apellido}, {alumno.nombre}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={alumno.cinturon}
                            size="small"
                            sx={{
                              bgcolor: 
                                alumno.cinturon === 'Blanco' ? '#ffffff' :
                                alumno.cinturon === 'Amarillo' ? '#ffeb3b' :
                                alumno.cinturon === 'Naranja' ? '#ff9800' :
                                alumno.cinturon === 'Verde' ? '#4caf50' :
                                alumno.cinturon === 'Azul' ? '#2196f3' :
                                alumno.cinturon === 'Marrón' ? '#795548' : '#000000',
                              color: 
                                alumno.cinturon === 'Blanco' ? '#000000' :
                                alumno.cinturon === 'Amarillo' ? '#000000' : '#ffffff',
                              border: alumno.cinturon === 'Blanco' ? '1px solid #ccc' : 'none',
                              fontWeight: 600
                            }}
                          />
                          <Chip
                            label={alumno.estado.toUpperCase()}
                            color={
                              alumno.estado === 'Critico' ? 'error' :
                              alumno.estado === 'Problematico' ? 'warning' :
                              alumno.estado === 'Bueno' ? 'success' : 'info'
                            }
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Box>
                      
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700,
                        color: 
                          alumno.porcentajeAsistencia >= 80 ? 'success.main' :
                          alumno.porcentajeAsistencia >= 60 ? 'warning.main' : 'error.main',
                        fontSize: { xs: '1.5rem', sm: '2rem' }
                      }}>
                        {alumno.porcentajeAsistencia}%
                      </Typography>
                    </Box>
                    
                    {/* Estadísticas detalladas */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Total Clases
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {alumno.totalClases}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Presentes
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                          {alumno.clasesPresente}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Faltas
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
                          {alumno.clasesFaltadas}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Faltas Seguidas
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: alumno.faltasConsecutivas >= 3 ? 'error.main' : 'text.primary'
                        }}>
                          {alumno.faltasConsecutivas}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    {/* Última asistencia */}
                    <Typography variant="body2" sx={{ 
                      bgcolor: 'grey.100',
                      p: 1,
                      borderRadius: 1,
                      mb: 2,
                      fontSize: { xs: '0.9rem', sm: '0.875rem' }
                    }}>
                      📅 Última asistencia: {alumno.fechaUltimaAsistencia !== 'Nunca' ? 
                        new Date(alumno.fechaUltimaAsistencia).toLocaleDateString('es-ES') : 'Nunca'}
                    </Typography>
                    
                    {/* Alertas */}
                    {alumno.faltasConsecutivas >= 5 && (
                      <Typography variant="body2" sx={{ 
                        bgcolor: 'error.light',
                        color: 'error.dark',
                        p: 1,
                        borderRadius: 1,
                        mb: 2,
                        fontWeight: 600
                      }}>
                        ⚠️ ALERTA: {alumno.faltasConsecutivas} faltas consecutivas - Riesgo de abandono
                      </Typography>
                    )}
                    
                    {alumno.faltasConsecutivas >= 3 && alumno.faltasConsecutivas < 5 && (
                      <Typography variant="body2" sx={{ 
                        bgcolor: 'warning.light',
                        color: 'warning.dark',
                        p: 1,
                        borderRadius: 1,
                        mb: 2,
                        fontWeight: 600
                      }}>
                        🟡 ATENCIÓN: {alumno.faltasConsecutivas} faltas consecutivas - Contactar alumno
                      </Typography>
                    )}
                    
                    {/* Acciones */}
                    {(alumno.faltasConsecutivas >= 3 || alumno.porcentajeAsistencia < 70) && (
                      <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            window.open(`tel:${alumno.telefono || '+541234567890'}`, '_self');
                          }}
                          sx={{ flex: 1 }}
                        >
                          📞 Llamar
                        </Button>
                        
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            const mensaje = `Hola ${alumno.nombre}, hemos notado que has faltado a varias clases. ¿Todo bien? ¿Podemos ayudarte en algo?`;
                            window.open(`https://wa.me/541234567890?text=${encodeURIComponent(mensaje)}`, '_blank');
                          }}
                          sx={{ flex: 1 }}
                        >
                          📱 WhatsApp
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))
          })()}
          
          {/* Sin resultados */}
          {(() => {
            const estadisticasAlumnos = alumnos.map(alumno => {
              const asistenciasAlumno = todasAsistencias.filter(a => a.alumno_id === alumno.id);
              const totalClases = asistenciasAlumno.length;
              const clasesPresente = asistenciasAlumno.filter(a => a.presente).length;
              const porcentajeAsistencia = totalClases > 0 ? Math.round((clasesPresente / totalClases) * 100) : 100;
              
              let faltasConsecutivas = 0;
              const asistenciasRecientes = asistenciasAlumno
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .slice(0, 5);
              
              for (const asistencia of asistenciasRecientes) {
                if (!asistencia.presente) {
                  faltasConsecutivas++;
                } else {
                  break;
                }
              }
              
              return {
                ...alumno,
                faltasConsecutivas,
                porcentajeAsistencia,
                estado: faltasConsecutivas >= 5 ? 'Critico' : 
                       faltasConsecutivas >= 3 ? 'Problematico' : 
                       porcentajeAsistencia >= 80 ? 'Bueno' : 'Regular'
              };
            });
            
            const alumnosFiltrados = estadisticasAlumnos.filter(alumno => {
              if (filtroAsistencia === 'Todos') return true;
              if (filtroAsistencia === 'Problematicos') return alumno.estado === 'Problematico';
              if (filtroAsistencia === 'Buenos') return alumno.estado === 'Bueno';
              if (filtroAsistencia === 'Criticos') return alumno.estado === 'Critico';
              return true;
            });
            
            if (alumnosFiltrados.length === 0) {
              return (
                <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'success.light' }}>
                  <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 600 }}>
                    {filtroAsistencia === 'Criticos' ? '🎉 ¡No hay alumnos críticos!' :
                     filtroAsistencia === 'Problematicos' ? '🎉 ¡No hay alumnos problemáticos!' :
                     '📊 No hay datos de asistencia'}
                  </Typography>
                </Card>
              );
            }
            return null;
          })()}
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setControlAsistenciasOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Agregar Candidato */}
      <Dialog open={nuevoProximoExamenOpen} onClose={() => setNuevoProximoExamenOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: 'info.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          🥋 Agregar Candidato
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Seleccionar Alumno</InputLabel>
                <Select
                  value={candidatoSeleccionado}
                  label="Seleccionar Alumno"
                  onChange={(e) => setCandidatoSeleccionado(e.target.value)}
                >
                  {alumnos.map((alumno) => (
                    <MenuItem key={alumno.id} value={`${alumno.id}|${alumno.apellido}, ${alumno.nombre}|${alumno.cinturon}`}>
                      {alumno.apellido}, {alumno.nombre} ({alumno.cinturon})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button onClick={() => setNuevoProximoExamenOpen(false)} size="large" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            onClick={() => {
              if (candidatoSeleccionado) {
                const [id, nombre, cinturonActual] = candidatoSeleccionado.split('|');
                const cinturonObjetivo = {
                  'Blanco': 'Amarillo',
                  'Amarillo': 'Naranja',
                  'Naranja': 'Verde',
                  'Verde': 'Azul',
                  'Azul': 'Marrón',
                  'Marrón': 'Negro'
                }[cinturonActual] || 'Siguiente';
                
                const nuevoId = Math.max(...proximosExamenes.map(p => p.id), 0) + 1;
                const nuevoCandidato = {
                  id: nuevoId,
                  alumno: nombre,
                  cinturonActual,
                  cinturonObjetivo,
                  fechaExamen: '2024-02-15',
                  formulario: false,
                  pago: false,
                  listo: false
                };
                
                const nuevosProximos = [...proximosExamenes, nuevoCandidato];
                setProximosExamenes(nuevosProximos);
                localStorage.setItem('proximos-examenes-krav-maga', JSON.stringify(nuevosProximos));
                setCandidatoSeleccionado('');
                setNuevoProximoExamenOpen(false);
              }
            }}
          >
            ✅ Agregar Candidato
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Herramientas del Instructor */}
      <Dialog 
        open={herramientasOpen} 
        onClose={() => setHerramientasOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 700
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'warning.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          🔧 Herramientas del Instructor
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          
          <Grid container spacing={3}>
            {/* Cronómetro */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: 'primary.light' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.dark' }}>
                  ⏱️ Cronómetro de Rounds
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setCronometroOpen(true)}
                  sx={{ width: '100%', py: 2, fontSize: '1.1rem', fontWeight: 600 }}
                >
                  Abrir Cronómetro
                </Button>
              </Card>
            </Grid>
            
            {/* Notas de Progreso */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: 'info.light' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'info.dark' }}>
                  📝 Notas de Progreso
                </Typography>
                <Button
                  variant="contained"
                  color="info"
                  size="large"
                  onClick={() => setNotasAlumnoOpen(true)}
                  sx={{ width: '100%', py: 2, fontSize: '1.1rem', fontWeight: 600 }}
                >
                  Gestionar Notas
                </Button>
              </Card>
            </Grid>
            
            {/* Planificador */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: 'secondary.light' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.dark' }}>
                  📅 Planificador de Clases
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => setPlanificadorOpen(true)}
                  sx={{ width: '100%', py: 2, fontSize: '1.1rem', fontWeight: 600 }}
                >
                  Planificar Clases
                </Button>
              </Card>
            </Grid>
            
            {/* Estadísticas */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: 'success.light' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'success.dark' }}>
                  📊 Estadísticas
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={() => setEstadisticasOpen(true)}
                  sx={{ width: '100%', py: 2, fontSize: '1.1rem', fontWeight: 600 }}
                >
                  Ver Estadísticas
                </Button>
              </Card>
            </Grid>
            
            {/* Backup/Restore */}
            <Grid item xs={12}>
              <Card sx={{ p: 3, borderRadius: 3, bgcolor: 'warning.light' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'warning.dark', textAlign: 'center' }}>
                  💾 Backup y Restauración
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => {
                      const datos = {
                        alumnos: JSON.parse(localStorage.getItem('alumnos-krav-maga') || '[]'),
                        asistencias: JSON.parse(localStorage.getItem('asistencias-krav-maga') || '[]'),
                        mensualidades: JSON.parse(localStorage.getItem('mensualidades-krav-maga') || '[]'),
                        examenes: JSON.parse(localStorage.getItem('examenes-krav-maga') || '[]'),
                        renovaciones: JSON.parse(localStorage.getItem('renovaciones-anuales-krav-maga') || '[]'),
                        turnos: JSON.parse(localStorage.getItem('turnos-krav-maga') || '[]'),
                        notas: JSON.parse(localStorage.getItem('notas-progreso-krav-maga') || '[]')
                      };
                      const dataStr = JSON.stringify(datos, null, 2);
                      const dataBlob = new Blob([dataStr], {type: 'application/json'});
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `krav-maga-backup-${new Date().toISOString().split('T')[0]}.json`;
                      link.click();
                      alert('✅ Backup descargado exitosamente');
                    }}
                    sx={{ flex: 1, py: 2, fontSize: '1rem', fontWeight: 600 }}
                  >
                    💾 Descargar Backup
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.json';
                      input.onchange = (e: any) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e: any) => {
                            try {
                              const datos = JSON.parse(e.target.result);
                              if (window.confirm('⚠️ Esto reemplazará todos los datos actuales. ¿Continuar?')) {
                                Object.keys(datos).forEach(key => {
                                  const storageKey = key === 'renovaciones' ? 'renovaciones-anuales-krav-maga' : 
                                                   key === 'notas' ? 'notas-progreso-krav-maga' : 
                                                   `${key}-krav-maga`;
                                  localStorage.setItem(storageKey, JSON.stringify(datos[key]));
                                });
                                alert('✅ Datos restaurados. Recarga la página.');
                                window.location.reload();
                              }
                            } catch (error) {
                              alert('❌ Error: Archivo inválido');
                            }
                          };
                          reader.readAsText(file);
                        }
                      };
                      input.click();
                    }}
                    sx={{ flex: 1, py: 2, fontSize: '1rem', fontWeight: 600 }}
                  >
                    📁 Restaurar Backup
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setHerramientasOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Cronómetro */}
      <Dialog open={cronometroOpen} onClose={() => setCronometroOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          ⏱️ Cronómetro de Rounds
        </DialogTitle>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 700,
            mb: 3,
            color: tiempo <= 10 ? 'error.main' : 'primary.main',
            fontSize: { xs: '3rem', sm: '4rem' }
          }}>
            {Math.floor(tiempo / 60)}:{(tiempo % 60).toString().padStart(2, '0')}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              variant="contained"
              color={corriendo ? 'error' : 'success'}
              size="large"
              onClick={() => {
                setCorriendo(!corriendo);
                if (!corriendo) {
                  const interval = setInterval(() => {
                    setTiempo(prev => {
                      if (prev <= 1) {
                        setCorriendo(false);
                        clearInterval(interval);
                        alert('⏰ ¡Tiempo terminado!');
                        return 0;
                      }
                      return prev - 1;
                    });
                  }, 1000);
                }
              }}
              sx={{ flex: 1, py: 2, fontSize: '1.2rem', fontWeight: 700 }}
            >
              {corriendo ? 'PAUSAR' : 'INICIAR'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => {
                setCorriendo(false);
                setTiempo(180);
              }}
              sx={{ flex: 1, py: 2, fontSize: '1.2rem', fontWeight: 700 }}
            >
              RESET
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[60, 120, 180, 300].map(segundos => (
              <Button
                key={segundos}
                variant="outlined"
                size="small"
                onClick={() => setTiempo(segundos)}
                sx={{ minWidth: 60 }}
              >
                {segundos/60}min
              </Button>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCronometroOpen(false)} variant="contained" sx={{ width: '100%' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Notas de Progreso */}
      <Dialog 
        open={notasAlumnoOpen} 
        onClose={() => setNotasAlumnoOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 800
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'info.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          📝 Notas de Progreso por Alumno
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          
          {/* Selector de alumno */}
          <Card sx={{ p: 2, mb: 3, borderRadius: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Seleccionar Alumno</InputLabel>
              <Select
                value={alumnoSeleccionado?.id || ''}
                label="Seleccionar Alumno"
                onChange={(e) => {
                  const alumno = alumnos.find(a => a.id === e.target.value);
                  setAlumnoSeleccionado(alumno);
                }}
              >
                {alumnos.map((alumno) => (
                  <MenuItem key={alumno.id} value={alumno.id}>
                    {alumno.apellido}, {alumno.nombre} ({alumno.cinturon})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Card>
          
          {/* Notas del alumno seleccionado */}
          {alumnoSeleccionado && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Notas de {alumnoSeleccionado.apellido}, {alumnoSeleccionado.nombre}
              </Typography>
              
              {/* Botón agregar nota */}
              <Button
                variant="contained"
                onClick={() => {
                  const nuevaNota = prompt('Nueva nota de progreso:');
                  if (nuevaNota) {
                    const nota = {
                      id: Date.now(),
                      alumno_id: alumnoSeleccionado.id,
                      alumno_nombre: `${alumnoSeleccionado.apellido}, ${alumnoSeleccionado.nombre}`,
                      fecha: new Date().toISOString().split('T')[0],
                      nota: nuevaNota,
                      instructor: 'Sensei Martínez'
                    };
                    const nuevasNotas = [...notasProgreso, nota];
                    setNotasProgreso(nuevasNotas);
                    localStorage.setItem('notas-progreso-krav-maga', JSON.stringify(nuevasNotas));
                  }
                }}
                sx={{ mb: 3, width: '100%', py: 2, fontSize: '1.1rem', fontWeight: 600 }}
              >
                ➕ Agregar Nueva Nota
              </Button>
              
              {/* Lista de notas */}
              {notasProgreso
                .filter(nota => nota.alumno_id === alumnoSeleccionado.id)
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .map((nota) => (
                  <Card key={nota.id} sx={{ mb: 2, borderRadius: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                          {new Date(nota.fecha).toLocaleDateString('es-ES')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {nota.instructor}
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {nota.nota}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              }
              
              {notasProgreso.filter(nota => nota.alumno_id === alumnoSeleccionado.id).length === 0 && (
                <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay notas registradas para este alumno
                  </Typography>
                </Card>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setNotasAlumnoOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Estadísticas del Instructor */}
      <Dialog 
        open={estadisticasOpen} 
        onClose={() => setEstadisticasOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 800
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'success.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          📊 Estadísticas del Instructor
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          
          <Grid container spacing={3}>
            {/* Clases este mes */}
            <Grid item xs={6} sm={3}>
              <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  {historialClases.filter(c => {
                    const fecha = new Date(c.fecha);
                    const hoy = new Date();
                    return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
                  }).length}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Clases este mes
                </Typography>
              </Card>
            </Grid>
            
            {/* Alumnos activos */}
            <Grid item xs={6} sm={3}>
              <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'info.light' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.dark' }}>
                  {alumnos.length}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Alumnos activos
                </Typography>
              </Card>
            </Grid>
            
            {/* Ingresos mensuales */}
            <Grid item xs={6} sm={3}>
              <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.dark' }}>
                  ${(mensualidades.filter(m => m.pagado).length * configMensualidad.montoContinuo).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Ingresos mensuales
                </Typography>
              </Card>
            </Grid>
            
            {/* Promovidos */}
            <Grid item xs={6} sm={3}>
              <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                  {examenes.filter(e => e.resultado === 'Aprobado').length}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Alumnos promovidos
                </Typography>
              </Card>
            </Grid>
          </Grid>
          
          {/* Progreso del club */}
          <Card sx={{ mt: 3, p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              🏆 Logros del Club
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • Asistencia promedio: <strong>78%</strong>
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • Retención de alumnos: <strong>85%</strong>
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • Crecimiento mensual: <strong>+12%</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • Satisfacción: <strong>9.2/10</strong>
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • Recomendaciones: <strong>94%</strong>
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • Horas enseñadas: <strong>240h</strong>
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setEstadisticasOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Planificador */}
      <Dialog 
        open={planificadorOpen} 
        onClose={() => setPlanificadorOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 800
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'secondary.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          📅 Planificador de Clases
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          
          {/* Próximas clases planificadas */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Próximas Clases Planificadas
          </Typography>
          
          {[
            { fecha: 'Hoy 17:00', nivel: 'Blanco', tema: 'Repaso: Posición de guardia', alumnos: 8 },
            { fecha: 'Hoy 18:00', nivel: 'Amarillo', tema: 'Nuevo: Defensa contra agarres', alumnos: 12 },
            { fecha: 'Mañana 17:00', nivel: 'Blanco', tema: 'Nuevo: Golpes básicos', alumnos: 8 },
            { fecha: 'Miércoles 19:00', nivel: 'Naranja/Verde', tema: 'Repaso: Combinaciones', alumnos: 10 }
          ].map((clase, index) => (
            <Card key={index} sx={{ mb: 2, borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {clase.fecha} - {clase.nivel}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {clase.tema}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {clase.alumnos} alumnos esperados
                    </Typography>
                  </Box>
                  <Button variant="outlined" size="small">
                    Editar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
          
          {/* Botón planificar nueva clase */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => alert('📅 Funcionalidad de planificación en desarrollo')}
            sx={{ width: '100%', py: 2, fontSize: '1.1rem', fontWeight: 600, mt: 2 }}
          >
            ➕ Planificar Nueva Clase
          </Button>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setPlanificadorOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Reportes Personalizables */}
      <Dialog 
        open={reportesOpen} 
        onClose={() => setReportesOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 1000
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'info.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          📈 Centro de Reportes
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'auto' }}>
          
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabReporte} 
              onChange={(e, newValue) => setTabReporte(newValue)}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontSize: { xs: '0.9rem', sm: '0.8rem' },
                  fontWeight: 600,
                  py: { xs: 2, sm: 1.5 }
                }
              }}
            >
              <Tab label="Financiero" />
              <Tab label="Asistencia" />
              <Tab label="Progreso" />
              <Tab label="Personalizado" />
            </Tabs>
          </Box>
          
          {/* Controles de Filtro */}
          <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Período</InputLabel>
                  <Select
                    value={periodoReporte}
                    label="Período"
                    onChange={(e) => setPeriodoReporte(e.target.value)}
                  >
                    <MenuItem value="mes-actual">Este Mes</MenuItem>
                    <MenuItem value="mes-anterior">Mes Anterior</MenuItem>
                    <MenuItem value="trimestre">Este Trimestre</MenuItem>
                    <MenuItem value="ano">Este Año</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filtro</InputLabel>
                  <Select
                    value={filtroReporte}
                    label="Filtro"
                    onChange={(e) => setFiltroReporte(e.target.value)}
                  >
                    <MenuItem value="todos">Todos los Alumnos</MenuItem>
                    <MenuItem value="blanco">Solo Cinturón Blanco</MenuItem>
                    <MenuItem value="amarillo">Solo Cinturón Amarillo</MenuItem>
                    <MenuItem value="avanzados">Cinturones Avanzados</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          
          {/* Tab Financiero */}
          {tabReporte === 0 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
                💰 Reporte Financiero - {periodoReporte.replace('-', ' ').toUpperCase()}
              </Typography>
              
              {/* Métricas principales */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.dark' }}>
                      ${(() => {
                        const ingresosMensualidades = mensualidades.filter(m => m.pagado).length * configMensualidad.montoContinuo;
                        const ingresosExamenes = examenes.filter(e => e.pago).length * 10000;
                        return (ingresosMensualidades + ingresosExamenes).toLocaleString();
                      })()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Ingresos Totales
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                      ${(mensualidades.filter(m => m.pagado).length * configMensualidad.montoContinuo).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Mensualidades
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                      ${(examenes.filter(e => e.pago).length * 10000).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Exámenes
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.dark' }}>
                      ${(() => {
                        const morosos = mensualidades.filter(m => !m.pagado);
                        return (morosos.length * configMensualidad.montoContinuo).toLocaleString();
                      })()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Por Cobrar
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Comparativa */}
              <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  📈 Comparativa vs Mes Anterior
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • Ingresos: <Chip label="+12%" color="success" size="small" sx={{ ml: 1, fontWeight: 600 }} />
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • Nuevos alumnos: <Chip label="+3" color="info" size="small" sx={{ ml: 1, fontWeight: 600 }} />
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • Retención: <Chip label="85%" color="success" size="small" sx={{ ml: 1, fontWeight: 600 }} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • Morosos: <Chip label="-2" color="success" size="small" sx={{ ml: 1, fontWeight: 600 }} />
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • Promociones: <Chip label="+5" color="warning" size="small" sx={{ ml: 1, fontWeight: 600 }} />
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • Proyección: <Chip label="$2.8M" color="info" size="small" sx={{ ml: 1, fontWeight: 600 }} />
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Box>
          )}
          
          {/* Tab Asistencia */}
          {tabReporte === 1 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
                📅 Reporte de Asistencia - {periodoReporte.replace('-', ' ').toUpperCase()}
              </Typography>
              
              {/* Métricas de asistencia */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.dark' }}>
                      {(() => {
                        const totalAsistencias = todasAsistencias.length;
                        const presentes = todasAsistencias.filter(a => a.presente).length;
                        return totalAsistencias > 0 ? Math.round((presentes / totalAsistencias) * 100) : 0;
                      })()}%
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Promedio General
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                      {todasAsistencias.filter(a => a.presente).length}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Clases Asistidas
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                      {(() => {
                        const alumnosConFaltas = alumnos.filter(alumno => {
                          const asistenciasAlumno = todasAsistencias.filter(a => a.alumno_id === alumno.id);
                          const faltasConsecutivas = asistenciasAlumno
                            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                            .slice(0, 3)
                            .filter(a => !a.presente).length;
                          return faltasConsecutivas >= 3;
                        });
                        return alumnosConFaltas.length;
                      })()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      En Riesgo
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.dark' }}>
                      {Math.round(todasAsistencias.length / 4)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Clases/Semana
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Análisis por turno */}
              <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  🕰️ Análisis por Turno
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { turno: 'Lunes 17:00', asistencia: 95, alumnos: 8 },
                    { turno: 'Lunes 18:00', asistencia: 87, alumnos: 12 },
                    { turno: 'Miércoles 19:00', asistencia: 92, alumnos: 15 },
                    { turno: 'Viernes 20:00', asistencia: 65, alumnos: 10 }
                  ].map((turno, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {turno.turno}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip 
                            label={`${turno.asistencia}%`} 
                            color={turno.asistencia >= 90 ? 'success' : turno.asistencia >= 75 ? 'warning' : 'error'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({turno.alumnos} alumnos)
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Box>
          )}
          
          {/* Tab Progreso */}
          {tabReporte === 2 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
                🎖️ Reporte de Progreso - {periodoReporte.replace('-', ' ').toUpperCase()}
              </Typography>
              
              {/* Métricas de progreso */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.dark' }}>
                      {examenes.filter(e => e.resultado === 'Aprobado').length}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Promociones
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                      {Math.round((examenes.filter(e => e.resultado === 'Aprobado').length / Math.max(examenes.length, 1)) * 100)}%
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Tasa Éxito
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                      4.2
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Meses Promedio
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.dark' }}>
                      {alumnos.filter(a => {
                        // Simular alumnos estancados (sin progreso en 6+ meses)
                        return Math.random() > 0.8;
                      }).length}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Estancados
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Progreso por cinturón */}
              <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  🥋 Progreso por Cinturón
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { cinturon: 'Blanco → Amarillo', tiempo: '3.5 meses', tasa: 92 },
                    { cinturon: 'Amarillo → Naranja', tiempo: '4.2 meses', tasa: 87 },
                    { cinturon: 'Naranja → Verde', tiempo: '5.1 meses', tasa: 83 },
                    { cinturon: 'Verde → Azul', tiempo: '6.8 meses', tasa: 78 }
                  ].map((nivel, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {nivel.cinturon}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {nivel.tiempo}
                          </Typography>
                          <Chip 
                            label={`${nivel.tasa}%`} 
                            color={nivel.tasa >= 85 ? 'success' : 'warning'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Box>
          )}
          
          {/* Tab Personalizado */}
          {tabReporte === 3 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
                🎯 Reporte Personalizado
              </Typography>
              
              <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'info.light' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'info.dark' }}>
                  🔧 Próximamente
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Funcionalidad de reportes personalizados en desarrollo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Podrás crear reportes con métricas específicas, gráficos personalizados y filtros avanzados
                </Typography>
              </Card>
            </Box>
          )}
          
          {/* Botones de Exportación */}
          <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
              💾 Exportar Reporte
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => {
                    alert('📝 Generando PDF... (Funcionalidad en desarrollo)');
                  }}
                  sx={{ py: 2, fontSize: '1rem', fontWeight: 600 }}
                >
                  📝 Exportar PDF
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={() => {
                    alert('📈 Generando Excel... (Funcionalidad en desarrollo)');
                  }}
                  sx={{ py: 2, fontSize: '1rem', fontWeight: 600 }}
                >
                  📈 Exportar Excel
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="info"
                  fullWidth
                  onClick={() => {
                    const reporte = `REPORTE KRAV MAGA - ${new Date().toLocaleDateString('es-ES')}\n\n` +
                      `FINANCIERO:\n` +
                      `- Ingresos: $${(mensualidades.filter(m => m.pagado).length * configMensualidad.montoContinuo).toLocaleString()}\n` +
                      `- Morosos: ${mensualidades.filter(m => !m.pagado).length}\n\n` +
                      `ASISTENCIA:\n` +
                      `- Promedio: ${Math.round((todasAsistencias.filter(a => a.presente).length / Math.max(todasAsistencias.length, 1)) * 100)}%\n` +
                      `- Alumnos activos: ${alumnos.length}\n\n` +
                      `PROGRESO:\n` +
                      `- Promociones: ${examenes.filter(e => e.resultado === 'Aprobado').length}\n` +
                      `- Tasa de éxito: ${Math.round((examenes.filter(e => e.resultado === 'Aprobado').length / Math.max(examenes.length, 1)) * 100)}%`;
                    
                    if (navigator.share) {
                      navigator.share({
                        title: 'Reporte Krav Maga',
                        text: reporte
                      });
                    } else {
                      navigator.clipboard.writeText(reporte);
                      alert('📱 Reporte copiado al portapapeles');
                    }
                  }}
                  sx={{ py: 2, fontSize: '1rem', fontWeight: 600 }}
                >
                  📱 Compartir
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => setReportesOpen(false)} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Gestión de Alumnos */}
      <Dialog 
        open={gestionAlumnosOpen} 
        onClose={() => setGestionAlumnosOpen(false)} 
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0
          },
          '@media (min-width: 600px)': {
            '& .MuiDialog-paper': {
              margin: 2,
              maxHeight: '90vh',
              borderRadius: 2,
              maxWidth: 800
            }
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          🧑‍🎓 Gestión de Alumnos ({alumnos.length})
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          
          {/* Botón Nuevo Alumno */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setNuevoAlumnoOpen(true)}
              size="large"
              sx={{ 
                px: { xs: 4, sm: 3 },
                py: { xs: 2, sm: 1.5 },
                fontSize: { xs: '1.1rem', sm: '1rem' },
                fontWeight: 600,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Nuevo Alumno
            </Button>
          </Box>
          
          {/* Búsqueda */}
          <Card sx={{ p: 2, mb: 3, borderRadius: 3 }}>
            <TextField
              fullWidth
              label="Buscar alumno"
              value={busquedaAlumno}
              onChange={(e) => setBusquedaAlumno(e.target.value)}
              placeholder="Nombre o apellido..."
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  py: { xs: 2, sm: 1.5 }
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '1.1rem', sm: '1rem' }
                }
              }}
            />
          </Card>
          
          {/* Lista de Alumnos */}
          {alumnos
            .filter(alumno => 
              `${alumno.nombre} ${alumno.apellido}`.toLowerCase().includes(busquedaAlumno.toLowerCase())
            )
            .sort((a, b) => `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`))
            .map((alumno) => (
              <Card key={alumno.id} sx={{ 
                mb: 2,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.300'
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 1 }
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '1.2rem', sm: '1.25rem' },
                        mb: 1
                      }}>
                        {alumno.apellido}, {alumno.nombre}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 1 }}>
                        <Typography variant="body2" sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          fontSize: { xs: '1rem', sm: '0.9rem' }
                        }}>
                          📱 {alumno.telefono || 'Sin teléfono'}
                        </Typography>
                        
                        <Chip
                          label={alumno.cinturon}
                          size="small"
                          sx={{
                            bgcolor: 
                              alumno.cinturon === 'Blanco' ? '#ffffff' :
                              alumno.cinturon === 'Amarillo' ? '#ffeb3b' :
                              alumno.cinturon === 'Naranja' ? '#ff9800' :
                              alumno.cinturon === 'Verde' ? '#4caf50' :
                              alumno.cinturon === 'Azul' ? '#2196f3' :
                              alumno.cinturon === 'Marrón' ? '#795548' : '#000000',
                            color: 
                              alumno.cinturon === 'Blanco' ? '#000000' :
                              alumno.cinturon === 'Amarillo' ? '#000000' : '#ffffff',
                            border: alumno.cinturon === 'Blanco' ? '1px solid #ccc' : 'none',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary">
                        ID: {alumno.id} | Registrado: {new Date().toLocaleDateString('es-ES')}
                      </Typography>
                    </Box>
                    
                    {/* Botones de acción */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      flexDirection: { xs: 'row', sm: 'column' },
                      width: { xs: '100%', sm: 'auto' }
                    }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Edit />}
                        onClick={() => {
                          setAlumnoEditando(alumno);
                          setEditarAlumnoOpen(true);
                        }}
                        sx={{ 
                          flex: { xs: 1, sm: 'none' },
                          fontSize: { xs: '1rem', sm: '0.875rem' },
                          fontWeight: 600,
                          py: { xs: 1.5, sm: 1 }
                        }}
                      >
                        Editar
                      </Button>
                      
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => {
                          if (window.confirm(`¿Estás seguro de eliminar a ${alumno.apellido}, ${alumno.nombre}?\n\nEsta acción eliminará también:\n• Sus asistencias\n• Sus notas de progreso\n• Sus mensualidades\n• Sus exámenes\n\n⚠️ Esta acción NO se puede deshacer.`)) {
                            // Eliminar alumno y datos relacionados
                            const nuevosAlumnos = alumnos.filter(a => a.id !== alumno.id);
                            setAlumnos(nuevosAlumnos);
                            localStorage.setItem('alumnos-krav-maga', JSON.stringify(nuevosAlumnos));
                            
                            // Eliminar asistencias
                            const nuevasAsistencias = todasAsistencias.filter(a => a.alumno_id !== alumno.id);
                            setTodasAsistencias(nuevasAsistencias);
                            localStorage.setItem('asistencias-krav-maga', JSON.stringify(nuevasAsistencias));
                            
                            // Eliminar notas de progreso
                            const nuevasNotas = notasProgreso.filter(n => n.alumno_id !== alumno.id);
                            setNotasProgreso(nuevasNotas);
                            localStorage.setItem('notas-progreso-krav-maga', JSON.stringify(nuevasNotas));
                            
                            // Eliminar mensualidades
                            const nuevasMensualidades = mensualidades.filter(m => m.alumno !== `${alumno.apellido}, ${alumno.nombre}`);
                            setMensualidades(nuevasMensualidades);
                            localStorage.setItem('mensualidades-krav-maga', JSON.stringify(nuevasMensualidades));
                            
                            alert(`✅ ${alumno.apellido}, ${alumno.nombre} ha sido eliminado correctamente.`);
                          }
                        }}
                        sx={{ 
                          flex: { xs: 1, sm: 'none' },
                          fontSize: { xs: '1rem', sm: '0.875rem' },
                          fontWeight: 600,
                          py: { xs: 1.5, sm: 1 }
                        }}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          }
          
          {/* Sin resultados */}
          {alumnos.filter(alumno => 
            `${alumno.nombre} ${alumno.apellido}`.toLowerCase().includes(busquedaAlumno.toLowerCase())
          ).length === 0 && (
            <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {busquedaAlumno ? '🔍 No se encontraron alumnos' : '🧑‍🎓 No hay alumnos registrados'}
              </Typography>
              {!busquedaAlumno && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Usa "Nuevo Alumno" para agregar el primer estudiante
                </Typography>
              )}
            </Card>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 3, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button 
            onClick={() => {
              setGestionAlumnosOpen(false);
              setBusquedaAlumno('');
            }} 
            variant="contained" 
            size="large"
            sx={{ 
              width: '100%',
              py: { xs: 2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal Editar Alumno */}
      <Dialog open={editarAlumnoOpen} onClose={() => setEditarAlumnoOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          ✏️ Editar Alumno
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {alumnoEditando && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={alumnoEditando.nombre || ''}
                  onChange={(e) => setAlumnoEditando({...alumnoEditando, nombre: e.target.value})}
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={alumnoEditando.apellido || ''}
                  onChange={(e) => setAlumnoEditando({...alumnoEditando, apellido: e.target.value})}
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={alumnoEditando.telefono || ''}
                  onChange={(e) => setAlumnoEditando({...alumnoEditando, telefono: e.target.value})}
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Cinturón</InputLabel>
                  <Select
                    value={alumnoEditando.cinturon || 'Blanco'}
                    label="Cinturón"
                    onChange={(e) => setAlumnoEditando({...alumnoEditando, cinturon: e.target.value})}
                  >
                    <MenuItem value="Blanco">🤍 Blanco</MenuItem>
                    <MenuItem value="Amarillo">🟡 Amarillo</MenuItem>
                    <MenuItem value="Naranja">🟠 Naranja</MenuItem>
                    <MenuItem value="Verde">🟢 Verde</MenuItem>
                    <MenuItem value="Azul">🔵 Azul</MenuItem>
                    <MenuItem value="Marrón">🟤 Marrón</MenuItem>
                    <MenuItem value="Negro">⚫ Negro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button 
            onClick={() => {
              setEditarAlumnoOpen(false);
              setAlumnoEditando(null);
            }} 
            size="large" 
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            onClick={() => {
              if (alumnoEditando && alumnoEditando.nombre && alumnoEditando.apellido) {
                // Actualizar alumno
                const nuevosAlumnos = alumnos.map(a => 
                  a.id === alumnoEditando.id ? alumnoEditando : a
                );
                setAlumnos(nuevosAlumnos);
                localStorage.setItem('alumnos-krav-maga', JSON.stringify(nuevosAlumnos));
                
                // Actualizar datos relacionados si cambió el nombre
                const nombreCompleto = `${alumnoEditando.apellido}, ${alumnoEditando.nombre}`;
                
                // Actualizar mensualidades
                const nuevasMensualidades = mensualidades.map(m => 
                  m.id === alumnoEditando.id ? { ...m, alumno: nombreCompleto } : m
                );
                setMensualidades(nuevasMensualidades);
                localStorage.setItem('mensualidades-krav-maga', JSON.stringify(nuevasMensualidades));
                
                // Actualizar notas de progreso
                const nuevasNotas = notasProgreso.map(n => 
                  n.alumno_id === alumnoEditando.id ? { ...n, alumno_nombre: nombreCompleto } : n
                );
                setNotasProgreso(nuevasNotas);
                localStorage.setItem('notas-progreso-krav-maga', JSON.stringify(nuevasNotas));
                
                setEditarAlumnoOpen(false);
                setAlumnoEditando(null);
                alert(`✅ Datos de ${nombreCompleto} actualizados correctamente.`);
              } else {
                alert('⚠️ Por favor completa nombre y apellido.');
              }
            }}
          >
            ✅ Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardTab;