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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { supabase } from '../Components/supabaseClient'; // Ajusta la ruta según tu proyecto

function Reportes() {
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const [cargando, setCargando] = useState(false);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleChange = (event) => {
    setMesSeleccionado(event.target.value);
  };

  const generarExcel = async () => {
    setCargando(true);

    const mesIndex = parseInt(mesSeleccionado);
    const mesNumero = mesIndex + 1;
    const mesStr = mesNumero.toString().padStart(2, '0'); // "01", "02", etc.

    const fechaInicio = `2025-${mesStr}-01`;
    const fechaFin = `2025-${mesStr}-31`;

    const { data, error } = await supabase
      .from('reporte') // Reemplaza por tu tabla real si es diferente
      .select('*')
      .gte('fecha', fechaInicio)
      .lte('fecha', fechaFin);

    if (error) {
      console.error('Error al obtener datos de Supabase:', error.message);
      setCargando(false);
      return;
    }

    if (!data || data.length === 0) {
      alert('No hay productos registrados en este mes.');
      setCargando(false);
      return;
    }

    // Convertir a hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const nombreMes = meses[mesIndex] || 'Reporte';
    saveAs(blob, `${nombreMes}_reporte.xlsx`);
    setCargando(false);
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
            padding: '100px',
            margin: 'auto',
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
                disabled={mesSeleccionado === '' || cargando}
                onClick={generarExcel}
              >
                {cargando ? 'Generando...' : 'Descargar Excel'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default Reportes;
