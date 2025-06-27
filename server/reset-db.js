const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Eliminar la base de datos existente
const dbPath = path.join(__dirname, 'krav_maga.db');
try {
  fs.unlinkSync(dbPath);
  console.log('Base de datos eliminada');
} catch (err) {
  console.log('No se encontró base de datos existente o no se pudo eliminar');
}

// Crear nueva base de datos
const db = new sqlite3.Database(dbPath);

// Inicializar tablas
db.serialize(() => {
  // Tabla de alumnos
  db.run(`CREATE TABLE IF NOT EXISTS alumnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    telefono TEXT,
    email TEXT,
    fecha_nacimiento DATE,
    grupo TEXT,
    cinturon TEXT DEFAULT 'Blanco',
    fecha_registro DATE DEFAULT CURRENT_DATE,
    activo BOOLEAN DEFAULT 1
  )`);

  // Tabla de mensualidades
  db.run(`CREATE TABLE IF NOT EXISTS mensualidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno_id INTEGER,
    mes INTEGER,
    año INTEGER,
    monto REAL,
    fecha_pago DATE,
    metodo_pago TEXT,
    pagado BOOLEAN DEFAULT 0,
    FOREIGN KEY (alumno_id) REFERENCES alumnos (id)
  )`);

  // Tabla de productos
  db.run(`CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    talle TEXT,
    precio REAL NOT NULL
  )`);

  // Tabla de pedidos de indumentaria
  db.run(`CREATE TABLE IF NOT EXISTS pedidos_indumentaria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno_id INTEGER,
    producto_id INTEGER,
    cantidad INTEGER DEFAULT 1,
    estado TEXT DEFAULT 'Pedido',
    fecha_pedido DATE DEFAULT CURRENT_DATE,
    fecha_entrega DATE,
    monto REAL,
    pagado BOOLEAN DEFAULT 0,
    FOREIGN KEY (alumno_id) REFERENCES alumnos (id),
    FOREIGN KEY (producto_id) REFERENCES productos (id)
  )`);

  // Tabla de renovaciones anuales
  db.run(`CREATE TABLE IF NOT EXISTS renovaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno_id INTEGER,
    año INTEGER,
    pago_realizado BOOLEAN DEFAULT 0,
    formulario_entregado BOOLEAN DEFAULT 0,
    apto_fisico_entregado BOOLEAN DEFAULT 0,
    fecha_pago DATE,
    monto REAL,
    FOREIGN KEY (alumno_id) REFERENCES alumnos (id)
  )`);

  // Tabla de exámenes
  db.run(`CREATE TABLE IF NOT EXISTS examenes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno_id INTEGER,
    cinturon_actual TEXT,
    cinturon_objetivo TEXT,
    fecha_examen DATE,
    aprobado BOOLEAN,
    pagado BOOLEAN DEFAULT 0,
    monto REAL,
    fecha_pago DATE,
    FOREIGN KEY (alumno_id) REFERENCES alumnos (id)
  )`);

  // Insertar productos básicos
  db.run(`INSERT OR IGNORE INTO productos (tipo, talle, precio) VALUES 
    ('Kimono', 'S', 15000),
    ('Kimono', 'M', 15000),
    ('Kimono', 'L', 15000),
    ('Kimono', 'XL', 15000),
    ('Pantalón', 'S', 8000),
    ('Pantalón', 'M', 8000),
    ('Pantalón', 'L', 8000),
    ('Pantalón', 'XL', 8000),
    ('Remera', 'S', 5000),
    ('Remera', 'M', 5000),
    ('Remera', 'L', 5000),
    ('Remera', 'XL', 5000),
    ('Zapatillas', '29', 12000),
    ('Zapatillas', '30', 12000),
    ('Zapatillas', '31', 12000),
    ('Zapatillas', '32', 12000),
    ('Zapatillas', '33', 12000),
    ('Zapatillas', '34', 12000),
    ('Zapatillas', '35', 12000),
    ('Zapatillas', '36', 12000),
    ('Zapatillas', '37', 12000),
    ('Zapatillas', '38', 12000),
    ('Zapatillas', '39', 12000),
    ('Zapatillas', '40', 12000),
    ('Zapatillas', '41', 12000),
    ('Zapatillas', '42', 12000),
    ('Zapatillas', '43', 12000),
    ('Zapatillas', '44', 12000),
    ('Zapatillas', '45', 12000),
    ('Guantes Box', 'S', 7000),
    ('Guantes Box', 'M', 7000),
    ('Guantes Box', 'L', 7000),
    ('Guantes Box', 'XL', 7000)
  `);

  // Insertar alumnos de ejemplo
  db.run(`INSERT INTO alumnos (nombre, apellido, telefono, email, fecha_nacimiento, grupo, cinturon) VALUES 
    ('Juan', 'Pérez', '11-1234-5678', 'juan@example.com', '1990-05-15', 'Adultos', 'Amarillo'),
    ('María', 'González', '11-2345-6789', 'maria@example.com', '1985-08-22', 'Adultos', 'Verde'),
    ('Carlos', 'Rodríguez', '11-3456-7890', 'carlos@example.com', '1992-03-10', 'Jóvenes', 'Blanco'),
    ('Ana', 'Martínez', '11-4567-8901', 'ana@example.com', '1988-12-05', 'Adultos', 'Azul')
  `);

  // Insertar mensualidades
  const currentMonth = 6; // Junio
  const currentYear = 2025;
  
  db.run(`INSERT INTO mensualidades (alumno_id, mes, año, monto, fecha_pago, metodo_pago, pagado) VALUES 
    (1, ${currentMonth}, ${currentYear}, 15000, '2025-06-01', 'Efectivo', 1),
    (2, ${currentMonth}, ${currentYear}, 15000, '2025-06-05', 'Transferencia', 1)
  `);

  console.log('✅ Base de datos reiniciada y poblada con datos de ejemplo');
});

db.close();