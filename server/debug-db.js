const db = require('./database');

console.log('=== DEBUGGING BASE DE DATOS ===');

// Ver todas las mensualidades
db.all('SELECT * FROM mensualidades', (err, rows) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('\n📋 TODAS LAS MENSUALIDADES:');
  console.table(rows);
});

// Ver estado de pagos del mes actual
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

db.all(`
  SELECT 
    a.id, a.nombre, a.apellido,
    m.mes, m.año, m.pagado, m.monto, m.fecha_pago, m.metodo_pago,
    CASE WHEN m.pagado = 1 THEN 'Pagado' ELSE 'Pendiente' END as estado
  FROM alumnos a
  LEFT JOIN mensualidades m ON a.id = m.alumno_id AND m.mes = ? AND m.año = ?
  WHERE a.activo = 1
  ORDER BY a.apellido, a.nombre
`, [currentMonth, currentYear], (err, rows) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log(`\n💰 ESTADO PAGOS ${currentMonth}/${currentYear}:`);
  console.table(rows);
  
  process.exit(0);
});