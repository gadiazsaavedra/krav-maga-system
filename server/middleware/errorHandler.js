const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: err.message
    });
  }
  
  // Error de base de datos
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(409).json({
      error: 'Conflicto de datos',
      details: 'El registro ya existe o viola una restricción'
    });
  }
  
  // Error genérico
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Contacte al administrador'
  });
};

module.exports = errorHandler;