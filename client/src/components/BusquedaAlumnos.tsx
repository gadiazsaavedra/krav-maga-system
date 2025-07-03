import React, { useState } from 'react';
import { TextField, Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';

interface BusquedaAlumnosProps {
  alumnos: any[];
  onSeleccionar: (alumno: any) => void;
  placeholder?: string;
}

const BusquedaAlumnos: React.FC<BusquedaAlumnosProps> = ({ 
  alumnos, 
  onSeleccionar, 
  placeholder = "Buscar alumno..." 
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const alumnosFiltrados = alumnos.filter(alumno =>
    `${alumno.nombre} ${alumno.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  ).slice(0, 5);

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        type="search"
        placeholder={placeholder}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        onFocus={() => setMostrarResultados(true)}
        onBlur={() => setTimeout(() => setMostrarResultados(false), 200)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
        }}
        inputProps={{ inputMode: 'search' }}
      />
      
      {mostrarResultados && busqueda && alumnosFiltrados.length > 0 && (
        <Paper sx={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          maxHeight: 200,
          overflow: 'auto'
        }}>
          <List dense>
            {alumnosFiltrados.map(alumno => (
              <ListItem 
                key={alumno.id} 
                button 
                onClick={() => {
                  onSeleccionar(alumno);
                  setBusqueda('');
                  setMostrarResultados(false);
                }}
              >
                <ListItemText 
                  primary={`${alumno.apellido}, ${alumno.nombre}`}
                  secondary={alumno.telefono}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default BusquedaAlumnos;