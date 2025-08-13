import React, { useEffect, useState } from 'react';
import { supabase } from '../Components/supabaseClient';
import {
  Box, Button, MenuItem, Select, TextField, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Switch, IconButton
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete'; // ← Importado
import { useAlertas } from '../Hooks/useAlertas'; // Importa el hook

const productosDisponibles = [
  'Agua Preparada',
  'Graniplas Blanco',
  'Granotex Blanco',
  'Graniplas Arena',
  'Granotex Arena',
  'Relleno Fino',
  'Relleno Grueso',
  'Mastik',
  'Estuco Interno',
  'Estuco Externo'
];

function Alerta() {
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [mensaje, setMensaje] = useState('');
 
 const { alertas, setAlertas, cargarAlertas } = useAlertas();

 useEffect(() => {
  cargarAlertas();
}, [cargarAlertas]); 

 

  const guardarAlerta = async () => {
    if (!producto || !cantidad) {
      setMensaje('Por favor completa todos los campos.');
      return;
    }

    const {  error } = await supabase
      .from('alertas')
      .insert([{
        producto,
        cantidad: parseInt(cantidad),
        activa: true,
        mensaje: `Alerta creada para ${producto} con ${cantidad} cortes.`
      }])
      .select('*');

    if (error) {
      setMensaje('Error al guardar la alerta.');
      console.error(error);
    } else {
      setMensaje('✅ Alerta guardada correctamente.');
      setProducto('');
      setCantidad('');
      cargarAlertas();
    }
  };

  const actualizarAlerta = async (id, nuevaCantidad, nuevaActiva) => {
    const { error } = await supabase
      .from('alertas')
      .update({
        cantidad: parseInt(nuevaCantidad),
        activa: nuevaActiva
      })
      .eq('id', id);

    if (error) {
      console.error('Error al actualizar alerta:', error);
      setMensaje('❌ No se pudo actualizar.');
    } else {
      setMensaje('✅ Alerta actualizada.');
      cargarAlertas();
    }
  };

  const eliminarAlerta = async (id) => {
    const { error } = await supabase.from('alertas').delete().eq('id', id);
    if (error) {
      console.error('Error al eliminar alerta:', error);
      setMensaje('❌ No se pudo eliminar la alerta.');
    } else {
      setMensaje('🗑️ Alerta eliminada.');
      cargarAlertas();
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 800, margin: 'auto', p: 4, mt: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <WarningIcon color="warning" sx={{ fontSize: 40, mr: 1 }} />
        <Typography variant="h5">Crear alerta de corte</Typography>
      </Box>

      <Select
        fullWidth
        value={producto}
        onChange={(e) => setProducto(e.target.value)}
        sx={{ mb: 2 }}
        displayEmpty
      >
        <MenuItem value="" disabled>Selecciona un producto</MenuItem>
        {productosDisponibles.map((prod) => (
          <MenuItem key={prod} value={prod}>{prod}</MenuItem>
        ))}
      </Select>

      <TextField
        label="Cantidad de cortes para alerta"
        type="number"
        fullWidth
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="warning" onClick={guardarAlerta} fullWidth>
        Guardar Alerta
      </Button>

      {mensaje && (
        <Typography variant="body2" mt={2} color={mensaje.includes('Error') || mensaje.includes('❌') ? 'error' : 'green'}>
          {mensaje}
        </Typography>
      )}

      <Typography variant="h6" mt={4} mb={2}>Alertas Registradas</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Activa</TableCell>
              <TableCell>Guardar</TableCell>
              <TableCell>Eliminar</TableCell> {/* ← Nueva columna */}
            </TableRow>
          </TableHead>
          <TableBody>
            {alertas.map((alerta) => (
              <TableRow key={alerta.id}>
                <TableCell>{alerta.producto}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={alerta.cantidad}
                    onChange={(e) => {
                      const nuevaCantidad = e.target.value;
                      setAlertas(prev =>
                        prev.map(a => a.id === alerta.id ? { ...a, cantidad: nuevaCantidad } : a)
                      );
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={alerta.activa}
                    onChange={(e) => {
                      const nuevaActiva = e.target.checked;
                      setAlertas(prev =>
                        prev.map(a => a.id === alerta.id ? { ...a, activa: nuevaActiva } : a)
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => actualizarAlerta(alerta.id, alerta.cantidad, alerta.activa)}
                  >
                    <SaveIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => eliminarAlerta(alerta.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default Alerta;
