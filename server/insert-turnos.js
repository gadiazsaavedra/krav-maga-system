const db = require('./database');

// Insertar turnos iniciales
db.get('SELECT COUNT(*) as count FROM turnos', (err, row) => {
  if (err) {
    console.error('Error verificando turnos:', err.message);
    return;
  }
  
  if (row.count === 0) {
    console.log('Insertando turnos iniciales...');
    
    db.run(`INSERT INTO turnos (dia, hora_inicio, hora_fin, niveles) VALUES 
      ('Lunes', '17:00', '18:00', '["Blanco"]'),
      ('Lunes', '18:00', '19:00', '["Amarillo"]'),
      ('Lunes', '19:00', '20:00', '["Blanco"]'),
      ('Lunes', '20:00', '21:00', '["Naranja","Verde"]'),
      ('Miércoles', '17:00', '18:00', '["Blanco"]'),
      ('Miércoles', '18:00', '19:00', '["Amarillo"]'),
      ('Miércoles', '19:00', '20:00', '["Blanco"]'),
      ('Miércoles', '20:00', '21:00', '["Naranja","Verde"]'),
      ('Martes', '13:00', '14:00', '["Blanco","Amarillo"]'),
      ('Jueves', '13:00', '14:00', '["Blanco","Amarillo"]'),
      ('Viernes', '19:00', '21:00', '["Blanco","Amarillo","Naranja"]')
    `, function(err) {
      if (err) {
        console.error('Error insertando turnos:', err.message);
      } else {
        console.log(`Insertados ${this.changes} turnos`);
      }
      db.close();
    });
  } else {
    console.log(`Ya existen ${row.count} turnos en la base de datos`);
    db.close();
  }
});