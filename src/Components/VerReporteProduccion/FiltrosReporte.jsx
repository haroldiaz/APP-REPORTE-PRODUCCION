import React from "react";
import { Grid, TextField, Select, MenuItem, Button, Paper } from "@mui/material";

const opcionesProduccion = [
    "Agua Preparada",
    "Mastik",
    "Estuco Interno",
    "Estuco Externo",
    "Graniplas Arena",
    "Granotex Arena",
    "Graniplas Blanco",
    "Granotex Blanco",
    "Graniplast Neutro",
    "Granotex Neutro",
    "Relleno Fino",
    "Relleno Grueso",

];

function FiltrosReporte({ filtros, onFiltroChange, onFiltrar, onLimpiar }) {
  return (
    <Paper sx={{ width: "90%", maxWidth: 1000, mb: 2, p: 2 }}>
      <Grid container spacing={2}>
        {/* Filtro por fecha */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Filtrar por fecha"
            type="date"
            name="fecha"
            value={filtros.fecha}
            onChange={onFiltroChange}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </Grid>

        {/* Filtro por nombre de producción */}
        <Grid item xs={12} sm={4}>
          <Select
            fullWidth
            name="nombreProduccion"
            value={filtros.nombreProduccion}
            onChange={onFiltroChange}
            displayEmpty
            size="small"
          >
            <MenuItem value="">Todos los productos</MenuItem>
            {opcionesProduccion.map((opcion) => (
              <MenuItem key={opcion} value={opcion}>
                {opcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {/* Botones */}
        <Grid item xs={12} sm={4} display="flex" gap={1}>
          <Button variant="contained" onClick={onFiltrar}>
            Filtrar
          </Button>
          <Button variant="outlined" onClick={onLimpiar}>
            Limpiar
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FiltrosReporte;
