const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🗄️  Verificando base de datos...\n');

const dbPath = './server/krav_maga.db';
const db = new sqlite3.Database(dbPath);

const tests = [];
const log = (test, status, message = '') => {
  const result = `${status === 'PASS' ? '✅' : '❌'} ${test}: ${message}`;
  console.log(result);
  tests.push({ test, status, message });
};

const runDatabaseTests = () => {
  // Test 1: Verificar tablas principales
  const requiredTables = [
    'alumnos', 'mensualidades', 'productos', 'pedidos_indumentaria',
    'renovaciones', 'examenes', 'turnos', 'asistencias', 'tarifas'
  ];

  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      log('Conexión a BD', 'FAIL', err.message);
      return;
    }

    log('Conexión a BD', 'PASS', 'Base de datos accesible');

    const tableNames = tables.map(t => t.name);
    
    requiredTables.forEach(tableName => {
      if (tableNames.includes(tableName)) {
        log(`Tabla ${tableName}`, 'PASS', 'Existe');
      } else {
        log(`Tabla ${tableName}`, 'FAIL', 'No existe');
      }
    });

    // Test 2: Verificar índices
    db.all("SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'", (err, indexes) => {
      if (err) {
        log('Índices', 'FAIL', err.message);
      } else {
        log('Índices optimización', 'PASS', `${indexes.length} índices encontrados`);
      }

      // Test 3: Contar registros en tablas principales
      const countQueries = [
        { table: 'alumnos', condition: 'WHERE activo = 1' },
        { table: 'productos', condition: '' },
        { table: 'turnos', condition: '' },
        { table: 'mensualidades', condition: '' }
      ];

      let completedQueries = 0;
      
      countQueries.forEach(({ table, condition }) => {
        db.get(`SELECT COUNT(*) as count FROM ${table} ${condition}`, (err, result) => {
          if (err) {
            log(`Datos en ${table}`, 'FAIL', err.message);
          } else {
            log(`Datos en ${table}`, 'PASS', `${result.count} registros`);
          }
          
          completedQueries++;
          if (completedQueries === countQueries.length) {
            // Test 4: Verificar integridad referencial
            testReferentialIntegrity();
          }
        });
      });
    });
  });
};

const testReferentialIntegrity = () => {
  console.log('\n🔗 Verificando integridad referencial:');
  
  // Verificar que no hay mensualidades huérfanas
  db.get(`
    SELECT COUNT(*) as count 
    FROM mensualidades m 
    LEFT JOIN alumnos a ON m.alumno_id = a.id 
    WHERE a.id IS NULL
  `, (err, result) => {
    if (err) {
      log('Integridad mensualidades', 'FAIL', err.message);
    } else if (result.count === 0) {
      log('Integridad mensualidades', 'PASS', 'Sin registros huérfanos');
    } else {
      log('Integridad mensualidades', 'FAIL', `${result.count} registros huérfanos`);
    }

    // Verificar que no hay pedidos huérfanos
    db.get(`
      SELECT COUNT(*) as count 
      FROM pedidos_indumentaria p 
      LEFT JOIN alumnos a ON p.alumno_id = a.id 
      LEFT JOIN productos pr ON p.producto_id = pr.id
      WHERE a.id IS NULL OR pr.id IS NULL
    `, (err, result) => {
      if (err) {
        log('Integridad pedidos', 'FAIL', err.message);
      } else if (result.count === 0) {
        log('Integridad pedidos', 'PASS', 'Sin registros huérfanos');
      } else {
        log('Integridad pedidos', 'FAIL', `${result.count} registros huérfanos`);
      }

      // Test final: Verificar productos con stock negativo
      db.get(`SELECT COUNT(*) as count FROM productos WHERE stock < 0`, (err, result) => {
        if (err) {
          log('Stock negativo', 'FAIL', err.message);
        } else if (result.count === 0) {
          log('Stock negativo', 'PASS', 'Sin stock negativo');
        } else {
          log('Stock negativo', 'FAIL', `${result.count} productos con stock negativo`);
        }

        showSummary();
        db.close();
      });
    });
  });
};

const showSummary = () => {
  console.log('\n📊 RESUMEN DE BASE DE DATOS:');
  const passed = tests.filter(t => t.status === 'PASS').length;
  const failed = tests.filter(t => t.status === 'FAIL').length;
  
  console.log(`✅ Tests pasados: ${passed}`);
  console.log(`❌ Tests fallidos: ${failed}`);
  console.log(`📈 Integridad: ${((passed / tests.length) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 ¡Base de datos en perfecto estado!');
  } else {
    console.log('\n⚠️  La base de datos requiere atención.');
  }
};

// Verificar si existe la base de datos
const fs = require('fs');
if (fs.existsSync(dbPath)) {
  runDatabaseTests();
} else {
  console.log('❌ Base de datos no encontrada en:', dbPath);
  console.log('💡 Asegúrate de que el servidor se haya ejecutado al menos una vez.');
}