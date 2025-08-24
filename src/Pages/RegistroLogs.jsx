import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RegistroLogs() {
  const [logs, setLogs] = useState([
    { id: 1, accion: "Editar producto", fecha: "2025-08-23", hora: "22:45" },
    { id: 2, accion: "Eliminar proveedor", fecha: "2025-08-22", hora: "20:15" },
    { id: 3, accion: "Editar usuario", fecha: "2025-08-21", hora: "18:30" },
  ]);

  const handleEditar = (id) => {
    console.log("Editar log con id:", id);
    // Aquí puedes abrir un modal o hacer lógica de edición
  };

  const handleEliminar = (id) => {
    console.log("Eliminar log con id:", id);
    setLogs(logs.filter((log) => log.id !== id));
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Registro de Logs
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Acción</TableCell>
              <TableCell sx={{ color: "white" }}>Fecha</TableCell>
              <TableCell sx={{ color: "white" }}>Hora</TableCell>
              <TableCell sx={{ color: "white" }}>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.accion}</TableCell>
                <TableCell>{log.fecha}</TableCell>
                <TableCell>{log.hora}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditar(log.id)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEliminar(log.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
