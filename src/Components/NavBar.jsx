// src/Componentes/Navbar.jsx
import React from 'react';
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
  Tooltip
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import { useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
const drawerWidthOpen = 240;
const drawerWidthClosed = 70;

export default function Navbar({ open, setOpen }) {
  const navigate = useNavigate();

  const handleNav = (ruta) => {
    navigate(ruta);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        },
      }}
    >
      {/* Encabezado del Drawer con botón abrir/cerrar */}
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
            <Avatar sx={{ bgcolor: 'white', color: '#1976d2', mr: 4 }}>P</Avatar>
            <Typography variant="subtitle1" fontWeight="bold">
             Produccion Manager
            </Typography>
          </Box>
        )}

        <IconButton onClick={() => setOpen(!open)} sx={{ color: 'white' }}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      <Divider />

      {/* Lista de navegación */}
      <List>
        {[
          { text: 'Menú Principal', icon: <HomeIcon />, route: '/' },
          { text: 'Tabla Reporte', icon: <EventNoteIcon />, route: '/VerReporte' },
          { text: 'Registro Reporte', icon: <AddCircleOutlineIcon />, route: '/HacerReporte' },
          { text: 'Estadísticas', icon: <InsertChartIcon />, route: '/Estadisticas' },
          { text: 'Graficos', icon: <InsertChartIcon />, route: '/Graficos' },
          { text: 'Reportes', icon: <BarChartIcon />, route: '/Reportes' }
        ].map(({ text, icon, route }) => (
          <ListItem disablePadding key={text}>
            <Tooltip title={!open ? text : ''} placement="right">
              <ListItemButton onClick={() => handleNav(route)}>
                <ListItemIcon>{icon}</ListItemIcon>
                {open && <ListItemText primary={text} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
