import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { supabase } from "./../Components/supabaseClient";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ReporteProducto() {
  const [productos, setProductos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    fecha: "",
    nota: "",
    estado: "Devolución",
  });

  // Cargar datos al iniciar
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const { data, error } = await supabase.from("ReporteProducto").select("*");
    if (!error) setProductos(data);
    else console.error(error);
  };

  const abrirModal = (producto = null) => {
    if (producto) {
      setEditId(producto.id);
      setForm({
        nombre: producto.nombre,
        fecha: producto.fecha,
        nota: producto.nota,
        estado: producto.estado,
      });
    } else {
      setEditId(null);
      setForm({ nombre: "", fecha: "", nota: "", estado: "Devolución" });
    }
    setOpen(true);
  };

  const cerrarModal = () => setOpen(false);

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    if (editId) {
      // Editar en Supabase
      const { error } = await supabase
        .from("ReporteProducto")
        .update(form)
        .eq("id", editId);
      if (error) console.error(error);
    } else {
      // Insertar en Supabase
      const { error } = await supabase.from("ReporteProducto").insert([form]);
      if (error) console.error(error);
    }

    await fetchProductos();
    cerrarModal();
  };

  const eliminarProducto = async (id) => {
    const { error } = await supabase
      .from("ReporteProducto")
      .delete()
      .eq("id", id);
    if (error) console.error(error);
    else fetchProductos();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Encabezado con botón Registrar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Reporte de Productos</Typography>
        <Button
          variant="contained"
          startIcon={<AppRegistrationIcon />}
          onClick={() => abrirModal()}
        >
          Registrar
        </Button>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Nota</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay productos registrados
                </TableCell>
              </TableRow>
            ) : (
              productos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.fecha}</TableCell>
                  <TableCell>{p.nota}</TableCell>
                  <TableCell>{p.estado}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => abrirModal(p)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => eliminarProducto(p.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal con formulario */}
      <Dialog open={open} onClose={cerrarModal}>
        <DialogTitle>
          {editId ? "Editar Producto" : "Registrar Producto"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Nombre del producto"
            name="nombre"
            value={form.nombre}
            onChange={manejarCambio}
            fullWidth
            required
          />
          <TextField
            label="Fecha"
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={manejarCambio}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
          <TextField
            label="Nota"
            name="nota"
            value={form.nota}
            onChange={manejarCambio}
            multiline
            rows={3}
            fullWidth
          />
          <Select
            name="estado"
            value={form.estado}
            onChange={manejarCambio}
            fullWidth
          >
            <MenuItem value="Devolución">Devolución</MenuItem>
            <MenuItem value="Dañado">Dañado</MenuItem>
            <MenuItem value="Cambio">Cambio</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal} color="inherit">
            Cancelar
          </Button>
          <Button onClick={guardarProducto} variant="contained">
            {editId ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ReporteProducto;
