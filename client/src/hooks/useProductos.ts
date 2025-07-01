// Hooks simplificados sin dependencias externas

interface Producto {
  id: number;
  tipo: string;
  talle: string;
  precio: number;
  stock: number;
  stock_minimo: number;
}

export const useProductos = () => {
  // Versión simplificada que devuelve un objeto vacío
  return { data: [], isLoading: false, error: null };
};

export const useStockBajo = () => {
  // Versión simplificada que devuelve un objeto vacío
  return { data: [], isLoading: false, error: null };
};

export const useCreateProducto = () => {
  // Versión simplificada que devuelve un objeto vacío
  return { mutate: () => {}, isLoading: false };
};

export const useUpdateProducto = () => {
  // Versión simplificada que devuelve un objeto vacío
  return { mutate: () => {}, isLoading: false };
};