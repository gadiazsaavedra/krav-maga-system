import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Tabs, Tab, Box } from '@mui/material';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import 'dayjs/locale/es';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProvider } from './context/AppContext';

import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

const AlumnosTab = lazy(() => import('./components/AlumnosTab'));
const MensualidadesTab = lazy(() => import('./components/MensualidadesTab'));
const IndumentariaTab = lazy(() => import('./components/IndumentariaTab'));
const RenovacionesTab = lazy(() => import('./components/RenovacionesTab'));
const ExamenesTab = lazy(() => import('./components/ExamenesTab'));
const TurnosTab = lazy(() => import('./components/TurnosTab'));
const AsistenciasTab = lazy(() => import('./components/AsistenciasTab'));

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f', // Rojo Krav Maga
    },
    secondary: {
      main: '#424242', // Negro
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: false,
      },
      styleOverrides: {
        root: {
          paddingLeft: 8,
          paddingRight: 8,
          '@media (min-width: 600px)': {
            paddingLeft: 16,
            paddingRight: 16,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 48, // Botones más grandes para móvil
        },
      },
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          minHeight: 'calc(100vh - 120px)',
          overflow: 'auto'
        }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ThemeProvider theme={theme}>
            <CssBaseline />
        <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
          <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontSize: { xs: '1rem', sm: '1.25rem' },
                fontWeight: 'bold'
              }}
            >
              Krav Maga
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container sx={{ mt: 1, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable" 
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minWidth: { xs: 80, sm: 120 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '6px 8px', sm: '12px 16px' }
                }
              }}
            >
              <Tab label="Alumnos" />
              <Tab label="Pagos" />
              <Tab label="Tienda" />
              <Tab label="Renovaciones" />
              <Tab label="Exámenes" />
              <Tab label="Turnos" />
              <Tab label="Asistencias" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Suspense fallback={<LoadingSpinner />}>
              <AlumnosTab />
            </Suspense>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Suspense fallback={<LoadingSpinner />}>
              <MensualidadesTab />
            </Suspense>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Suspense fallback={<LoadingSpinner />}>
              <IndumentariaTab />
            </Suspense>
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <Suspense fallback={<LoadingSpinner />}>
              <RenovacionesTab />
            </Suspense>
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <Suspense fallback={<LoadingSpinner />}>
              <ExamenesTab />
            </Suspense>
          </TabPanel>
          <TabPanel value={tabValue} index={5}>
            <Suspense fallback={<LoadingSpinner />}>
              <TurnosTab />
            </Suspense>
          </TabPanel>
          <TabPanel value={tabValue} index={6}>
            <Suspense fallback={<LoadingSpinner />}>
              <AsistenciasTab />
            </Suspense>
          </TabPanel>
        </Container>
        </ThemeProvider>
      </AppProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;