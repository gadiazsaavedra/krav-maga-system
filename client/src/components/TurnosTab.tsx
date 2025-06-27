import React, { useState } from 'react';
import {
  Box, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import { Schedule, Add } from '@mui/icons-material';

// Datos estáticos para demostración
const turnos = [
  { id: 1, dia: 'Lunes', hora_inicio: '17:00', hora_fin: '18:00', niveles: ['Blanco'] },
  { id: 2, dia: 'Lunes', hora_inicio: '18:00', hora_fin: '19:00', niveles: ['Amarillo'] },
  { id: 3, dia: 'Lunes', hora_inicio: '19:00', hora_fin: '20:00', niveles: ['Blanco'] },
  { id: 4, dia: 'Lunes', hora_inicio: '20:00', hora_fin: '21:00', niveles: ['Naranja', 'Verde'] },
  { id: 5, dia: 'Miércoles', hora_inicio: '17:00', hora_fin: '18:00', niveles: ['Blanco'] },
  { id: 6, dia: 'Miércoles', hora_inicio: '18:00', hora_fin: '19:00', niveles: ['Amarillo'] },
  { id: 7, dia: 'Miércoles', hora_inicio: '19:00', hora_fin: '20:00', niveles: ['Blanco'] },
  { id: 8, dia: 'Miércoles', hora_inicio: '20:00', hora_fin: '21:00', niveles: ['Naranja', 'Verde'] },
  { id: 9, dia: 'Martes', hora_inicio: '13:00', hora_fin: '14:00', niveles: ['Blanco', 'Amarillo'] },
  { id: 10, dia: 'Jueves', hora_inicio: '13:00', hora_fin: '14:00', niveles: ['Blanco', 'Amarillo'] },
  { id: 11, dia: 'Viernes', hora_inicio: '19:00', hora_fin: '21:00', niveles: ['Blanco', 'Amarillo', 'Naranja'] }
];

const alumnos = [
  { id: 1, nombre: 'Juan', apellido: 'Pérez', cinturon: 'Amarillo', turnos: [2, 6, 11] },
  { id: 2, nombre: 'María', apellido: 'González', cinturon: 'Verde', turnos: [4, 8] },
  { id: 3, nombre: 'Carlos', apellido: 'Rodríguez', cinturon: 'Blanco', turnos: [1, 5, 9] },
  { id: 4, nombre: 'Ana', apellido: 'Martínez', cinturon: 'Azul', turnos: [4, 8] }
];

const TurnosTab: React.FC = () => {
  const [selectedTurno, setSelectedTurno] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAsignarDialog, setOpenAsignarDialog] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState('');
  const [selectedTurnoId, setSelectedTurnoId] = useState('');

  const handleVerAlumnos = (turno: any) => {
    setSelectedTurno(turno);
    setOpenDialog(true);
  };

  const handleAsignarAlumno = () => {
    alert(`Alumno asignado al turno exitosamente`);
    setOpenAsignarDialog(false);
  };

  const getAlumnosPorTurno = (turnoId: number) => {
    return alumnos.filter(alumno => alumno.turnos.includes(turnoId));
  };

  const getCinturonColor = (cinturon: string) => {
    const colors: { [key: string]: string } = {
      'Blanco': '#ffffff',
      'Amarillo': '#ffeb3b',
      'Naranja': '#ff9800',
      'Verde': '#4caf50',
      'Azul': '#2196f3',
      'Marrón': '#795548',
      'Negro': '#424242'
    };
    return colors[cinturon] || '#ffffff';
  };

  const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const turnosOrdenados = [...turnos].sort((a, b) => {
    const diaA = diasOrden.indexOf(a.dia);
    const diaB = diasOrden.indexOf(b.dia);
    if (diaA !== diaB) return diaA - diaB;
    return a.hora_inicio.localeCompare(b.hora_inicio);
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
          Gestión de Turnos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenAsignarDialog(true)}
        >
          Asignar Alumno
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Día</TableCell>
              <TableCell>Horario</TableCell>
              <TableCell>Niveles</TableCell>
              <TableCell>Alumnos</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turnosOrdenados.map((turno) => (
              <TableRow key={turno.id}>
                <TableCell>{turno.dia}</TableCell>
                <TableCell>{`${turno.hora_inicio} - ${turno.hora_fin}`}</TableCell>
                <TableCell>
                  {turno.niveles.map((nivel) => (
                    <Chip
                      key={nivel}
                      label={nivel}
                      size="small"
                      sx={{
                        backgroundColor: getCinturonColor(nivel),
                        color: nivel === 'Blanco' ? 'black' : 'white',
                        mr: 0.5
                      }}
                    />
                  ))}
                </TableCell>
                <TableCell>{getAlumnosPorTurno(turno.id).length} alumnos</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleVerAlumnos(turno)}
                  >
                    Ver Alumnos
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para ver alumnos de un turno */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md">
        <DialogTitle>
          Alumnos en turno: {selectedTurno?.dia} {selectedTurno?.hora_inicio} - {selectedTurno?.hora_fin}
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Alumno</TableCell>
                  <TableCell>Cinturón</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTurno && getAlumnosPorTurno(selectedTurno.id).map((alumno) => (
                  <TableRow key={alumno.id}>
                    <TableCell>{`${alumno.apellido}, ${alumno.nombre}`}</TableCell>
                    <TableCell>
                      <Chip
                        label={alumno.cinturon}
                        sx={{
                          backgroundColor: getCinturonColor(alumno.cinturon),
                          color: alumno.cinturon === 'Blanco' ? 'black' : 'white'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para asignar alumno a turno */}
      <Dialog open={openAsignarDialog} onClose={() => setOpenAsignarDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar Alumno a Turno</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Alumno</InputLabel>
                <Select
                  value={selectedAlumno}
                  label="Alumno"
                  onChange={(e) => setSelectedAlumno(e.target.value)}
                >
                  {alumnos.map((alumno) => (
                    <MenuItem key={alumno.id} value={alumno.id}>
                      {`${alumno.apellido}, ${alumno.nombre} (${alumno.cinturon})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Turno</InputLabel>
                <Select
                  value={selectedTurnoId}
                  label="Turno"
                  onChange={(e) => setSelectedTurnoId(e.target.value)}
                >
                  {turnosOrdenados.map((turno) => (
                    <MenuItem key={turno.id} value={turno.id}>
                      {`${turno.dia} ${turno.hora_inicio}-${turno.hora_fin} (${turno.niveles.join(', ')})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAsignarDialog(false)}>Cancelar</Button>
          <Button onClick={handleAsignarAlumno} variant="contained">
            Asignar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TurnosTab;