import React, { useState, useEffect } from 'react';
import { supabase } from './../Components/supabaseClient';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert
} from '@mui/material';
import { Select, MenuItem, InputLabel } from '@mui/material';
import Navbar from '../Components/NavBar';

function RegistroReporte() {
  const [formulario, setFormulario] = useState({
    fecha: '', // No usamos fecha predefinida
    nombreProduccion: 'Agua Preparada',
    cantidad: '0',
    ct: '0',
    baldes: '0',
    galones: '0',
  });

  const [estadoConexion, setEstadoConexion] = useState('Verificando conexión...');
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    const verificarConexion = async () => {
      const { error } = await supabase.from('reporte').select('*').limit(1);
      if (error) {
        console.error('❌ Error de conexión a Supabase:', error.message);
        setEstadoConexion('❌ No conectado a Supabase');
      } else {
        console.log('✅ Conexión a Supabase exitosa');
        setEstadoConexion('✅ Conectado a Supabase');
      }
    };
    verificarConexion();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async () => {
    // Capturar fecha en el momento del registro
    const fechaActual = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('reporte')
      .insert([{
        fecha: fechaActual,
        nombreProduccion: formulario.nombreProduccion,
        cantidad: parseInt(formulario.cantidad || '0'),
        ct: parseInt(formulario.ct || '0'),
        baldes: parseInt(formulario.baldes || '0'),
        galones: parseInt(formulario.galones || '0')
      }]);

    if (error) {
      console.error('❌ Error al insertar reporte:', error);
      setAlerta({ tipo: 'error', mensaje: 'Error al guardar el reporte.' });
    } else {
      setAlerta({ tipo: 'success', mensaje: 'Reporte registrado correctamente.' });

      // Resetear formulario, con nueva fecha fija
      setFormulario({
        fecha: fechaActual,
        nombreProduccion: '',
        cantidad: '0',
        ct: '0',
        baldes: '0',
        galones: '0',
      });
    }
  };

  return (
    <>
      <Navbar title="Registro de Reporte" />
      <Box sx={{ padding: 3 }}>
        <Paper sx={{ padding: 3, maxWidth: 600, margin: 'auto' }}>
          <Typography variant="body2" gutterBottom>
            <strong>Estado Supabase:</strong> {estadoConexion}
          </Typography>

          {formulario.fecha && (
            <Typography variant="body2" gutterBottom>
              <strong>Fecha del último registro:</strong> {formulario.fecha}
            </Typography>
          )}

          {alerta && (
            <Alert severity={alerta.tipo} sx={{ mb: 2 }}>
              {alerta.mensaje}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ marginTop: 4 }}>
            <Grid item xs={12}>
              <InputLabel id="nombreProduccion-label">Nombre del producto</InputLabel>
              <Select
                labelId="nombreProduccion-label"
                name="nombreProduccion"
                value={formulario.nombreProduccion}
                label="Nombre del producto"
                onChange={handleChange}
              >
                <MenuItem value="Agua Preparada">Agua Preparada</MenuItem>
                <MenuItem value="Graniplas Blanco">Graniplas Blanco</MenuItem>
                <MenuItem value="Granotex Blanco">Granotex Blanco</MenuItem>
                <MenuItem value="Graniplas Arena">Graniplas Arena</MenuItem>
                <MenuItem value="Granotex Arena">Granotex Arena</MenuItem>
                <MenuItem value="Relleno Fino ">Relleno Fino</MenuItem>
                <MenuItem value="Relleno Grueso ">Relleno Grueso</MenuItem>
                <MenuItem value="Mastik">Mastik</MenuItem>
                <MenuItem value="Estuco Interno">Estuco Interno</MenuItem>
                <MenuItem value="Estuco Externo">Estuco Externo</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad"
                name="cantidad"
                value={formulario.cantidad}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="CT"
                name="ct"
                value={formulario.ct}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Baldes"
                name="baldes"
                value={formulario.baldes}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Galones"
                name="galones"
                value={formulario.galones}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                Registrar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
}

export default RegistroReporte;
