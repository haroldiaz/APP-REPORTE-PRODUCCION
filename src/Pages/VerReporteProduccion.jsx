import React, { useEffect, useState } from 'react';
import { supabase } from './../Components/supabaseClient';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  TextField, Select, MenuItem, Box
} from '@mui/material';

function VerReporteProduccion() {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState({});

  useEffect(() => {
    const obtenerReportes = async () => {
      const { data, error } = await supabase
        .from('reporte')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error al obtener reportes:', error.message);
      } else {
        setReportes(data);
      }
      setCargando(false);
    };

    obtenerReportes();
  }, []);

  const eliminarReporte = async (id) => {
    const { error } = await supabase
      .from('reporte')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar reporte:', error.message);
    } else {
      setReportes((prevReportes) => prevReportes.filter(r => r.id !== id));
    }
  };

  const comenzarEdicion = (reporte) => {
    setEditandoId(reporte.id);
    setFormulario(reporte);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormulario({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const guardarEdicion = async () => {
    const { error } = await supabase
      .from('reporte')
      .update(formulario)
      .eq('id', editandoId);

    if (error) {
      console.error('Error al actualizar reporte:', error.message);
    } else {
      setReportes(prev =>
        prev.map(r => (r.id === editandoId ? formulario : r))
      );
      cancelarEdicion();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 2,
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Ver Reporte de Producción
      </Typography>

      {cargando ? (
        <Typography variant="body1">Cargando reportes...</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ width: '90%', maxWidth: 1000 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Cantidad</strong></TableCell>
                <TableCell><strong>CTS</strong></TableCell>
                <TableCell><strong>Baldes</strong></TableCell>
                <TableCell><strong>Galones</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportes.map((reporte) => (
                <TableRow key={reporte.id}>
                  <TableCell>
                    {editandoId === reporte.id ? (
                      <TextField
                        type="date"
                        name="fecha"
                        value={formulario.fecha ? formulario.fecha.slice(0, 10) : ''}
                        onChange={handleChange}
                        size="small"
                      />
                    ) : (
                      new Date(reporte.fecha).toLocaleDateString()
                    )}
                  </TableCell>

                  {editandoId === reporte.id ? (
                    <>
                      <TableCell>
                        <Select
                          fullWidth
                          name="nombreProduccion"
                          value={formulario.nombreProduccion}
                          onChange={handleChange}
                          size="small"
                        >
                          <MenuItem value="Agua Preparada">Agua Preparada</MenuItem>
                          <MenuItem value="Mastik">Mastik</MenuItem>
                          <MenuItem value="Graniplas Blanco">Graniplas Blanco</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="cantidad"
                          value={formulario.cantidad}
                          onChange={handleChange}
                          size="small"
                          type="number"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="ct"
                          value={formulario.ct}
                          onChange={handleChange}
                          size="small"
                          type="number"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="baldes"
                          value={formulario.baldes}
                          onChange={handleChange}
                          size="small"
                          type="number"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="galones"
                          value={formulario.galones}
                          onChange={handleChange}
                          size="small"
                          type="number"
                        />
                      </TableCell>
                      <TableCell>
                        <Button color="primary" size="small" onClick={guardarEdicion}>
                          Guardar
                        </Button>
                        <Button color="inherit" size="small" onClick={cancelarEdicion}>
                          Cancelar
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{reporte.nombreProduccion}</TableCell>
                      <TableCell>{reporte.cantidad}</TableCell>
                      <TableCell>{reporte.ct}</TableCell>
                      <TableCell>{reporte.baldes}</TableCell>
                      <TableCell>{reporte.galones}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => comenzarEdicion(reporte)}
                          sx={{ mr: 1 }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => eliminarReporte(reporte.id)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              {reportes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No hay reportes registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default VerReporteProduccion;
