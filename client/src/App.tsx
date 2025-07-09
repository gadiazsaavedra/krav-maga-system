import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import 'dayjs/locale/es';
// React Query removido - no se usa
import { AppProvider } from './context/AppContext';
import LicenseCheck from './components/LicenseCheck';
import LanguageSelector from './components/LanguageSelector';
import { translations, Language } from './i18n/translations';

import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

const DashboardTab = lazy(() => import('./components/DashboardTab'));

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



// QueryClient removido - no se usa

function App() {
  const [dashboardAction, setDashboardAction] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es');
  
  const t = (key: keyof typeof translations.es) => {
    return translations[currentLanguage][key] || translations.es[key];
  };

  const handleDashboardNavigate = (tabIndex: number, action?: string) => {
    setDashboardAction(action || null);
  };

  return (
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
            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />
          </Toolbar>
        </AppBar>
        
        <Container sx={{ mt: 1, px: { xs: 1, sm: 2 }, pb: 2 }}>
          <LicenseCheck>
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardTab onNavigate={handleDashboardNavigate} />
            </Suspense>
          </LicenseCheck>
        </Container>
        

        </ThemeProvider>
      </AppProvider>
  );
}

export default App;