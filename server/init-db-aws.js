const db = require('./database');

async function initializeDatabase() {
  try {
    console.log('🔧 Inicializando base de datos...');
    
    // Crear tablas si no existen
    await db.run(`
      CREATE TABLE IF NOT EXISTS alumnos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        telefono TEXT,
        email TEXT,
        fecha_nacimiento DATE,
        grupo TEXT,
        cinturon TEXT DEFAULT 'Blanco',
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
        activo INTEGER DEFAULT 1
      )
    `);
    
    await db.run(`
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        talle TEXT NOT NULL,
        precio REAL NOT NULL,
        stock INTEGER DEFAULT 0,
        stock_minimo INTEGER DEFAULT 5
      )
    `);
    
    // Insertar datos de ejemplo si no existen
    const alumnosCount = await db.get('SELECT COUNT(*) as count FROM alumnos');
    if (alumnosCount.count === 0) {
      console.log('📊 Insertando alumnos de ejemplo...');
      
      const alumnos = [
        ['Juan', 'Pérez', '11-1234-5678', 'juan@email.com', '1990-05-15', 'Lunes y Miércoles 19:00-20:00', 'Amarillo'],
        ['María', 'González', '11-2345-6789', 'maria@email.com', '1985-08-22', 'Lunes y Miércoles 20:00-21:00', 'Verde'],
        ['Carlos', 'Rodríguez', '11-3456-7890', 'carlos@email.com', '1992-03-10', 'Lunes y Miércoles 17:00-18:00', 'Blanco'],
        ['Ana', 'López', '11-4567-8901', 'ana@email.com', '1988-12-05', 'Viernes 19:10-21:00', 'Azul'],
        ['Pedro', 'Martín', '11-5678-9012', 'pedro@email.com', '1995-07-18', 'Lunes y Miércoles 18:00-19:00', 'Naranja']
      ];
      
      for (const alumno of alumnos) {
        await db.run(
          `INSERT INTO alumnos (nombre, apellido, telefono, email, fecha_nacimiento, grupo, cinturon, fecha_registro, activo)
           VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), 1)`,
          alumno
        );
      }
    }
    
    const productosCount = await db.get('SELECT COUNT(*) as count FROM productos');
    if (productosCount.count === 0) {
      console.log('🛍️ Insertando productos de ejemplo...');
      
      const productos = [
        ['Remera', 'M', 2500, 15, 5],
        ['Remera', 'L', 2500, 8, 5],
        ['Short', 'M', 3000, 12, 5],
        ['Short', 'L', 3000, 3, 5],
        ['Guantes', 'Único', 4500, 2, 3]
      ];
      
      for (const producto of productos) {
        await db.run(
          'INSERT INTO productos (tipo, talle, precio, stock, stock_minimo) VALUES (?, ?, ?, ?, ?)',
          producto
        );
      }
    }
    
    console.log('✅ Base de datos inicializada correctamente');
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Inicialización completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };