import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box, Card, CardContent } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f', // Rojo Krav Maga
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🥋 Sistema Krav Maga - MVP
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              ¡Sistema Funcionando! ✅
            </Typography>
            <Typography variant="body1" paragraph>
              Tu sistema de gestión de Krav Maga está online y listo para usar.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Próximos pasos:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <li>Conectar base de datos</li>
              <li>Activar funcionalidades completas</li>
              <li>Mostrar a tu cliente</li>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default App;