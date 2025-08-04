import React, { useEffect, useState } from 'react';
import { supabase } from './../Components/supabaseClient';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';

function VerReporteProduccion() {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerReportes = async () => {
      const { data, error } = await supabase.from('reporte').select('*').order('fecha', { ascending: false });

      if (error) {
        console.error('Error al obtener reportes:', error.message);
      } else {
        setReportes(data);
      }
      setCargando(false);
    };

    obtenerReportes();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Ver Reporte de Producción</Typography>

      {cargando ? (
        <p>Cargando reportes...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Cantidad</strong></TableCell>
                <TableCell><strong>CTS</strong></TableCell>
                <TableCell><strong>Baldes</strong></TableCell>
                <TableCell><strong>Galones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportes.map((reporte) => (
                <TableRow key={reporte.id}>
                  <TableCell>{reporte.fecha}</TableCell>
                  <TableCell>{reporte.nombreProduccion}</TableCell>
                  <TableCell>{reporte.cantidad}</TableCell>
                  <TableCell>{reporte.ct}</TableCell>
                  <TableCell>{reporte.baldes}</TableCell>
                  <TableCell>{reporte.galones}</TableCell>
                </TableRow>
              ))}
              {reportes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No hay reportes registrados.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default VerReporteProduccion;
