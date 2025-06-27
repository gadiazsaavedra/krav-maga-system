import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'http://localhost:5002/api';

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
  return useQuery<AlumnosResponse>({
    queryKey: ['alumnos', page, limit, orderBy, order],
    queryFn: async () => {
      const url = `${API_BASE}/alumnos?page=${page}&limit=${limit}&orderBy=${orderBy}&order=${order}`;

      const { data } = await axios.get(url);
      return data;
    },
    staleTime: 0, // Forzar refetch
    gcTime: 0, // No cachear
  });
};

export const useCreateAlumno = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (alumno: any) => {
      const { data } = await axios.post(`${API_BASE}/alumnos`, alumno);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumnos'] });
    },
  });
};

export const useUpdateAlumno = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...alumno }: any) => {
      const { data } = await axios.put(`${API_BASE}/alumnos/${id}`, alumno);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumnos'] });
    },
  });
};

export const useDeleteAlumno = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.delete(`${API_BASE}/alumnos/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumnos'] });
    },
  });
};