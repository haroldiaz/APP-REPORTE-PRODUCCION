import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

function Reportes() {
  const [mesSeleccionado, setMesSeleccionado] = useState('');

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleChange = (event) => {
    setMesSeleccionado(event.target.value);
  };

  return (
    <div style={{ height: '100vh' }}>
      <Box
        display="flex"
        justifyContent="left"
        alignItems="center"
        height="80%"
      >
        <Card
          elevation={4}
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '80px'
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom align="center">
              Generar reporte en Excel
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Selecciona el mes</InputLabel>
              <Select
                value={mesSeleccionado}
                onChange={handleChange}
                label="Selecciona el mes"
              >
                {meses.map((mes, index) => (
                  <MenuItem key={index} value={index}>
                    {mes}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={!mesSeleccionado}
                onClick={() => alert('Funcionalidad en desarrollo')}
              >
                Descargar Excel
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default Reportes;
