const db = require('./database');

// Crear tablas para turnos y asistencias
db.serialize(() => {
  // Tabla de turnos
  db.run(`CREATE TABLE IF NOT EXISTS turnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dia TEXT NOT NULL,
    hora_inicio TEXT NOT NULL,
    hora_fin TEXT NOT NULL,
    niveles TEXT NOT NULL
  )`);

  // Tabla de asignación de alumnos a turnos
  db.run(`CREATE TABLE IF NOT EXISTS alumno_turno (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno_id INTEGER,
    turno_id INTEGER,
    FOREIGN KEY (alumno_id) REFERENCES alumnos (id),
    FOREIGN KEY (turno_id) REFERENCES turnos (id)
  )`);

  // Tabla de asistencias
  db.run(`CREATE TABLE IF NOT EXISTS asistencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno_id INTEGER,
    turno_id INTEGER,
    fecha DATE,
    presente BOOLEAN DEFAULT 0,
    FOREIGN KEY (alumno_id) REFERENCES alumnos (id),
    FOREIGN KEY (turno_id) REFERENCES turnos (id)
  )`);

  // Insertar turnos predefinidos
  db.run(`INSERT OR IGNORE INTO turnos (dia, hora_inicio, hora_fin, niveles) VALUES 
    ('Lunes', '17:00', '18:00', 'Blanco'),
    ('Lunes', '18:00', '19:00', 'Amarillo'),
    ('Lunes', '19:00', '20:00', 'Blanco'),
    ('Lunes', '20:00', '21:00', 'Naranja,Verde'),
    ('Miércoles', '17:00', '18:00', 'Blanco'),
    ('Miércoles', '18:00', '19:00', 'Amarillo'),
    ('Miércoles', '19:00', '20:00', 'Blanco'),
    ('Miércoles', '20:00', '21:00', 'Naranja,Verde'),
    ('Martes', '13:00', '14:00', 'Blanco,Amarillo'),
    ('Jueves', '13:00', '14:00', 'Blanco,Amarillo'),
    ('Viernes', '19:00', '21:00', 'Blanco,Amarillo,Naranja')
  `);

  console.log('✅ Tablas de turnos y asistencias creadas');
});

module.exports = db;