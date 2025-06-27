const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'krav_maga.db');
const db = new sqlite3.Database(dbPath);

// Inicializar tablas
db.serialize(() => {
  // Tabla de tarifas
  db.run(`CREATE TABLE IF NOT EXISTS tarifas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    valor REAL NOT NULL,
    descripcion TEXT
  )`);
  
  // Insertar tarifas iniciales si no existen
  db.get('SELECT COUNT(*) as count FROM tarifas', (err, row) => {
    if (err || row.count === 0) {
      db.run(`INSERT INTO tarifas (nombre, valor, descripcion) VALUES 
        ('regular', 58000, 'Alumnos que nunca dejaron de pagar'),
        ('nueva', 64000, 'Alumnos nuevos o que han dejado de pagar')
      `);
    }
  });

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
    precio REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5
  )`);
  
  // Agregar columnas si no existen
  db.run(`ALTER TABLE productos ADD COLUMN stock INTEGER DEFAULT 0`, (err) => {});
  db.run(`ALTER TABLE productos ADD COLUMN stock_minimo INTEGER DEFAULT 5`, (err) => {});

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

  // Tabla de turnos
  db.run(`CREATE TABLE IF NOT EXISTS turnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dia TEXT NOT NULL,
    hora_inicio TEXT NOT NULL,
    hora_fin TEXT NOT NULL,
    niveles TEXT
  )`);
  
  // Tabla de asistencias
  db.run(`CREATE TABLE IF NOT EXISTS asistencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno_id INTEGER,
    turno_id INTEGER,
    fecha DATE NOT NULL,
    presente BOOLEAN DEFAULT 0,
    FOREIGN KEY (alumno_id) REFERENCES alumnos (id),
    FOREIGN KEY (turno_id) REFERENCES turnos (id)
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
});

module.exports = db;