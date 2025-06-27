const db = require('./database');

// Crear índices para optimizar consultas
const createIndexes = () => {
  console.log('Creando índices para optimizar rendimiento...');
  
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_alumnos_activo ON alumnos(activo)',
    'CREATE INDEX IF NOT EXISTS idx_alumnos_cinturon ON alumnos(cinturon)',
    'CREATE INDEX IF NOT EXISTS idx_asistencias_alumno_fecha ON asistencias(alumno_id, fecha)',
    'CREATE INDEX IF NOT EXISTS idx_asistencias_presente ON asistencias(presente)',
    'CREATE INDEX IF NOT EXISTS idx_mensualidades_alumno_mes_año ON mensualidades(alumno_id, mes, año)',
    'CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos_indumentaria(estado)',
    'CREATE INDEX IF NOT EXISTS idx_productos_stock ON productos(stock, stock_minimo)'
  ];
  
  indexes.forEach((indexSQL, i) => {
    db.run(indexSQL, (err) => {
      if (err) {
        console.error(`Error creando índice ${i + 1}:`, err.message);
      } else {
        console.log(`Índice ${i + 1} creado exitosamente`);
      }
    });
  });
  
  console.log('Optimización de base de datos completada');
};

createIndexes();