import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Chip, Grid, Avatar, Fab } from '@mui/material';
import { School, PlayArrow, Stop, Person, Schedule, Group, TrendingUp, Notifications } from '@mui/icons-material';
import PanelClase from './instructor/PanelClase';
import GestorTemario from './instructor/GestorTemario';
import GestorRecordatorios from './instructor/GestorRecordatorios';

const InstructorTab: React.FC = () => {
  const [vistaActual, setVistaActual] = useState<'inicio' | 'panel' | 'temario' | 'recordatorios'>('inicio');
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<number | null>(null);
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [asistenciasHoy, setAsistenciasHoy] = useState<any[]>([]);
  
  // Cargar datos para dashboard
  useEffect(() => {
    const saved = localStorage.getItem('alumnos-krav-maga');
    const alumnosLocal = saved ? JSON.parse(saved) : [];
    setAlumnos(alumnosLocal);
    
    const savedAsistencias = localStorage.getItem('asistencias-krav-maga');
    const todasAsistencias = savedAsistencias ? JSON.parse(savedAsistencias) : [];
    const hoy = new Date().toISOString().split('T')[0];
    const asistenciasDeHoy = todasAsistencias.filter((a: any) => a.fecha === hoy);
    setAsistenciasHoy(asistenciasDeHoy);
  }, []);

  const renderVista = () => {
    switch (vistaActual) {
      case 'panel':
        return <PanelClase turnoId={turnoSeleccionado!} onVolver={() => setVistaActual('inicio')} />;
      case 'temario':
        return <GestorTemario onVolver={() => setVistaActual('inicio')} />;
      case 'recordatorios':
        return <GestorRecordatorios onVolver={() => setVistaActual('inicio')} />;
      default:
        const totalAlumnos = alumnos.length;
        const asistenciasHoyCount = asistenciasHoy.filter(a => a.presente).length;
        const horaActual = new Date().getHours();
        const enHorarioClase = horaActual >= 17 && horaActual <= 21;
        
        return (
          <Box>
            {/* Header Mobile-First */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2, 
                bgcolor: 'primary.main',
                fontSize: '2rem'
              }}>
                🥋
              </Avatar>
              <Typography variant="h4" component="h1" sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                fontWeight: 600,
                color: 'primary.main',
                mb: 1
              }}>
                Panel Instructor
              </Typography>
              <Chip 
                label={enHorarioClase ? '🟢 En horario de clase' : '🔴 Fuera de horario'}
                color={enHorarioClase ? 'success' : 'default'}
                sx={{ fontSize: '0.9rem' }}
              />
            </Box>
            
            {/* Dashboard Mobile-First */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ 
                  textAlign: 'center',
                  borderRadius: 3,
                  boxShadow: 3,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
                  transition: 'all 0.2s ease'
                }}>
                  <CardContent sx={{ py: { xs: 2, sm: 2 } }}>
                    <Typography variant="h2" component="div" sx={{ 
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      fontWeight: 700,
                      mb: 0.5
                    }}>
                      {totalAlumnos}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                      👥 Alumnos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ 
                  textAlign: 'center',
                  borderRadius: 3,
                  boxShadow: 3,
                  bgcolor: 'success.main',
                  color: 'white',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
                  transition: 'all 0.2s ease'
                }}>
                  <CardContent sx={{ py: { xs: 2, sm: 2 } }}>
                    <Typography variant="h2" component="div" sx={{ 
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      fontWeight: 700,
                      mb: 0.5
                    }}>
                      {asistenciasHoyCount}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                      ✅ Hoy
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ 
                  textAlign: 'center',
                  borderRadius: 3,
                  boxShadow: 3,
                  bgcolor: 'warning.main',
                  color: 'white',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
                  transition: 'all 0.2s ease'
                }}>
                  <CardContent sx={{ py: { xs: 2, sm: 2 } }}>
                    <Typography variant="h2" component="div" sx={{ 
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      fontWeight: 700,
                      mb: 0.5
                    }}>
                      5
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                      📅 Turnos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ 
                  textAlign: 'center',
                  borderRadius: 3,
                  boxShadow: 3,
                  bgcolor: 'info.main',
                  color: 'white',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
                  transition: 'all 0.2s ease'
                }}>
                  <CardContent sx={{ py: { xs: 2, sm: 2 } }}>
                    <Typography variant="h2" component="div" sx={{ 
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      fontWeight: 700,
                      mb: 0.5
                    }}>
                      {totalAlumnos > 0 ? Math.round((asistenciasHoyCount / totalAlumnos) * 100) : 0}%
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                      📊 Asistencia
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Accesos Rápidos */}
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
              ⚡ Accesos Rápidos
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: 2,
                  '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setVistaActual('panel')}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
                    <Box sx={{ 
                      bgcolor: 'success.main', 
                      color: 'white', 
                      borderRadius: '50%', 
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <PlayArrow sx={{ fontSize: '2rem' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Iniciar Clase
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Comenzar sesión de entrenamiento
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: 2,
                  '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setVistaActual('temario')}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
                    <Box sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white', 
                      borderRadius: '50%', 
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <School sx={{ fontSize: '2rem' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Temario
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Administrar contenido de clases
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: 2,
                  '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setVistaActual('recordatorios')}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
                    <Box sx={{ 
                      bgcolor: 'warning.main', 
                      color: 'white', 
                      borderRadius: '50%', 
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Notifications sx={{ fontSize: '2rem' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Recordatorios
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Gestionar avisos y notificaciones
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return renderVista();
};

export default InstructorTab;