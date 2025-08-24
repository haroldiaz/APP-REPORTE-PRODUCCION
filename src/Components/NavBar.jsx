import React, { useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Divider,
  IconButton,
  Typography,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidthOpen = 240;
const drawerWidthClosed = 70;

export default function Navbar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta si es pantalla pequeña (máximo 960px)
  const isSmallScreen = useMediaQuery('(max-width:960px)');

  // Cierra automáticamente en pantallas pequeñas
  useEffect(() => {
    if (isSmallScreen) {
      setOpen(false);
    }
  }, [isSmallScreen, setOpen]);

  const handleNav = (ruta) => {
    navigate(ruta);
    if (isSmallScreen) {
      setOpen(false); // Cierra el drawer al navegar en móvil
    }
  };

  const navItems = [
    { text: 'Menú Principal', icon: <HomeIcon />, route: '/' },
    { text: 'Tabla Reporte', icon: <EventNoteIcon />, route: '/VerReporte' },
    { text: 'Registro Reporte', icon: <AddCircleOutlineIcon />, route: '/HacerReporte' },
    { text: 'Estadísticas', icon: <InsertChartIcon />, route: '/Estadisticas' },
    { text: 'Gráficos', icon: <InsertChartIcon />, route: '/Graficos' },
    { text: 'Reportes', icon: <BarChartIcon />, route: '/Reportes' },
    { text: 'Alerta', icon: <WarningAmberIcon />, route: '/Alerta' },
    { text: 'Configuracion', icon: <WarningAmberIcon />, route: '/Configuracion' },
    { text: 'Reporte Producto', icon: <AppRegistrationIcon />, route: '/ReporteProducto' },
    { text: 'SeleccionColor', icon: <AppRegistrationIcon />, route: '/SeleccionColor' }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        position: 'fixed',
        zIndex: 1200,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
        },
      }}
    >
      {/* Encabezado */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          padding: 1.5,
          backgroundColor: '#1976d2',
          color: 'white',
          height: '64px'
        }}
      >
        {open && (
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'white', color: '#1976d2', mr: 2 }}>P</Avatar>
            <Typography variant="subtitle1" fontWeight="bold">
              Producción
            </Typography>
          </Box>
        )}
        <IconButton onClick={() => setOpen(!open)} sx={{ color: 'white' }}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      <Divider />

      {/* Lista de navegación */}
      <List sx={{ mt: 0.5 }}>
        {navItems.map(({ text, icon, route }) => {
          const isActive = location.pathname === route;

          return (
            <ListItem disablePadding key={text} sx={{ display: 'block' }}>
              <Tooltip title={!open ? text : ''} placement="right">
                <ListItemButton
                  onClick={() => handleNav(route)}
                  sx={{
                    minHeight: 42,
                    py: 0.5,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: isActive ? '#1976d2' : '#e0e0e0',
                        color: isActive ? 'white' : '#424242',
                        borderRadius: '50%',
                        width: 30,
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        '&:hover': { opacity: 0.85 }
                      }}
                    >
                      {icon}
                    </Box>
                  </ListItemIcon>
                  {open && <ListItemText primary={text} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
