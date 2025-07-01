// Hooks simplificados sin dependencias externas

// API_BASE ya no se usa

interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  fecha_nacimiento?: string;
  grupo: string;
  cinturon: string;
  fecha_registro: string;
  inasistencias_recientes?: number;
}

interface AlumnosResponse {
  data: Alumno[];
  total: number;
  page: number;
  limit: number;
}

export const useAlumnos = (page = 0, limit = 10, orderBy = 'apellido', order = 'asc') => {
  // Versión simplificada que devuelve un objeto vacío
  return { data: null, isLoading: false, error: null };
};

export const useCreateAlumno = () => {
  // Versión simplificada que devuelve un objeto vacío
  return { mutate: () => {}, isLoading: false };
};

export const useUpdateAlumno = () => {
  // Versión simplificada que devuelve un objeto vacío
  return { mutate: () => {}, isLoading: false };
};

export const useDeleteAlumno = () => {
  // Versión simplificada que devuelve un objeto vacío
  return { mutate: () => {}, isLoading: false };
};