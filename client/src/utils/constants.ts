export const API_BASE_URL = 'http://localhost:5002/api';

export const CINTURONES = ['Blanco', 'Amarillo', 'Naranja', 'Verde', 'Azul', 'Marrón', 'Negro'];

export const TURNOS_POR_CINTURON = {
  'Blanco': ['Lunes y Miércoles 17:00-18:00', 'Lunes y Miércoles 19:00-20:00', 'Martes y Jueves 13:00-14:00', 'Viernes 17:30-19:10'],
  'Amarillo': ['Lunes y Miércoles 18:00-19:00', 'Martes y Jueves 13:00-14:00', 'Viernes 19:10-21:00'],
  'Naranja': ['Lunes y Miércoles 20:00-21:00', 'Viernes 19:10-21:00'],
  'Verde': ['Lunes y Miércoles 20:00-21:00'],
  'Azul': [],
  'Marrón': [],
  'Negro': []
};

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const METODOS_PAGO = ['Efectivo', 'Transferencia', 'Tarjeta'];

export const ESTADOS_PEDIDO = ['Pedido', 'Recibido en Club', 'Entregado'];