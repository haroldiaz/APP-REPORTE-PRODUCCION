import React, { useState } from 'react';
import {
  Container,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Avatar,
  Box,
  Divider
} from '@mui/material';

function Configuracion() {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [nombre, setNombre] = useState('Usuario Ejemplo');
  const [correo, setCorreo] = useState('usuario@correo.com');
  const [foto, setFoto] = useState(null);
  const [contrasena, setContrasena] = useState('');

  const handleModoOscuro = () => {
    setModoOscuro(!modoOscuro);
    document.body.style.backgroundColor = !modoOscuro ? '#121212' : '#fff';
    document.body.style.color = !modoOscuro ? '#fff' : '#000';
  };

  const handleGuardarPerfil = () => {
    alert('Perfil actualizado con éxito');
  };

  const handleCambiarFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(URL.createObjectURL(file));
    }
  };

  const handleCambiarContrasena = () => {
    alert('Contraseña cambiada con éxito');
  };

  const handleCerrarSesion = () => {
    alert('Sesión cerrada');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Configuración
      </Typography>

      {/* Modo Oscuro */}
      <FormControlLabel
        control={<Switch checked={modoOscuro} onChange={handleModoOscuro} />}
        label="Modo Oscuro"
      />

      <Divider sx={{ my: 3 }} />

      {/* Perfil */}
      <Typography variant="h6" gutterBottom>
        Perfil
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          src={foto}
          alt="Foto de perfil"
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        <Button variant="contained" component="label">
          Cambiar Foto
          <input type="file" hidden accept="image/*" onChange={handleCambiarFoto} />
        </Button>
      </Box>
      <TextField
        label="Nombre"
        fullWidth
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Correo"
        fullWidth
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleGuardarPerfil}>
        Guardar Cambios
      </Button>

      <Divider sx={{ my: 3 }} />

      {/* Cambiar Contraseña */}
      <Typography variant="h6" gutterBottom>
        Cambiar Contraseña
      </Typography>
      <TextField
        label="Nueva Contraseña"
        type="password"
        fullWidth
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleCambiarContrasena}>
        Cambiar Contraseña
      </Button>

      <Divider sx={{ my: 3 }} />

      {/* Cerrar Sesión */}
      <Button variant="outlined" color="error" fullWidth onClick={handleCerrarSesion}>
        Cerrar Sesión
      </Button>
    </Container>
  );
}

export default Configuracion;
