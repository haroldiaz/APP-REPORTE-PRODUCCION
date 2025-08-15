import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

function ReporteProducto() {
  const [productos, setProductos] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    fecha: "",
    nota: "",
    estado: "Evolución",
  });

  // Cargar productos al iniciar
  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("ReporteProducto")
        .select("*")
        .order("fecha", { ascending: false });

      if (error) {
        console.error("Error cargando datos:", error.message);
      } else {
        setProductos(data);
      }
    };
    fetchProductos();
  }, []);

  const abrirModal = () => setOpen(true);
  const cerrarModal = () => setOpen(false);

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registrarProducto = async (e) => {
    e.preventDefault();

    // Insertar en Supabase
    const { data, error } = await supabase
      .from("ReporteProducto")
      .insert([
        {
          nombre: form.nombre,
          fecha: form.fecha,
          nota: form.nota,
          estado: form.estado,
        },
      ])
      .select();

    if (error) {
      console.error("Error al insertar:", error.message);
      return;
    }

    // Agregar a la tabla local sin recargar
    setProductos((prev) => [...data, ...prev]);

    // Resetear formulario
    setForm({ nombre: "", fecha: "", nota: "", estado: "Evolución" });
    cerrarModal();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Reporte de Productos
      </Typography>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Nota</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Botón Registrar */}
      <Button
        variant="contained"
        startIcon={<AppRegistrationIcon />}
        onClick={abrirModal}
      >
        Registrar
      </Button>

      {/* Modal con formulario */}
      <Dialog open={open} onClose={cerrarModal}>
        <DialogTitle>Registrar Producto</DialogTitle>
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
            <MenuItem value="Evolución">Devolución</MenuItem>
            <MenuItem value="Dañado">Dañado</MenuItem>
            <MenuItem value="Cambio">Cambio</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal} color="inherit">
            Cancelar
          </Button>
          <Button onClick={registrarProducto} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ReporteProducto;
