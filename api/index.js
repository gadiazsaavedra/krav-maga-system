// Vercel Serverless Function
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando en Vercel' });
});

// Datos de prueba para empezar
const alumnosDemo = [
  { id: 1, nombre: 'Juan', apellido: 'Pérez', cinturon: 'Amarillo', activo: 1 },
  { id: 2, nombre: 'María', apellido: 'González', cinturon: 'Verde', activo: 1 },
  { id: 3, nombre: 'Carlos', apellido: 'Rodríguez', cinturon: 'Blanco', activo: 1 }
];

// Ruta básica de alumnos
app.get('/api/alumnos', (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  
  res.json({
    data: alumnosDemo,
    total: alumnosDemo.length,
    page,
    limit
  });
});

module.exports = app;