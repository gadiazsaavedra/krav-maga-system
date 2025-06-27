const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const db = require('./database');
const { runTransaction } = require('./utils/dbTransaction');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// RUTAS DE ALUMNOS
app.get('/api/alumnos', (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const orderBy = req.query.orderBy || 'apellido';
  const order = req.query.order || 'asc';
  const offset = page * limit;
  
  // Validar orderBy para seguridad
  const validOrderBy = ['nombre', 'apellido', 'cinturon'].includes(orderBy) ? orderBy : 'apellido';
  const validOrder = ['asc', 'desc'].includes(order) ? order : 'asc';
  
  // Contar total de registros
  db.get('SELECT COUNT(*) as total FROM alumnos WHERE activo = 1', (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Obtener registros paginados y ordenados
    const query = `
      SELECT a.*, 
        COALESCE(COUNT(CASE WHEN ast.presente = 0 AND ast.fecha >= date('now', '-30 day') THEN 1 END), 0) as inasistencias_recientes
      FROM alumnos a 
      LEFT JOIN asistencias ast ON a.id = ast.alumno_id
      WHERE a.activo = 1 
      GROUP BY a.id
      ORDER BY ${validOrderBy === 'cinturon' ? 
        (validOrder === 'asc' ? 
          "CASE a.cinturon WHEN 'Blanco' THEN 1 WHEN 'Amarillo' THEN 2 WHEN 'Naranja' THEN 3 WHEN 'Verde' THEN 4 WHEN 'Azul' THEN 5 WHEN 'Marrón' THEN 6 WHEN 'Negro' THEN 7 ELSE 8 END" :
          "CASE a.cinturon WHEN 'Negro' THEN 1 WHEN 'Marrón' THEN 2 WHEN 'Azul' THEN 3 WHEN 'Verde' THEN 4 WHEN 'Naranja' THEN 5 WHEN 'Amarillo' THEN 6 WHEN 'Blanco' THEN 7 ELSE 8 END") :
        `a.${validOrderBy} ${validOrder.toUpperCase()}`}
      LIMIT ? OFFSET ?
    `;
    console.log('SQL Query:', query);
    console.log('Params:', [limit, offset]);
    
    db.all(query, [limit, offset], (err, rows) => {
      if (err) {
        console.error('SQL Error:', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('Results count:', rows.length);
      console.log('First result:', rows[0]);
      res.json({
        data: rows,
        total: countResult.total,
        page,
        limit
      });
    });
  });
});

app.post('/api/alumnos', (req, res) => {
  const { nombre, apellido, telefono, email, fecha_nacimiento, grupo } = req.body;
  
  // Verificar si ya existe un alumno con el mismo nombre y apellido (activo o inactivo)
  db.get(
    'SELECT id, activo FROM alumnos WHERE LOWER(nombre) = LOWER(?) AND LOWER(apellido) = LOWER(?)',
    [nombre, apellido],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (row) {
        // Ya existe un alumno con ese nombre y apellido
        const mensaje = row.activo === 1 
          ? 'Ya existe un alumno activo con ese nombre y apellido' 
          : 'Ya existe un alumno inactivo con ese nombre y apellido';
        
        return res.status(409).json({ 
          error: mensaje,
          alumnoExistente: row.id,
          alumnoInactivo: row.activo === 0
        });
      }
      
      // Si no existe, crear el nuevo alumno
      db.run(
        'INSERT INTO alumnos (nombre, apellido, telefono, email, fecha_nacimiento, grupo) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, apellido, telefono, email, fecha_nacimiento, grupo],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ id: this.lastID, message: 'Alumno creado exitosamente' });
        }
      );
    }
  );
});

app.put('/api/alumnos/:id', (req, res) => {
  const { nombre, apellido, telefono, email, fecha_nacimiento, grupo, cinturon, activo } = req.body;
  
  // Si se está marcando como inactivo (eliminando)
  if (activo === 0) {
    db.run(
      'UPDATE alumnos SET activo = 0 WHERE id = ?',
      [req.params.id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Alumno eliminado exitosamente' });
      }
    );
  } else {
    // Actualización normal
    db.run(
      'UPDATE alumnos SET nombre = ?, apellido = ?, telefono = ?, email = ?, fecha_nacimiento = ?, grupo = ?, cinturon = ? WHERE id = ?',
      [nombre, apellido, telefono, email, fecha_nacimiento, grupo, cinturon, req.params.id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Alumno actualizado exitosamente' });
      }
    );
  }
});

