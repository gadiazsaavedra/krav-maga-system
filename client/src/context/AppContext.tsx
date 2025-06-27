import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

// Interfaces
export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fecha_nacimiento: string;
  grupo: string;
  cinturon: string;
  fecha_registro: string;
}

export interface Pago {
  id: number;
  nombre: string;
  apellido: string;
  estado: string;
  fecha_pago: string | null;
  fecha_limite: string;
  dias_atraso: number;
  monto: number | null;
  metodo_pago: string | null;
  activo: boolean;
}

// Datos iniciales
const alumnosIniciales = [
  { id: 1, nombre: 'Juan', apellido: 'Pérez', telefono: '11-1234-5678', email: 'juan@example.com', fecha_nacimiento: '1990-05-15', grupo: 'Adultos', cinturon: 'Amarillo', fecha_registro: '2024-01-15' },
  { id: 2, nombre: 'María', apellido: 'González', telefono: '11-2345-6789', email: 'maria@example.com', fecha_nacimiento: '1985-08-22', grupo: 'Adultos', cinturon: 'Verde', fecha_registro: '2024-02-10' },
  { id: 3, nombre: 'Carlos', apellido: 'Rodríguez', telefono: '11-3456-7890', email: 'carlos@example.com', fecha_nacimiento: '1992-03-10', grupo: 'Jóvenes', cinturon: 'Blanco', fecha_registro: '2024-03-05' },
  { id: 4, nombre: 'Ana', apellido: 'Martínez', telefono: '11-4567-8901', email: 'ana@example.com', fecha_nacimiento: '1988-12-05', grupo: 'Adultos', cinturon: 'Azul', fecha_registro: '2024-01-20' }
];

// Función para calcular días de atraso
const calcularDiasAtraso = (fechaLimite: string): number => {
  const hoy = new Date();
  const limite = new Date(fechaLimite);
  const diferencia = hoy.getTime() - limite.getTime();
  return Math.max(0, Math.floor(diferencia / (1000 * 3600 * 24)));
};

const pagosIniciales = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    estado: 'Pagado',
    fecha_pago: '2025-06-01',
    fecha_limite: '2025-06-10',
    dias_atraso: 0,
    monto: 15000,
    metodo_pago: 'Efectivo',
    activo: true
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'González',
    estado: 'Pagado',
    fecha_pago: '2025-06-05',
    fecha_limite: '2025-06-10',
    dias_atraso: 0,
    monto: 15000,
    metodo_pago: 'Transferencia',
    activo: true
  },
  {
    id: 3,
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    estado: 'Pendiente',
    fecha_pago: null,
    fecha_limite: '2025-06-10',
    dias_atraso: calcularDiasAtraso('2025-06-10'),
    monto: null,
    metodo_pago: null,
    activo: true
  },
  {
    id: 4,
    nombre: 'Ana',
    apellido: 'Martínez',
    estado: 'Pendiente',
    fecha_pago: null,
    fecha_limite: '2025-05-10',
    dias_atraso: calcularDiasAtraso('2025-05-10'),
    monto: null,
    metodo_pago: null,
    activo: true
  },
  {
    id: 5,
    nombre: 'Pedro',
    apellido: 'Sánchez',
    estado: 'Pendiente',
    fecha_pago: null,
    fecha_limite: '2025-03-10',
    dias_atraso: calcularDiasAtraso('2025-03-10'),
    monto: null,
    metodo_pago: null,
    activo: false
  }
];

// Contexto
interface AppContextType {
  alumnos: Alumno[];
  setAlumnos: React.Dispatch<React.SetStateAction<Alumno[]>>;
  pagos: Pago[];
  setPagos: React.Dispatch<React.SetStateAction<Pago[]>>;
  loading: boolean;
  agregarAlumno: (alumno: Omit<Alumno, 'id' | 'fecha_registro'>) => Promise<Alumno>;
  actualizarAlumno: (id: number, alumno: Partial<Alumno>) => Promise<void>;
  registrarPago: (alumnoId: number, monto: number, metodoPago: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [pagos, setPagos] = useState<Pago[]>(pagosIniciales);
  const [loading, setLoading] = useState(true);
  
  // Cargar alumnos desde la API
  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/alumnos');
        setAlumnos(response.data);
      } catch (error) {
        console.error('Error cargando alumnos:', error);
        // Usar datos iniciales como fallback
        setAlumnos(alumnosIniciales);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlumnos();
  }, []);

  // Agregar un nuevo alumno
  const agregarAlumno = async (alumno: Omit<Alumno, 'id' | 'fecha_registro'>) => {
    try {
      // Guardar en la base de datos
      const response = await axios.post('http://localhost:5002/api/alumnos', alumno);
      
      // Obtener el alumno con el ID asignado
      const nuevoAlumno: Alumno = {
        ...alumno,
        id: response.data.id,
        fecha_registro: new Date().toISOString().split('T')[0]
      };
      
      // Actualizar el estado local
      setAlumnos([...alumnos, nuevoAlumno]);
      
      // Calcular fecha límite para el pago inicial
      const hoy = new Date();
      const fechaLimite = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 10).toISOString().split('T')[0];
      
      // Agregar el alumno a la lista de pagos (como pendiente)
      const nuevoPago: Pago = {
        id: nuevoAlumno.id,
        nombre: nuevoAlumno.nombre,
        apellido: nuevoAlumno.apellido,
        estado: 'Pendiente',
        fecha_pago: null,
        fecha_limite: fechaLimite,
        dias_atraso: 0,
        monto: null,
        metodo_pago: null,
        activo: true
      };
      
      setPagos([...pagos, nuevoPago]);
      return nuevoAlumno;
    } catch (error) {
      // Propagar el error para manejarlo en el componente
      throw error;
    }
  };

  // Actualizar un alumno existente
  const actualizarAlumno = async (id: number, alumnoActualizado: Partial<Alumno>) => {
    try {
      // Actualizar en la base de datos
      await axios.put(`http://localhost:5002/api/alumnos/${id}`, alumnoActualizado);
      
      // Actualizar en el estado local
      setAlumnos(prev => prev.map(alumno => 
        alumno.id === id ? { ...alumno, ...alumnoActualizado } : alumno
      ));
      
      // Actualizar también en la lista de pagos si cambió el nombre o apellido
      if (alumnoActualizado.nombre || alumnoActualizado.apellido) {
        setPagos(prev => prev.map(pago => 
          pago.id === id ? { 
            ...pago, 
            nombre: alumnoActualizado.nombre || pago.nombre,
            apellido: alumnoActualizado.apellido || pago.apellido
          } : pago
        ));
      }
    } catch (error) {
      console.error('Error al actualizar alumno:', error);
      throw error;
    }
  };

  // Registrar un pago
  const registrarPago = (alumnoId: number, monto: number, metodoPago: string) => {
    // Calcular fecha límite para el próximo mes
    const hoy = new Date();
    const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 10);
    const fechaLimite = proximoMes.toISOString().split('T')[0];
    
    setPagos(prev => prev.map(pago => 
      pago.id === alumnoId ? {
        ...pago,
        estado: 'Pagado',
        fecha_pago: new Date().toISOString().split('T')[0],
        fecha_limite: fechaLimite,
        dias_atraso: 0,
        monto: monto,
        metodo_pago: metodoPago,
        activo: true
      } : pago
    ));
  };

  return (
    <AppContext.Provider value={{ 
      alumnos, 
      setAlumnos, 
      pagos, 
      setPagos,
      loading,
      agregarAlumno,
      actualizarAlumno,
      registrarPago
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};