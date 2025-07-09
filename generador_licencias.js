// 🔑 GENERADOR DE LICENCIAS MENSUALES
// Ejecutar con: node generador_licencias.js

function generateHash(clientName, yearMonth) {
  const combined = clientName + yearMonth + 'KRAV-SECRET-2024';
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).toUpperCase().substring(0, 6);
}

function generateLicense(clientName, year, month) {
  const yearMonth = year.toString() + month.toString().padStart(2, '0');
  const hash = generateHash(clientName.toUpperCase(), yearMonth);
  return `KRAV-${clientName.toUpperCase()}-${yearMonth}-${hash}`;
}

// 📋 EJEMPLOS DE USO:

console.log('🔑 GENERADOR DE LICENCIAS KRAV MAGA\n');

// Generar licencias para diferentes clientes
const clientes = [
  { nombre: 'CLUB1', descripcion: 'Club Krav Maga Centro' },
  { nombre: 'DOJO2', descripcion: 'Dojo Krav Maga Norte' },
  { nombre: 'GYM3', descripcion: 'Gimnasio Krav Maga Sur' }
];

const año = 2024;
const meses = [
  { num: 1, nombre: 'Enero' },
  { num: 2, nombre: 'Febrero' },
  { num: 3, nombre: 'Marzo' }
];

clientes.forEach(cliente => {
  console.log(`📍 ${cliente.descripcion} (${cliente.nombre}):`);
  
  meses.forEach(mes => {
    const licencia = generateLicense(cliente.nombre, año, mes.num);
    const expira = new Date(año, mes.num, 0).toLocaleDateString('es-ES');
    console.log(`   ${mes.nombre} ${año}: ${licencia} (expira: ${expira})`);
  });
  
  console.log('');
});

// 🎯 FUNCIÓN PARA GENERAR LICENCIA ESPECÍFICA
function generarLicenciaCliente(nombreCliente, año, mes) {
  const licencia = generateLicense(nombreCliente, año, mes);
  const fechaExpiracion = new Date(año, mes, 0);
  
  console.log(`\n🎯 LICENCIA GENERADA:`);
  console.log(`Cliente: ${nombreCliente}`);
  console.log(`Período: ${mes}/${año}`);
  console.log(`Código: ${licencia}`);
  console.log(`Expira: ${fechaExpiracion.toLocaleDateString('es-ES')}`);
  
  return licencia;
}

// Ejemplo: Generar licencia para enero 2024
// generarLicenciaCliente('MICLUB', 2024, 1);

console.log('💡 Para generar una licencia específica:');
console.log('generarLicenciaCliente("NOMBRE_CLIENTE", 2024, 1);');