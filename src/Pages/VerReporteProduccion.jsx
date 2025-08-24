import React, { useEffect, useState } from 'react';
import { supabase } from './../Components/supabaseClient';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  TextField, Select, MenuItem, Box, TablePagination, Chip,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import FiltrosReporte from './../Components/VerReporteProduccion/FiltrosReporte';

function VerReporteProduccion() {
  const [reportes, setReportes] = useState([]);
  const [reportesFiltrados, setReportesFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState({});
  const [filtros, setFiltros] = useState({ fecha: '', nombreProduccion: '' });

  // 📌 Estados para confirmación
  const [dialogOpen, setDialogOpen] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null); // { tipo: 'eliminar' | 'editar', reporte }

  // 📌 Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
        setReportesFiltrados(data);
      }
      setCargando(false);
    };

    obtenerReportes();
  }, []);

  // 📌 Funciones de filtrado
  const aplicarFiltros = () => {
    let filtrados = [...reportes];

    if (filtros.fecha) {
      filtrados = filtrados.filter(r =>
        r.fecha?.slice(0, 10) === filtros.fecha
      );
    }

    if (filtros.nombreProduccion) {
      filtrados = filtrados.filter(r =>
        r.nombreProduccion === filtros.nombreProduccion
      );
    }

    setReportesFiltrados(filtrados);
    setPage(0);
  };

  const onFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({ fecha: '', nombreProduccion: '' });
    setReportesFiltrados(reportes);
    setPage(0);
  };

  // 📌 Manejo de confirmación
  const abrirDialogo = (tipo, reporte) => {
    setAccionPendiente({ tipo, reporte });
    setDialogOpen(true);
  };

  const cerrarDialogo = () => {
    setDialogOpen(false);
    setAccionPendiente(null);
  };

  const confirmarAccion = async () => {
    if (accionPendiente?.tipo === 'eliminar') {
      await eliminarReporte(accionPendiente.reporte.id);
    } else if (accionPendiente?.tipo === 'editar') {
      comenzarEdicion(accionPendiente.reporte);
    }
    cerrarDialogo();
  };

  // 📌 CRUD
  const eliminarReporte = async (id) => {
    const { error } = await supabase
      .from('reporte')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar reporte:', error.message);
    } else {
      const actualizados = reportes.filter(r => r.id !== id);
      setReportes(actualizados);
      setReportesFiltrados(actualizados);
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
      const actualizados = reportes.map(r => (r.id === editandoId ? formulario : r));
      setReportes(actualizados);
      setReportesFiltrados(actualizados);
      cancelarEdicion();
    }
  };

  // 📌 Paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 📌 Día de la semana con color
  const obtenerDiaSemana = (fecha) => {
    const opciones = { weekday: 'long' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  const colorChipPorDia = (dia) => {
    switch (dia.toLowerCase()) {
      case 'lunes': return 'primary';
      case 'martes': return 'success';
      case 'miércoles': return 'warning';
      case 'jueves': return 'secondary';
      case 'viernes': return 'error';
      case 'sábado': return 'info';
      case 'domingo': return 'default';
      default: return 'default';
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
      {/* Filtros */}
      <FiltrosReporte
        filtros={filtros}
        onFiltroChange={onFiltroChange}
        onFiltrar={aplicarFiltros}
        onLimpiar={limpiarFiltros}
      />

      {cargando ? (
        <Typography variant="body1">Cargando reportes...</Typography>
      ) : (
        <Paper sx={{ width: '90%', maxWidth: 1000 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Fecha</strong></TableCell>
                  <TableCell><strong>Día</strong></TableCell>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>CTS</strong></TableCell>
                  <TableCell><strong>Baldes</strong></TableCell>
                  <TableCell><strong>Galones</strong></TableCell>
                  <TableCell><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportesFiltrados
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((reporte) => {
                    const dia = obtenerDiaSemana(reporte.fecha);
                    return (
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

                        <TableCell>
                          <Chip
                            label={dia}
                            color={colorChipPorDia(dia)}
                            size="small"
                          />
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
                            <TableCell>{reporte.ct}</TableCell>
                            <TableCell>{reporte.baldes}</TableCell>
                            <TableCell>{reporte.galones}</TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => abrirDialogo('editar', reporte)}
                                sx={{ mr: 1 }}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => abrirDialogo('eliminar', reporte)}
                              >
                                Eliminar
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                {reportesFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No hay reportes que coincidan con los filtros.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 📌 Paginación */}
          <TablePagination
            component="div"
            count={reportesFiltrados.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Filas por página"
          />
        </Paper>
      )}

      {/* 📌 Diálogo de confirmación */}
      <Dialog open={dialogOpen} onClose={cerrarDialogo}>
        <DialogTitle>
          {accionPendiente?.tipo === 'eliminar' ? 'Confirmar eliminación' : 'Confirmar edición'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {accionPendiente?.tipo === 'eliminar'
              ? `¿Estás seguro de que quieres eliminar el reporte del día ${new Date(accionPendiente?.reporte.fecha).toLocaleDateString()}?`
              : `¿Quieres editar el reporte del día ${new Date(accionPendiente?.reporte.fecha).toLocaleDateString()}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogo} color="inherit">Cancelar</Button>
          <Button onClick={confirmarAccion} color={accionPendiente?.tipo === 'eliminar' ? 'error' : 'primary'} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default VerReporteProduccion;
