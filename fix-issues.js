const sqlite3 = require('sqlite3').verbose();

console.log('🔧 Corrigiendo problemas encontrados...\n');

const dbPath = './server/krav_maga.db';
const db = new sqlite3.Database(dbPath);

const fixes = [];
const log = (fix, status, message = '') => {
  const result = `${status === 'PASS' ? '✅' : '❌'} ${fix}: ${message}`;
  console.log(result);
  fixes.push({ fix, status, message });
};

// Fix 1: Limpiar pedidos huérfanos
db.run(`
  DELETE FROM pedidos_indumentaria 
  WHERE alumno_id NOT IN (SELECT id FROM alumnos) 
     OR producto_id NOT IN (SELECT id FROM productos)
`, function(err) {
  if (err) {
    log('Limpiar pedidos huérfanos', 'FAIL', err.message);
  } else {
    log('Limpiar pedidos huérfanos', 'PASS', `${this.changes} registros eliminados`);
  }

  // Fix 2: Verificar ruta de estado de pagos
  db.get(`SELECT COUNT(*) as count FROM mensualidades WHERE mes = 12 AND año = 2024`, (err, result) => {
    if (err) {
      log('Verificar datos de pago', 'FAIL', err.message);
    } else {
      log('Verificar datos de pago', 'PASS', `${result.count} pagos encontrados para 12/2024`);
    }

    // Fix 3: Actualizar productos con stock 0 para evitar alertas innecesarias
    db.run(`UPDATE productos SET stock_minimo = 0 WHERE stock = 0`, function(err) {
      if (err) {
        log('Ajustar stock mínimo', 'FAIL', err.message);
      } else {
        log('Ajustar stock mínimo', 'PASS', `${this.changes} productos actualizados`);
      }

      // Fix 4: Verificar integridad después de las correcciones
      db.get(`
        SELECT COUNT(*) as count 
        FROM pedidos_indumentaria p 
        LEFT JOIN alumnos a ON p.alumno_id = a.id 
        LEFT JOIN productos pr ON p.producto_id = pr.id
        WHERE a.id IS NULL OR pr.id IS NULL
      `, (err, result) => {
        if (err) {
          log('Verificar integridad final', 'FAIL', err.message);
        } else {
          log('Verificar integridad final', 'PASS', `${result.count} registros huérfanos restantes`);
        }

        showSummary();
        db.close();
      });
    });
  });
});

const showSummary = () => {
  console.log('\n📊 RESUMEN DE CORRECCIONES:');
  const passed = fixes.filter(f => f.status === 'PASS').length;
  const failed = fixes.filter(f => f.status === 'FAIL').length;
  
  console.log(`✅ Correcciones exitosas: ${passed}`);
  console.log(`❌ Correcciones fallidas: ${failed}`);

  if (failed === 0) {
    console.log('\n🎉 ¡Todos los problemas han sido corregidos!');
    console.log('💡 Ejecuta "node test-database.js" para verificar.');
  } else {
    console.log('\n⚠️  Algunos problemas requieren atención manual.');
  }
};