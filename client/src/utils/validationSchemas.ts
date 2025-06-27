import * as yup from 'yup';

export const alumnoSchema = yup.object({
  nombre: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  apellido: yup
    .string()
    .required('El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  telefono: yup
    .string()
    .matches(/^[\d\s\-\+\(\)]+$/, 'Formato de teléfono inválido')
    .min(8, 'El teléfono debe tener al menos 8 dígitos'),
  email: yup
    .string()
    .email('Email inválido')
    .max(100, 'El email no puede exceder 100 caracteres'),
  fecha_nacimiento: yup
    .string(),
  grupo: yup
    .string()
    .required('El turno es obligatorio'),
  cinturon: yup
    .string()
    .required('El cinturón es obligatorio')
});

export const pagoSchema = yup.object({
  alumno_id: yup
    .string()
    .required('Debe seleccionar un alumno'),
  monto: yup
    .number()
    .required('El monto es obligatorio')
    .positive('El monto debe ser positivo')
    .min(1000, 'El monto mínimo es $1,000')
    .max(200000, 'El monto máximo es $200,000'),
  metodo_pago: yup
    .string()
    .required('Debe seleccionar un método de pago')
    .oneOf(['Efectivo', 'Transferencia', 'Tarjeta'], 'Método de pago inválido')
});

export const productoSchema = yup.object({
  tipo: yup
    .string()
    .required('El tipo de producto es obligatorio')
    .min(2, 'El tipo debe tener al menos 2 caracteres'),
  talle: yup
    .string()
    .required('El talle es obligatorio'),
  precio: yup
    .number()
    .required('El precio es obligatorio')
    .positive('El precio debe ser positivo')
    .min(100, 'El precio mínimo es $100'),
  stock: yup
    .number()
    .min(0, 'El stock no puede ser negativo')
    .integer('El stock debe ser un número entero'),
  stock_minimo: yup
    .number()
    .min(0, 'El stock mínimo no puede ser negativo')
    .integer('El stock mínimo debe ser un número entero')
});