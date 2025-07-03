// Formateo automático de teléfonos
export const formatTelefono = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
};

// Sugerencias de dominios de email
export const dominiosComunes = [
  '@gmail.com',
  '@hotmail.com', 
  '@yahoo.com',
  '@outlook.com',
  '@icloud.com'
];

// Calles comunes (ejemplo para Argentina)
export const callesComunes = [
  'Av. Corrientes',
  'Av. Santa Fe',
  'Av. Rivadavia',
  'Av. Cabildo',
  'San Martín',
  'Belgrano',
  'Mitre',
  'Sarmiento',
  '9 de Julio',
  'Independencia'
];

// Obtener sugerencias de email
export const getSugerenciasEmail = (value: string): string[] => {
  if (!value.includes('@')) {
    return dominiosComunes.map(dominio => value + dominio);
  }
  const [usuario, dominio] = value.split('@');
  if (!dominio) return dominiosComunes.map(d => value + d.slice(1));
  return dominiosComunes
    .filter(d => d.toLowerCase().includes(dominio.toLowerCase()))
    .map(d => usuario + d);
};