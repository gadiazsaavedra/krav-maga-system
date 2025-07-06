import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, Avatar,
  List, ListItem, ListItemText, ListItemIcon, Divider
} from '@mui/material';
import {
  People, Person, Phone, School
} from '@mui/icons-material';

const PersonasTab: React.FC = () => {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [asistenciasHoy, setAsistenciasHoy] = useState<any[]>([]);
  const [examenesPendientes, setExamenesPendientes] = useState<any[]>([]);

  useEffect(() => {
    // Cargar alumnos
    const savedAlumnos = localStorage.getItem('alumnos-krav-maga');
    const alumnosLocal = savedAlumnos ? JSON.parse(savedAlumnos) : [];
    setAlumnos(alumnosLocal);

    // Cargar asistencias de hoy
    const savedAsistencias = localStorage.getItem('asistencias-krav-maga');
    const todasAsistencias = savedAsistencias ? JSON.parse(savedAsistencias) : [];
    const hoy = new Date().toISOString().split('T')[0];
    const asistenciasDeHoy = todasAsistencias.filter((a: any) => a.fecha === hoy);
    setAsistenciasHoy(asistenciasDeHoy);

    // Cargar exámenes pendientes
    const savedExamenes = localStorage.getItem('examenes-krav-maga');
    const todosExamenes = savedExamenes ? JSON.parse(savedExamenes) : [];
    const pendientes = todosExamenes.filter((e: any) => !e.aprobado || !e.pagado);
    setExamenesPendientes(pendientes);
  }, []);

  const asistenciasHoyCount = asistenciasHoy.filter(a => a.presente).length;
  const totalAlumnos = alumnos.length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          fontWeight: 600,
          color: 'primary.main'
        }}>
          👥 Personas
        </Typography>
      </Box>





      {/* Lista de alumnos */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <People color="primary" />
            Lista de Alumnos
          </Typography>
          
          <List>
            {alumnos.slice(0, 10).map((alumno, index) => {
              const asistenciaHoy = asistenciasHoy.find(a => a.alumno_id === alumno.id);
              const presente = asistenciaHoy?.presente || false;
              
              return (
                <React.Fragment key={alumno.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ 
                        bgcolor: presente ? 'success.main' : 'grey.400',
                        width: 40,
                        height: 40
                      }}>
                        <Person />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={`${alumno.apellido}, ${alumno.nombre}`}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={alumno.cinturon || 'Blanco'}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                          {presente && (
                            <Chip
                              label="Presente hoy"
                              color="success"
                              size="small"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      }
                    />
                    <Button
                      size="small"
                      startIcon={<Phone />}
                      sx={{ minWidth: 'auto', p: 1 }}
                      onClick={() => {
                        if (alumno.telefono) {
                          window.open(`tel:${alumno.telefono}`, '_self');
                        }
                      }}
                    >
                      Llamar
                    </Button>
                  </ListItem>
                  {index < Math.min(alumnos.length - 1, 9) && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
          
          {alumnos.length > 10 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button variant="outlined">
                Ver todos los alumnos ({alumnos.length})
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Exámenes pendientes */}
      {examenesPendientes.length > 0 && (
        <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <School color="warning" />
              Exámenes Pendientes
            </Typography>
            
            <List>
              {examenesPendientes.slice(0, 5).map((examen, index) => (
                <React.Fragment key={examen.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <School color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${examen.apellido}, ${examen.nombre}`}
                      secondary={`${examen.cinturon_actual} → ${examen.cinturon_objetivo}`}
                    />
                    <Chip
                      label={examen.aprobado ? 'Pendiente Pago' : 'Pendiente'}
                      color={examen.aprobado ? 'warning' : 'error'}
                      size="small"
                    />
                  </ListItem>
                  {index < Math.min(examenesPendientes.length - 1, 4) && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}


    </Box>
  );
};

export default PersonasTab;