const db = require('./database');

// Datos de ejemplo para poblar la base de datos
const alumnos = [
  { nombre: 'Juan', apellido: 'Pérez', telefono: '11-1234-5678', email: 'juan.perez@email.com', fecha_nacimiento: '1990-05-15', grupo: 'Adultos Principiantes', cinturon: 'Amarillo' },
  { nombre: 'María', apellido: 'González', telefono: '11-2345-6789', email: 'maria.gonzalez@email.com', fecha_nacimiento: '1985-08-22', grupo: 'Adultos Avanzados', cinturon: 'Verde' },
  { nombre: 'Carlos', apellido: 'Rodríguez', telefono: '11-3456-7890', email: 'carlos.rodriguez@email.com', fecha_nacimiento: '1992-03-10', grupo: 'Adultos Principiantes', cinturon: 'Naranja' },
  { nombre: 'Ana', apellido: 'Martínez', telefono: '11-4567-8901', email: 'ana.martinez@email.com', fecha_nacimiento: '1988-12-05', grupo: 'Adultos Avanzados', cinturon: 'Azul' },
  { nombre: 'Luis', apellido: 'López', telefono: '11-5678-9012', email: 'luis.lopez@email.com', fecha_nacimiento: '1995-07-18', grupo: 'Jóvenes', cinturon: 'Blanco' },
  { nombre: 'Sofia', apellido: 'Fernández', telefono: '11-6789-0123', email: 'sofia.fernandez@email.com', fecha_nacimiento: '1993-11-30', grupo: 'Adultos Principiantes', cinturon: 'Amarillo' },
  { nombre: 'Diego', apellido: 'Sánchez', telefono: '11-7890-1234', email: 'diego.sanchez@email.com', fecha_nacimiento: '1987-04-25', grupo: 'Adultos Avanzados', cinturon: 'Marrón' },
  { nombre: 'Valentina', apellido: 'Torres', telefono: '11-8901-2345', email: 'valentina.torres@email.com', fecha_nacimiento: '1991-09-12', grupo: 'Adultos Principiantes', cinturon: 'Verde' }
];

console.log('Poblando base de datos con datos de ejemplo...');

db.serialize(() => {
  // Insertar alumnos
  const insertAlumno = db.prepare('INSERT INTO alumnos (nombre, apellido, telefono, email, fecha_nacimiento, grupo, cinturon) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
  alumnos.forEach(alumno => {
    insertAlumno.run(alumno.nombre, alumno.apellido, alumno.telefono, alumno.email, alumno.fecha_nacimiento, alumno.grupo, alumno.cinturon);
  });
  insertAlumno.finalize();

  // Insertar mensualidades (algunos pagados, otros pendientes)
  const insertMensualidad = db.prepare('INSERT INTO mensualidades (alumno_id, mes, año, monto, fecha_pago, metodo_pago, pagado) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  for (let i = 1; i <= 8; i++) {
    const pagado = Math.random() > 0.3; // 70% pagados
    insertMensualidad.run(
      i, 
      currentMonth, 
      currentYear, 
      15000, 
      pagado ? new Date().toISOString().split('T')[0] : null,
      pagado ? (Math.random() > 0.5 ? 'Efectivo' : 'Transferencia') : null,
      pagado ? 1 : 0
    );
  }
  insertMensualidad.finalize();

  // Insertar pedidos de indumentaria
  const insertPedido = db.prepare('INSERT INTO pedidos_indumentaria (alumno_id, producto_id, cantidad, estado, fecha_pedido, monto, pagado) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
  const pedidos = [
    { alumno_id: 1, producto_id: 2, cantidad: 1, estado: 'Entregado', monto: 15000, pagado: 1 },
    { alumno_id: 2, producto_id: 15, cantidad: 1, estado: 'Recibido en Club', monto: 12000, pagado: 1 },
    { alumno_id: 3, producto_id: 6, cantidad: 1, estado: 'Pedido', monto: 8000, pagado: 0 },
    { alumno_id: 4, producto_id: 10, cantidad: 1, estado: 'Entregado', monto: 5000, pagado: 1 },
    { alumno_id: 5, producto_id: 25, cantidad: 1, estado: 'Pedido', monto: 12000, pagado: 0 }
  ];

  pedidos.forEach(pedido => {
    insertPedido.run(pedido.alumno_id, pedido.producto_id, pedido.cantidad, pedido.estado, new Date().toISOString().split('T')[0], pedido.monto, pedido.pagado);
  });
  insertPedido.finalize();

  // Insertar renovaciones
  const insertRenovacion = db.prepare('INSERT INTO renovaciones (alumno_id, año, pago_realizado, formulario_entregado, apto_fisico_entregado, fecha_pago, monto) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
  for (let i = 1; i <= 8; i++) {
    const pago = Math.random() > 0.4;
    const formulario = Math.random() > 0.3;
    const apto = Math.random() > 0.5;
    
    insertRenovacion.run(
      i, 
      currentYear, 
      pago ? 1 : 0,
      formulario ? 1 : 0,
      apto ? 1 : 0,
      pago ? new Date().toISOString().split('T')[0] : null,
      pago ? 25000 : null
    );
  }
  insertRenovacion.finalize();

  // Insertar exámenes
  const insertExamen = db.prepare('INSERT INTO examenes (alumno_id, cinturon_actual, cinturon_objetivo, fecha_examen, aprobado, pagado, monto, fecha_pago) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  
  const examenes = [
    { alumno_id: 1, cinturon_actual: 'Blanco', cinturon_objetivo: 'Amarillo', aprobado: 1, pagado: 1, monto: 8000 },
    { alumno_id: 3, cinturon_actual: 'Amarillo', cinturon_objetivo: 'Naranja', aprobado: 1, pagado: 1, monto: 8000 },
    { alumno_id: 5, cinturon_actual: 'Blanco', cinturon_objetivo: 'Amarillo', aprobado: 0, pagado: 1, monto: 8000 },
    { alumno_id: 6, cinturon_actual: 'Blanco', cinturon_objetivo: 'Amarillo', aprobado: 1, pagado: 0, monto: 8000 }
  ];

  examenes.forEach(examen => {
    const fechaExamen = new Date();
    fechaExamen.setDate(fechaExamen.getDate() - Math.floor(Math.random() * 30));
    
    insertExamen.run(
      examen.alumno_id,
      examen.cinturon_actual,
      examen.cinturon_objetivo,
      fechaExamen.toISOString().split('T')[0],
      examen.aprobado,
      examen.pagado,
      examen.monto,
      examen.pagado ? fechaExamen.toISOString().split('T')[0] : null
    );
  });
  insertExamen.finalize();

  console.log('✅ Base de datos poblada exitosamente!');
  console.log('📊 Datos creados:');
  console.log('   - 8 Alumnos con diferentes cinturones');
  console.log('   - Mensualidades del mes actual (algunas pagas, otras pendientes)');
  console.log('   - 5 Pedidos de indumentaria en diferentes estados');
  console.log('   - Renovaciones anuales con diferentes niveles de completitud');
  console.log('   - 4 Exámenes con diferentes estados');
  console.log('');
  console.log('🌐 Ahora puedes ver el sistema funcionando en: http://localhost:3000');
  
  process.exit(0);
});