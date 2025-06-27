const axios = require('axios');

const API_BASE = 'http://localhost:5002/api';
let testResults = [];

const log = (test, status, message = '') => {
  const result = `${status === 'PASS' ? '✅' : '❌'} ${test}: ${message}`;
  console.log(result);
  testResults.push({ test, status, message });
};

const runTests = async () => {
  console.log('🧪 Iniciando tests de funcionalidades...\n');

  try {
    // Test 1: Conexión al servidor
    try {
      await axios.get(`${API_BASE}/alumnos?page=0&limit=5`);
      log('Conexión al servidor', 'PASS', 'Servidor responde correctamente');
    } catch (error) {
      log('Conexión al servidor', 'FAIL', `Error: ${error.message}`);
      return;
    }

    // Test 2: Paginación de alumnos
    try {
      const response = await axios.get(`${API_BASE}/alumnos?page=0&limit=5`);
      if (response.data.data && response.data.total !== undefined) {
        log('Paginación de alumnos', 'PASS', `${response.data.data.length} alumnos cargados`);
      } else {
        log('Paginación de alumnos', 'FAIL', 'Estructura de respuesta incorrecta');
      }
    } catch (error) {
      log('Paginación de alumnos', 'FAIL', error.message);
    }

    // Test 3: Productos y stock
    try {
      const response = await axios.get(`${API_BASE}/productos`);
      log('Carga de productos', 'PASS', `${response.data.length} productos encontrados`);
      
      const stockBajo = await axios.get(`${API_BASE}/productos/stock-bajo`);
      log('Stock bajo', 'PASS', `${stockBajo.data.length} productos con stock bajo`);
    } catch (error) {
      log('Productos y stock', 'FAIL', error.message);
    }

    // Test 4: Turnos
    try {
      const response = await axios.get(`${API_BASE}/turnos`);
      log('Carga de turnos', 'PASS', `${response.data.length} turnos configurados`);
    } catch (error) {
      log('Carga de turnos', 'FAIL', error.message);
    }

    // Test 5: Crear alumno de prueba
    const testAlumno = {
      nombre: 'Test',
      apellido: 'Usuario',
      telefono: '123456789',
      email: 'test@test.com',
      fecha_nacimiento: '1990-01-01',
      grupo: 'Lunes y Miércoles 17:00-18:00',
      cinturon: 'Blanco'
    };

    let alumnoId;
    try {
      const response = await axios.post(`${API_BASE}/alumnos`, testAlumno);
      alumnoId = response.data.id;
      log('Crear alumno', 'PASS', `Alumno creado con ID: ${alumnoId}`);
    } catch (error) {
      if (error.response?.status === 409) {
        log('Crear alumno', 'PASS', 'Validación de duplicados funciona');
      } else {
        log('Crear alumno', 'FAIL', error.message);
      }
    }

    // Test 6: Pago mensual (transacción)
    if (alumnoId) {
      try {
        const pagoData = {
          alumno_id: alumnoId,
          mes: 12,
          año: 2024,
          monto: 25000,
          metodo_pago: 'Efectivo'
        };
        
        await axios.post(`${API_BASE}/mensualidades`, pagoData);
        log('Transacción de pago', 'PASS', 'Pago registrado correctamente');
      } catch (error) {
        log('Transacción de pago', 'FAIL', error.message);
      }
    }

    // Test 7: Estado de pagos
    try {
      const response = await axios.get(`${API_BASE}/estado-pagos/12/2024`);
      log('Estado de pagos', 'PASS', `${response.data.length} registros de pago`);
    } catch (error) {
      log('Estado de pagos', 'FAIL', error.message);
    }

    // Test 8: Renovaciones
    try {
      const response = await axios.get(`${API_BASE}/renovaciones/2025`);
      log('Renovaciones', 'PASS', `${response.data.length} renovaciones para 2025`);
    } catch (error) {
      log('Renovaciones', 'FAIL', error.message);
    }

    // Test 9: Exámenes
    try {
      const response = await axios.get(`${API_BASE}/examenes`);
      log('Exámenes', 'PASS', `${response.data.length} exámenes registrados`);
    } catch (error) {
      log('Exámenes', 'FAIL', error.message);
    }

    // Test 10: Pedidos de indumentaria
    try {
      const response = await axios.get(`${API_BASE}/pedidos-indumentaria`);
      log('Pedidos indumentaria', 'PASS', `${response.data.length} pedidos registrados`);
    } catch (error) {
      log('Pedidos indumentaria', 'FAIL', error.message);
    }

    // Test 11: Crear producto de prueba
    try {
      const testProducto = {
        tipo: 'Camiseta Test',
        talle: 'M',
        precio: 15000,
        stock: 10,
        stock_minimo: 2
      };
      
      const response = await axios.post(`${API_BASE}/productos`, testProducto);
      log('Crear producto', 'PASS', `Producto creado con ID: ${response.data.id}`);
    } catch (error) {
      log('Crear producto', 'FAIL', error.message);
    }

    // Resumen final
    console.log('\n📊 RESUMEN DE TESTS:');
    const passed = testResults.filter(r => r.status === 'PASS').length;
    const failed = testResults.filter(r => r.status === 'FAIL').length;
    
    console.log(`✅ Tests pasados: ${passed}`);
    console.log(`❌ Tests fallidos: ${failed}`);
    console.log(`📈 Porcentaje de éxito: ${((passed / testResults.length) * 100).toFixed(1)}%`);

    if (failed === 0) {
      console.log('\n🎉 ¡Todas las funcionalidades están trabajando correctamente!');
    } else {
      console.log('\n⚠️  Hay algunas funcionalidades que requieren atención.');
    }

  } catch (error) {
    console.error('❌ Error general en los tests:', error.message);
  }
};

// Verificar si el servidor está corriendo
const checkServer = async () => {
  try {
    await axios.get(`${API_BASE}/alumnos?page=0&limit=1`);
    console.log('🚀 Servidor detectado, iniciando tests...\n');
    runTests();
  } catch (error) {
    console.log('❌ Servidor no está corriendo en puerto 5002');
    console.log('💡 Para ejecutar los tests:');
    console.log('   1. cd server');
    console.log('   2. node index.js');
    console.log('   3. En otra terminal: node test-api.js');
  }
};

checkServer();