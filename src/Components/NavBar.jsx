// src/Componentes/Navbar.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ title = "APP GYM" }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setOpen(open);
  };

  const handleNav = (ruta) => {
    navigate(ruta);
    setOpen(false); // cerrar menú al navegar
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Botón del menú tipo Gmail */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNav('/')}>
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary="Menu Principal" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNav('/VerReporte')}>
                <ListItemIcon><EventNoteIcon /></ListItemIcon>
                <ListItemText primary="Tabla Reporte" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNav('/HacerReporte')}>
                <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
                <ListItemText primary="Registro Reporte" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNav('/VerEntrenadores')}>
                <ListItemIcon><PictureAsPdfIcon /></ListItemIcon>
                <ListItemText primary="VerEntrenadores" />
              </ListItemButton>
            </ListItem>
             

            {/* Puedes seguir agregando más ítems aquí */}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
