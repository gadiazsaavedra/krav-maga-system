import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';

interface LicenseCheckProps {
  children: React.ReactNode;
}

const LicenseCheck: React.FC<LicenseCheckProps> = ({ children }) => {
  const [isLicensed, setIsLicensed] = useState(false);
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [demoExpired, setDemoExpired] = useState(false);

  useEffect(() => {
    checkLicense();
  }, []);

  const checkLicense = () => {
    const savedLicense = localStorage.getItem('krav-maga-license');
    const demoStart = localStorage.getItem('krav-maga-demo-start');
    
    if (savedLicense) {
      // Verificar licencia válida y vigente
      const licenseData = isValidLicense(savedLicense);
      if (licenseData.valid && !licenseData.expired) {
        setIsLicensed(true);
        return;
      } else if (licenseData.expired) {
        setDemoExpired(true);
        setShowLicenseDialog(true);
        return;
      }
    }
    
    // Verificar período de demo
    if (!demoStart) {
      // Primera vez - iniciar demo
      localStorage.setItem('krav-maga-demo-start', new Date().toISOString());
      setShowLicenseDialog(true);
    } else {
      // Verificar si demo expiró
      const startDate = new Date(demoStart);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 30) { // Demo de 30 días
        setDemoExpired(true);
        setShowLicenseDialog(true);
      } else {
        setShowLicenseDialog(true);
      }
    }
  };

  const isValidLicense = (license: string): { valid: boolean; expired: boolean; clientName?: string; expiryDate?: Date } => {
    try {
      // Formato: KRAV-[CLIENTE]-[AÑO][MES]-[HASH]
      // Ejemplo: KRAV-CLUB1-202401-ABC123
      const parts = license.toUpperCase().split('-');
      
      if (parts.length !== 4 || parts[0] !== 'KRAV') {
        return { valid: false, expired: false };
      }
      
      const clientName = parts[1];
      const yearMonth = parts[2];
      const hash = parts[3];
      
      // Verificar formato de fecha (YYYYMM)
      if (yearMonth.length !== 6) {
        return { valid: false, expired: false };
      }
      
      const year = parseInt(yearMonth.substring(0, 4));
      const month = parseInt(yearMonth.substring(4, 6));
      
      if (year < 2024 || month < 1 || month > 12) {
        return { valid: false, expired: false };
      }
      
      // Crear fecha de expiración (último día del mes)
      const expiryDate = new Date(year, month, 0); // Último día del mes
      const now = new Date();
      
      // Verificar hash simple (puedes hacer más complejo)
      const expectedHash = generateHash(clientName, yearMonth);
      
      if (hash !== expectedHash) {
        return { valid: false, expired: false };
      }
      
      return {
        valid: true,
        expired: now > expiryDate,
        clientName,
        expiryDate
      };
      
    } catch (error) {
      return { valid: false, expired: false };
    }
  };
  
  const generateHash = (clientName: string, yearMonth: string): string => {
    // Hash simple - en producción usar algo más seguro
    const combined = clientName + yearMonth + 'KRAV-SECRET-2024';
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).toUpperCase().substring(0, 6);
  };

  const handleLicenseSubmit = () => {
    if (isValidLicense(licenseKey)) {
      localStorage.setItem('krav-maga-license', licenseKey.toUpperCase());
      setIsLicensed(true);
      setShowLicenseDialog(false);
      setError('');
    } else {
      setError('Código de licencia inválido');
    }
  };

  const getDemoInfo = () => {
    const demoStart = localStorage.getItem('krav-maga-demo-start');
    if (!demoStart) return { daysLeft: 30, isExpired: false };
    
    const startDate = new Date(demoStart);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, 30 - daysDiff);
    
    return { daysLeft, isExpired: daysDiff > 30 };
  };
  
  const getLicenseInfo = () => {
    const savedLicense = localStorage.getItem('krav-maga-license');
    if (!savedLicense) return null;
    
    return isValidLicense(savedLicense);
  };

  const demoInfo = getDemoInfo();

  if (isLicensed) {
    return <>{children}</>;
  }

  return (
    <>
      {!demoExpired && (
        <Typography variant="caption" sx={{ 
          fontWeight: 600,
          color: 'warning.light',
          fontSize: { xs: '0.7rem', sm: '0.75rem' }
        }}>
          🔓 DEMO - {demoInfo.daysLeft}d
        </Typography>
      )}
      
      <Box>
        {!demoExpired ? children : null}
      </Box>

      <Dialog 
        open={showLicenseDialog} 
        onClose={() => !demoExpired && setShowLicenseDialog(false)}
        maxWidth="sm" 
        fullWidth
        disableEscapeKeyDown={demoExpired}
      >
        <DialogTitle sx={{
          backgroundColor: demoExpired ? 'error.main' : 'primary.main',
          color: 'white',
          textAlign: 'center'
        }}>
          {demoExpired ? '🔒 Demo Expirado' : '🔓 Sistema Krav Maga'}
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {(() => {
            const licenseInfo = getLicenseInfo();
            
            if (demoExpired && licenseInfo?.expired) {
              return (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Tu suscripción mensual ha expirado. 
                  Contacta al proveedor para renovar tu licencia.
                </Alert>
              );
            } else if (demoExpired) {
              return (
                <Alert severity="error" sx={{ mb: 2 }}>
                  El período de demo de 30 días ha expirado. 
                  Ingresa tu código de licencia mensual para continuar.
                </Alert>
              );
            } else {
              return (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Bienvenido al Sistema Krav Maga. 
                  Tienes {demoInfo.daysLeft} días de demo gratuito.
                </Alert>
              );
            }
          })()}
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Código de Licencia
          </Typography>
          
          <TextField
            fullWidth
            label="Ingresa tu código de licencia"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            placeholder="KRAV-MAGA-2024-FULL"
            sx={{ mb: 2 }}
            error={!!error}
            helperText={error}
          />
          
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              💡 Suscripción Mensual:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • $50.000/mes por instructor<br/>
              • Licencia válida por 30 días<br/>
              • Soporte técnico incluido<br/>
              • Contacto: gadiazsaavedra@gmail.com
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2 }}>
          {!demoExpired && (
            <Button 
              onClick={() => setShowLicenseDialog(false)}
              variant="outlined"
            >
              Continuar Demo
            </Button>
          )}
          
          <Button 
            onClick={handleLicenseSubmit}
            variant="contained"
            disabled={!licenseKey.trim()}
          >
            Activar Licencia
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LicenseCheck;