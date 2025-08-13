import React, { useState, useEffect } from 'react';
import { supabase } from './../Components/supabaseClient';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

function RegistroReporte() {
  const [formulario, setFormulario] = useState({
    fecha: '',
    nombreProduccion: 'Agua Preparada',
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
    const fechaActual = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('reporte')
      .insert([{
        fecha: fechaActual,
        nombreProduccion: formulario.nombreProduccion,
       
        ct: parseInt(formulario.ct || '0'),
        baldes: parseInt(formulario.baldes || '0'),
        galones: parseInt(formulario.galones || '0')
      }]);

    if (error) {
      console.error('❌ Error al insertar reporte:', error);
      setAlerta({ tipo: 'error', mensaje: 'Error al guardar el reporte.' });
    } else {
      setAlerta({ tipo: 'success', mensaje: 'Reporte registrado correctamente.' });
      setFormulario({
        fecha: fechaActual,
        nombreProduccion: 'Agua Preparada',
        cantidad: '0',
        ct: '0',
        baldes: '0',
        galones: '0',
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        px: 2,
      }}
    >
      <Paper elevation={4} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Registro de Reporte
          </Typography>

          <Typography variant="body2" color="textSecondary">
            <strong>Estado Supabase:</strong> {estadoConexion}
          </Typography>

          {formulario.fecha && (
            <Typography variant="body2" color="textSecondary">
              <strong>Fecha del último registro:</strong> {formulario.fecha}
            </Typography>
          )}
        </Box>

        {alerta && (
          <Alert severity={alerta.tipo} sx={{ mb: 2 }}>
            {alerta.mensaje}
          </Alert>
        )}

        <Box component="form" noValidate autoComplete="off" display="flex" flexDirection="column" gap={2}>
          <Box>
            <InputLabel id="nombreProduccion-label">Nombre del producto</InputLabel>
            <Select
              labelId="nombreProduccion-label"
              name="nombreProduccion"
              value={formulario.nombreProduccion}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Agua Preparada">Agua Preparada</MenuItem>
              <MenuItem value="Graniplas Blanco">Graniplas Blanco</MenuItem>
              <MenuItem value="Granotex Blanco">Granotex Blanco</MenuItem>
              <MenuItem value="Graniplas Arena">Graniplas Arena</MenuItem>
              <MenuItem value="Granotex Arena">Granotex Arena</MenuItem>
              <MenuItem value="Relleno Fino">Relleno Fino</MenuItem>
              <MenuItem value="Relleno Grueso">Relleno Grueso</MenuItem>
              <MenuItem value="Mastik">Mastik</MenuItem>
              <MenuItem value="Estuco Interno">Estuco Interno</MenuItem>
              <MenuItem value="Estuco Externo">Estuco Externo</MenuItem>
              <MenuItem value="Graniplast Neutro">Graniplast Neutro</MenuItem>
              <MenuItem value="Granotex Neutro">Granotex Neutro</MenuItem>
            </Select>
             
          </Box>


          <TextField
            fullWidth
            type="number"
            label="CT"
            name="ct"
            value={formulario.ct}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            type="number"
            label="Baldes"
            name="baldes"
            value={formulario.baldes}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            type="number"
            label="Galones"
            name="galones"
            value={formulario.galones}
            onChange={handleChange}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Registrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default RegistroReporte;
