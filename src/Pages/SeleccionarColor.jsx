import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Stack,
} from "@mui/material";

const productos = [
  { id: 1, nombre: "Graniplast Neutro" },
  { id: 2, nombre: "Graniplast Blanco" },
  { id: 3, nombre: "Mastik" },
  { id: 4, nombre: "Estuco Externo" },
  { id: 5, nombre: "Estuco Interno" },
];

export default function SeleccionarColor() {
  const [colores, setColores] = useState({});

  // Cargar colores desde localStorage al iniciar
  useEffect(() => {
    const savedColors = localStorage.getItem("coloresProductos");
    if (savedColors) {
      setColores(JSON.parse(savedColors));
    }
  }, []);

  // Manejar cambio y guardar en localStorage
  const manejarCambioColor = (id, color) => {
    setColores((prev) => {
      const updated = { ...prev, [id]: color };
      localStorage.setItem("coloresProductos", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <Box p={2}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Seleccionar color por producto
          </Typography>

          {/* Cards en vertical */}
          <Stack spacing={2}>
            {productos.map((producto) => (
              <Box
                key={producto.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid #ddd",
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography variant="body1">{producto.nombre}</Typography>
                <TextField
                  type="color"
                  size="small"
                  value={colores[producto.id] || "#000000"}
                  onChange={(e) =>
                    manejarCambioColor(producto.id, e.target.value)
                  }
                  sx={{
                    width: 60,
                    height: 40,
                    p: 0,
                    "& input": {
                      padding: 0,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>

          {/* Resumen */}
          <Box mt={3}>
            <Typography variant="subtitle1">Resumen de selección:</Typography>
            <ul>
              {productos.map(
                (producto) =>
                  colores[producto.id] && (
                    <li key={producto.id}>
                      {producto.nombre}:{" "}
                      <span
                        style={{
                          display: "inline-block",
                          width: 16,
                          height: 16,
                          backgroundColor: colores[producto.id],
                          border: "1px solid #ccc",
                          marginLeft: 8,
                        }}
                      ></span>{" "}
                      {colores[producto.id]}
                    </li>
                  )
              )}
            </ul>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