// RUTAS DE TARIFAS
app.get('/api/tarifas', (req, res) => {
  db.all('SELECT * FROM tarifas', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put('/api/tarifas/:id', (req, res) => {
  const { valor } = req.body;
  db.run(
    'UPDATE tarifas SET valor = ? WHERE id = ?',
    [valor, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Tarifa actualizada exitosamente' });
    }
  );
});

// RUTAS DE MENSUALIDADES
app.get('/api/mensualidades/:mes/:año', (req, res) => {
  const { mes, año } = req.params;
  db.all(`
    SELECT m.*, a.nombre, a.apellido 
    FROM mensualidades m 
    JOIN alumnos a ON m.alumno_id = a.id 
    WHERE m.mes = ? AND m.año = ?
    ORDER BY a.apellido, a.nombre
  `, [mes, año], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/mensualidades', async (req, res) => {
  const { alumno_id, mes, año, monto, metodo_pago } = req.body;
  console.log('Registrando pago:', { alumno_id, mes, año, monto, metodo_pago });
  
  try {
    const operations = [
      {
        type: 'get',
        sql: 'SELECT id FROM alumnos WHERE id = ? AND activo = 1',
        params: [alumno_id]
      },
      {
        type: 'run',
        sql: 'DELETE FROM mensualidades WHERE alumno_id = ? AND mes = ? AND año = ?',
        params: [alumno_id, mes, año]
      },
      {
        type: 'run',
        sql: 'INSERT INTO mensualidades (alumno_id, mes, año, monto, fecha_pago, metodo_pago, pagado) VALUES (?, ?, ?, ?, date("now"), ?, 1)',
        params: [alumno_id, mes, año, monto, metodo_pago]
      }
    ];
    
    const results = await runTransaction(operations);
    
    // Verificar que el alumno existe
    if (!results[0]) {
      return res.status(404).json({ error: 'Alumno no encontrado o inactivo' });
    }
    
    console.log('Pago registrado con ID:', results[2].lastID);
    res.json({ message: 'Pago registrado exitosamente', id: results[2].lastID });
  } catch (error) {
    console.error('Error en transacción de pago:', error.message);
    res.status(500).json({ error: 'Error al procesar el pago: ' + error.message });
  }
});

app.get('/api/estado-pagos/:mes/:año', (req, res) => {
  const { mes, año } = req.params;
  console.log(`Consultando pagos para: Mes=${mes}, Año=${año}`);
  
  db.all(`
    SELECT 
      a.id, a.nombre, a.apellido,
      CASE WHEN m.pagado = 1 THEN 'Pagado' ELSE 'Pendiente' END as estado,
      m.fecha_pago, m.monto, m.metodo_pago
    FROM alumnos a
    LEFT JOIN mensualidades m ON a.id = m.alumno_id AND m.mes = ? AND m.año = ?
    WHERE a.activo = 1
    ORDER BY a.apellido, a.nombre
  `, [mes, año], (err, rows) => {
    if (err) {
      console.error('Error en consulta SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Resultados encontrados:', rows.length);
    console.log('Primer resultado:', rows[0]);
    
    res.json(rows);
  });
});

// RUTAS DE PRODUCTOS E INDUMENTARIA
app.get('/api/productos', (req, res) => {
  db.all('SELECT * FROM productos ORDER BY tipo, talle', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put('/api/productos/:id', (req, res) => {
  const { precio, stock, stock_minimo } = req.body;
  const updates = [];
  const values = [];
  
  if (precio !== undefined) {
    updates.push('precio = ?');
    values.push(precio);
  }
  if (stock !== undefined) {
    updates.push('stock = ?');
    values.push(stock);
  }
  if (stock_minimo !== undefined) {
    updates.push('stock_minimo = ?');
    values.push(stock_minimo);
  }
  
  values.push(req.params.id);
  
  db.run(
    `UPDATE productos SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Producto actualizado exitosamente' });
    }
  );
});

app.get('/api/productos/stock-bajo', (req, res) => {
  db.all('SELECT * FROM productos WHERE stock <= stock_minimo ORDER BY stock ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/productos', (req, res) => {
  const { tipo, talle, precio, stock = 0, stock_minimo = 5 } = req.body;
  db.run(
    'INSERT INTO productos (tipo, talle, precio, stock, stock_minimo) VALUES (?, ?, ?, ?, ?)',
    [tipo, talle, precio, stock, stock_minimo],
    function(err) {
      if (err) {
        console.error('Error creando producto:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'Producto creado exitosamente' });
    }
  );
});

app.delete('/api/productos/:id', (req, res) => {
  db.run(
    'DELETE FROM productos WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Producto eliminado exitosamente' });
    }
  );
});

app.post('/api/pedidos-indumentaria', (req, res) => {
  const { alumno_id, producto_id, cantidad, monto } = req.body;
  db.run(
    'INSERT INTO pedidos_indumentaria (alumno_id, producto_id, cantidad, monto) VALUES (?, ?, ?, ?)',
    [alumno_id, producto_id, cantidad, monto],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Pedido registrado exitosamente' });
    }
  );
});

app.get('/api/pedidos-indumentaria', (req, res) => {
  db.all(`
    SELECT 
      pi.*, a.nombre, a.apellido, p.tipo, p.talle, p.precio
    FROM pedidos_indumentaria pi
    JOIN alumnos a ON pi.alumno_id = a.id
    JOIN productos p ON pi.producto_id = p.id
    ORDER BY pi.fecha_pedido DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put('/api/pedidos-indumentaria/:id/estado', async (req, res) => {
  const { estado } = req.body;
  
  try {
    if (estado === 'Entregado') {
      const operations = [
        {
          type: 'get',
          sql: 'SELECT producto_id, cantidad FROM pedidos_indumentaria WHERE id = ?',
          params: [req.params.id]
        },
        {
          type: 'get',
          sql: 'SELECT stock FROM productos WHERE id = (SELECT producto_id FROM pedidos_indumentaria WHERE id = ?)',
          params: [req.params.id]
        },
        {
          type: 'run',
          sql: 'UPDATE pedidos_indumentaria SET estado = ?, fecha_entrega = CURRENT_DATE WHERE id = ?',
          params: [estado, req.params.id]
        },
        {
          type: 'run',
          sql: 'UPDATE productos SET stock = stock - ? WHERE id = ?',
          params: [] // Se llenará dinámicamente
        }
      ];
      
      // Ejecutar las primeras operaciones para obtener datos
      const initialResults = await runTransaction(operations.slice(0, 2));
      const pedido = initialResults[0];
      const producto = initialResults[1];
      
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
      
      if (!producto || producto.stock < pedido.cantidad) {
        return res.status(400).json({ error: 'Stock insuficiente para entregar el pedido' });
      }
      
      // Completar la transacción
      operations[3].params = [pedido.cantidad, pedido.producto_id];
      const finalResults = await runTransaction(operations.slice(2));
      
      res.json({ message: 'Pedido entregado y stock actualizado' });
    } else {
      const operations = [
        {
          type: 'run',
          sql: 'UPDATE pedidos_indumentaria SET estado = ? WHERE id = ?',
          params: [estado, req.params.id]
        }
      ];
      
      await runTransaction(operations);
      res.json({ message: 'Estado actualizado exitosamente' });
    }
  } catch (error) {
    console.error('Error en transacción de pedido:', error.message);
    res.status(500).json({ error: 'Error al actualizar el pedido: ' + error.message });
  }
});

// RUTAS DE RENOVACIONES
app.get('/api/renovaciones/:anio', (req, res) => {
  const { anio } = req.params;
  db.all(`
    SELECT 
      a.id, a.nombre, a.apellido,
      COALESCE(r.pago_realizado, 0) as pago_realizado,
      COALESCE(r.formulario_entregado, 0) as formulario_entregado,
      COALESCE(r.apto_fisico_entregado, 0) as apto_fisico_entregado,
      r.fecha_pago, r.monto
    FROM alumnos a
    LEFT JOIN renovaciones r ON a.id = r.alumno_id AND r.año = ?
    WHERE a.activo = 1
    ORDER BY a.apellido, a.nombre
  `, [anio], (err, rows) => {
    if (err) {
      console.error('Error en renovaciones:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`Renovaciones encontradas para ${anio}:`, rows.length);
    res.json(rows);
  });
});

app.post('/api/renovaciones', async (req, res) => {
  const { alumno_id, año, campo, valor, monto } = req.body;
  
  try {
    const operations = [
      {
        type: 'get',
        sql: 'SELECT id FROM alumnos WHERE id = ? AND activo = 1',
        params: [alumno_id]
      },
      {
        type: 'run',
        sql: `INSERT OR REPLACE INTO renovaciones 
             (alumno_id, año, pago_realizado, formulario_entregado, apto_fisico_entregado, fecha_pago, monto)
             VALUES (?, ?, 
               CASE WHEN ? = 'pago_realizado' THEN ? ELSE COALESCE((SELECT pago_realizado FROM renovaciones WHERE alumno_id = ? AND año = ?), 0) END,
               CASE WHEN ? = 'formulario_entregado' THEN ? ELSE COALESCE((SELECT formulario_entregado FROM renovaciones WHERE alumno_id = ? AND año = ?), 0) END,
               CASE WHEN ? = 'apto_fisico_entregado' THEN ? ELSE COALESCE((SELECT apto_fisico_entregado FROM renovaciones WHERE alumno_id = ? AND año = ?), 0) END,
               CASE WHEN ? = 'pago_realizado' AND ? = 1 THEN CURRENT_DATE ELSE (SELECT fecha_pago FROM renovaciones WHERE alumno_id = ? AND año = ?) END,
               CASE WHEN ? = 'pago_realizado' THEN ? ELSE COALESCE((SELECT monto FROM renovaciones WHERE alumno_id = ? AND año = ?), 0) END
             )`,
        params: [alumno_id, año, campo, valor, alumno_id, año, campo, valor, alumno_id, año, campo, valor, alumno_id, año, campo, valor, alumno_id, año, campo, monto, alumno_id, año]
      }
    ];
    
    const results = await runTransaction(operations);
    
    if (!results[0]) {
      return res.status(404).json({ error: 'Alumno no encontrado o inactivo' });
    }
    
    res.json({ message: 'Renovación actualizada exitosamente' });
  } catch (error) {
    console.error('Error en transacción de renovación:', error.message);
    res.status(500).json({ error: 'Error al actualizar la renovación: ' + error.message });
  }
});

// RUTAS DE TURNOS
app.get('/api/turnos', (req, res) => {
  db.all('SELECT * FROM turnos ORDER BY dia, hora_inicio', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/turnos', (req, res) => {
  const { dia, hora_inicio, hora_fin, niveles } = req.body;
  db.run(
    'INSERT INTO turnos (dia, hora_inicio, hora_fin, niveles) VALUES (?, ?, ?, ?)',
    [dia, hora_inicio, hora_fin, JSON.stringify(niveles)],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Turno creado exitosamente' });
    }
  );
});

// RUTAS DE ASISTENCIAS
app.get('/api/asistencias/:fecha/:turno_id', (req, res) => {
  const { fecha, turno_id } = req.params;
  
  db.all(`
    SELECT a.id, a.alumno_id, a.turno_id, a.fecha, a.presente, 
           al.nombre, al.apellido, al.cinturon
    FROM asistencias a
    JOIN alumnos al ON a.alumno_id = al.id
    WHERE a.fecha = ? AND a.turno_id = ?
  `, [fecha, turno_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/asistencias', (req, res) => {
  const { alumno_id, turno_id, fecha, presente } = req.body;
  
  // Verificar si ya existe una asistencia para este alumno, turno y fecha
  db.get(
    'SELECT id FROM asistencias WHERE alumno_id = ? AND turno_id = ? AND fecha = ?',
    [alumno_id, turno_id, fecha],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (row) {
        // Actualizar asistencia existente
        db.run(
          'UPDATE asistencias SET presente = ? WHERE id = ?',
          [presente ? 1 : 0, row.id],
          function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Asistencia actualizada exitosamente' });
          }
        );
      } else {
        // Crear nueva asistencia
        db.run(
          'INSERT INTO asistencias (alumno_id, turno_id, fecha, presente) VALUES (?, ?, ?, ?)',
          [alumno_id, turno_id, fecha, presente ? 1 : 0],
          function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Asistencia registrada exitosamente' });
          }
        );
      }
    }
  );
});

// Obtener alumnos por turno
app.get('/api/alumnos/turno/:turno_id', (req, res) => {
  const { turno_id } = req.params;
  
  // Obtener el turno para saber los niveles
  db.get('SELECT niveles FROM turnos WHERE id = ?', [turno_id], (err, turno) => {
    if (err) {
      console.error('Error obteniendo turno:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    if (!turno) {
      console.error('Turno no encontrado:', turno_id);
      return res.status(404).json({ error: 'Turno no encontrado' });
    }
    
    try {
      let niveles;
      
      // Intentar parsear como JSON, si falla, tratar como string separado por comas
      try {
        niveles = JSON.parse(turno.niveles || '[]');
      } catch {
        // Si no es JSON, dividir por comas
        niveles = turno.niveles ? turno.niveles.split(',').map(n => n.trim()) : [];
      }
      
      console.log('Niveles para turno', turno_id, ':', niveles);
      
      // Si no hay niveles, devolver array vacío
      if (niveles.length === 0) {
        console.log('No hay niveles definidos para este turno');
        return res.json([]);
      }
      
      // Obtener alumnos con esos niveles de cinturón
      const placeholders = niveles.map(() => '?').join(',');
      const query = `SELECT * FROM alumnos WHERE cinturon IN (${placeholders}) AND activo = 1 ORDER BY apellido, nombre`;
      
      console.log('Query:', query);
      console.log('Parámetros:', niveles);
      
      db.all(query, niveles, (err, rows) => {
        if (err) {
          console.error('Error obteniendo alumnos por turno:', err.message);
          return res.status(500).json({ error: err.message });
        }
        console.log(`Encontrados ${rows.length} alumnos para el turno ${turno_id}`);
        res.json(rows);
      });
    } catch (error) {
      console.error('Error parseando niveles:', error.message);
      console.error('Turno completo:', turno);
      console.error('Niveles raw:', turno.niveles);
      return res.status(500).json({ error: 'Error al procesar los niveles del turno: ' + error.message });
    }
  });
});

// RUTAS DE EXÁMENES
app.get('/api/examenes', (req, res) => {
  db.all(`
    SELECT e.*, a.nombre, a.apellido
    FROM examenes e
    JOIN alumnos a ON e.alumno_id = a.id
    ORDER BY e.fecha_examen DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/examenes', (req, res) => {
  const { alumno_id, cinturon_actual, cinturon_objetivo, fecha_examen, monto } = req.body;
  db.run(
    'INSERT INTO examenes (alumno_id, cinturon_actual, cinturon_objetivo, fecha_examen, monto) VALUES (?, ?, ?, ?, ?)',
    [alumno_id, cinturon_actual, cinturon_objetivo, fecha_examen, monto],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Examen registrado exitosamente' });
    }
  );
});

app.put('/api/examenes/:id/aprobar', async (req, res) => {
  const { aprobado, pagado, cinturon_objetivo } = req.body;
  
  try {
    const operations = [
      {
        type: 'get',
        sql: 'SELECT alumno_id FROM examenes WHERE id = ?',
        params: [req.params.id]
      },
      {
        type: 'run',
        sql: 'UPDATE examenes SET aprobado = ?, pagado = ?, fecha_pago = CASE WHEN ? = 1 THEN CURRENT_DATE ELSE fecha_pago END WHERE id = ?',
        params: [aprobado, pagado, pagado, req.params.id]
      }
    ];
    
    // Si está aprobado, actualizar cinturón del alumno
    if (aprobado) {
      operations.push({
        type: 'run',
        sql: 'UPDATE alumnos SET cinturon = ? WHERE id = (SELECT alumno_id FROM examenes WHERE id = ?)',
        params: [cinturon_objetivo, req.params.id]
      });
    }
    
    const results = await runTransaction(operations);
    
    if (!results[0]) {
      return res.status(404).json({ error: 'Examen no encontrado' });
    }
    
    res.json({ message: 'Examen actualizado exitosamente' });
  } catch (error) {
    console.error('Error en transacción de examen:', error.message);
    res.status(500).json({ error: 'Error al actualizar el examen: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});