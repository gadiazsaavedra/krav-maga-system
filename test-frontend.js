const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando estructura del frontend...\n');

const clientPath = './client/src';
const checks = [];

const checkFile = (filePath, description) => {
  const fullPath = path.join(clientPath, filePath);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${description}: ${filePath}`);
  checks.push({ file: filePath, exists, description });
  return exists;
};

const checkDirectory = (dirPath, description) => {
  const fullPath = path.join(clientPath, dirPath);
  const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${description}: ${dirPath}/`);
  checks.push({ file: dirPath, exists, description });
  return exists;
};

// Verificar estructura de directorios
console.log('📁 Estructura de directorios:');
checkDirectory('components', 'Componentes React');
checkDirectory('hooks', 'Hooks personalizados');
checkDirectory('utils', 'Utilidades');
checkDirectory('context', 'Context API');

console.log('\n📄 Archivos principales:');
checkFile('App.tsx', 'Aplicación principal');
checkFile('index.tsx', 'Punto de entrada');

console.log('\n🧩 Componentes principales:');
checkFile('components/AlumnosTab.tsx', 'Gestión de alumnos');
checkFile('components/MensualidadesTab.tsx', 'Control de pagos');
checkFile('components/IndumentariaTab.tsx', 'Gestión de productos');
checkFile('components/AsistenciasTab.tsx', 'Control de asistencias');
checkFile('components/RenovacionesTab.tsx', 'Renovaciones anuales');
checkFile('components/ExamenesTab.tsx', 'Gestión de exámenes');
checkFile('components/TurnosTab.tsx', 'Configuración de turnos');

console.log('\n🔧 Componentes de utilidad:');
checkFile('components/AlumnoTableRow.tsx', 'Filas de tabla optimizadas');
checkFile('components/LoadingSpinner.tsx', 'Indicador de carga');

console.log('\n🪝 Hooks personalizados:');
checkFile('hooks/useApi.ts', 'Hook para APIs');
checkFile('hooks/useFormValidation.ts', 'Validación de formularios');
checkFile('hooks/useDebounce.ts', 'Debounce para búsquedas');
checkFile('hooks/useAlumnos.ts', 'React Query para alumnos');
checkFile('hooks/useProductos.ts', 'React Query para productos');

console.log('\n⚙️ Utilidades:');
checkFile('utils/constants.ts', 'Constantes centralizadas');
checkFile('utils/validationSchemas.ts', 'Esquemas de validación');

console.log('\n🌐 Context:');
checkFile('context/AppContext.tsx', 'Estado global');

// Verificar package.json
const packageJsonPath = './client/package.json';
if (fs.existsSync(packageJsonPath)) {
  console.log('\n📦 Dependencias instaladas:');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = packageJson.dependencies || {};
  
  const requiredDeps = [
    '@mui/material',
    '@tanstack/react-query',
    'yup',
    'axios',
    'react',
    'typescript'
  ];
  
  requiredDeps.forEach(dep => {
    const installed = dependencies[dep] ? '✅' : '❌';
    console.log(`${installed} ${dep}: ${dependencies[dep] || 'No instalado'}`);
  });
}

// Resumen
console.log('\n📊 RESUMEN:');
const existingFiles = checks.filter(c => c.exists).length;
const totalFiles = checks.length;
const percentage = ((existingFiles / totalFiles) * 100).toFixed(1);

console.log(`✅ Archivos encontrados: ${existingFiles}/${totalFiles}`);
console.log(`📈 Completitud: ${percentage}%`);

if (percentage === '100.0') {
  console.log('\n🎉 ¡Estructura del frontend completa!');
} else {
  console.log('\n⚠️  Algunos archivos están faltando.');
  console.log('\n❌ Archivos faltantes:');
  checks.filter(c => !c.exists).forEach(c => {
    console.log(`   - ${c.file}: ${c.description}`);
  });
}