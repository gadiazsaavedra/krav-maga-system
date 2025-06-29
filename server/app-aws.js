const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://*.netlify.app', 'https://*.netlify.com'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../client/build')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Krav Maga System API funcionando en AWS',
    timestamp: new Date().toISOString()
  });
});

// Rutas de API
app.get('/api/alumnos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const orderBy = req.query.orderBy || 'apellido';
    const order = req.query.order || 'asc';
    const offset = page * limit;
    
    const validOrderBy = ['nombre', 'apellido', 'cinturon'].includes(orderBy) ? orderBy : 'apellido';
    const validOrder = ['asc', 'desc'].includes(order) ? order : 'asc';
    
    // Contar total
    const countResult = await db.get('SELECT COUNT(*) as total FROM alumnos WHERE activo = 1');
    
    // Obtener datos
    const query = `
      SELECT * FROM alumnos 
      WHERE activo = 1 
      ORDER BY ${validOrderBy === 'cinturon' ? 
        (validOrder === 'asc' ? 
          "CASE cinturon WHEN 'Blanco' THEN 1 WHEN 'Amarillo' THEN 2 WHEN 'Naranja' THEN 3 WHEN 'Verde' THEN 4 WHEN 'Azul' THEN 5 WHEN 'Marrón' THEN 6 WHEN 'Negro' THEN 7 ELSE 8 END" :
          "CASE cinturon WHEN 'Negro' THEN 1 WHEN 'Marrón' THEN 2 WHEN 'Azul' THEN 3 WHEN 'Verde' THEN 4 WHEN 'Naranja' THEN 5 WHEN 'Amarillo' THEN 6 WHEN 'Blanco' THEN 7 ELSE 8 END") :
        `${validOrderBy} ${validOrder.toUpperCase()}`}
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const rows = await db.all(query);
    
    res.json({
      data: rows,
      total: countResult.total,
      page,
      limit
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Crear alumno
app.post('/api/alumnos', async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, fecha_nacimiento, grupo, cinturon } = req.body;
    
    const result = await db.run(
      `INSERT INTO alumnos (nombre, apellido, telefono, email, fecha_nacimiento, grupo, cinturon, fecha_registro, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), 1)`,
      [nombre, apellido, telefono, email, fecha_nacimiento, grupo, cinturon]
    );
    
    res.json({ id: result.lastID, message: 'Alumno creado exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Productos
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await db.all('SELECT * FROM productos ORDER BY tipo, talle');
    res.json(productos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Todas las rutas no API van al frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;