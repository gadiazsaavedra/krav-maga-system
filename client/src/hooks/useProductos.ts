import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'http://localhost:5002/api';

interface Producto {
  id: number;
  tipo: string;
  talle: string;
  precio: number;
  stock: number;
  stock_minimo: number;
}

export const useProductos = () => {
  return useQuery<Producto[]>({
    queryKey: ['productos'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/productos`);
      return data;
    },
  });
};

export const useStockBajo = () => {
  return useQuery<Producto[]>({
    queryKey: ['productos', 'stock-bajo'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/productos/stock-bajo`);
      return data;
    },
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });
};

export const useCreateProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (producto: Omit<Producto, 'id'>) => {
      const { data } = await axios.post(`${API_BASE}/productos`, producto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
};

export const useUpdateProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...producto }: { id: number } & Partial<Producto>) => {
      const { data } = await axios.put(`${API_BASE}/productos/${id}`, producto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
};