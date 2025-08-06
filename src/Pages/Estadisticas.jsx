import React, { useEffect, useState } from 'react';

import { supabase } from '../Components/supabaseClient';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

function Estadisticas() {

  const [data, setData] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [mesComparar1, setMesComparar1] = useState(0);
  const [mesComparar2, setMesComparar2] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [ctMes, setCtMes] = useState(0);
  const [ctComparar1, setCtComparar1] = useState(0);
  const [ctComparar2, setCtComparar2] = useState(0);
  const [productoMenosProducido, setProductoMenosProducido] = useState(null);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  useEffect(() => {
    const obtenerDatos = async () => {
      const { data, error } = await supabase
        .from('reporte')
        .select('ct, fecha, nombreProduccion');

      if (error) {
        console.error('❌ Error al obtener datos:', error.message);
        setCargando(false);
        return;
      }

      setData(data);
      setCargando(false);
    };

    obtenerDatos();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const añoActual = new Date().getFullYear();

    const totalMes = (mes) =>
      data
        .filter(item => {
          const fecha = new Date(item.fecha);
          return (
            fecha.getFullYear() === añoActual &&
            fecha.getMonth() === mes
          );
        })
        .reduce((acc, curr) => acc + (curr.ct || 0), 0);

    const datosMes = data.filter(item => {
      const fecha = new Date(item.fecha);
      return (
        fecha.getFullYear() === añoActual &&
        fecha.getMonth() === mesSeleccionado
      );
    });

    const produccionPorProducto = {};
    for (const item of datosMes) {
      const nombre = item.nombreProduccion;
      const ct = item.ct || 0;
      produccionPorProducto[nombre] = (produccionPorProducto[nombre] || 0) + ct;
    }

    let minCT = Infinity;
    let productoMenos = null;
    for (const nombre in produccionPorProducto) {
      if (produccionPorProducto[nombre] < minCT) {
        minCT = produccionPorProducto[nombre];
        productoMenos = {
          nombre,
          total: produccionPorProducto[nombre]
        };
      }
    }

    setCtMes(totalMes(mesSeleccionado));
    setCtComparar1(totalMes(mesComparar1));
    setCtComparar2(totalMes(mesComparar2));
    setProductoMenosProducido(productoMenos);

  }, [mesSeleccionado, mesComparar1, mesComparar2, data]);

  return (
    <div>
      
      <Box p={3} display="flex" justifyContent="center">
  <Grid container spacing={3} direction="column" style={{ maxWidth: 500, width: '100%' }}>
    {/* Card 1: Total de un solo mes */}
    <Grid item xs={12}>
      <Card elevation={3} style={{ minHeight: '180px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <InsertChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            CT producidos por mes
          </Typography>
          {cargando ? (
            <CircularProgress />
          ) : (
            <>
              <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                <InputLabel id="mes-label">Selecciona un mes</InputLabel>
                <Select
                  labelId="mes-label"
                  value={mesSeleccionado}
                  label="Selecciona un mes"
                  onChange={(e) => setMesSeleccionado(e.target.value)}
                >
                  {meses.map((mes, index) => (
                    <MenuItem key={index} value={index}>
                      {mes}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="body1">
                Total de CT en <strong>{meses[mesSeleccionado]}</strong>: <strong>{ctMes}</strong>
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Grid>

    {/* Card 2: Comparar dos meses */}
    <Grid item xs={12}>
      <Card elevation={3} style={{ minHeight: '180px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <CompareArrowsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Comparar Meses
          </Typography>
          {cargando ? (
            <CircularProgress />
          ) : (
            <>
              <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                <InputLabel id="mes1-label">Mes 1</InputLabel>
                <Select
                  labelId="mes1-label"
                  value={mesComparar1}
                  label="Mes 1"
                  onChange={(e) => setMesComparar1(e.target.value)}
                >
                  {meses.map((mes, index) => (
                    <MenuItem key={index} value={index}>
                      {mes}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="mes2-label">Mes 2</InputLabel>
                <Select
                  labelId="mes2-label"
                  value={mesComparar2}
                  label="Mes 2"
                  onChange={(e) => setMesComparar2(e.target.value)}
                >
                  {meses.map((mes, index) => (
                    <MenuItem key={index} value={index}>
                      {mes}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="body1">
                <strong>{meses[mesComparar1]}:</strong> {ctComparar1} CT
              </Typography>
              <Typography variant="body1">
                <strong>{meses[mesComparar2]}:</strong> {ctComparar2} CT
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Grid>

    {/* Card 3: Producto menos producido */}
    <Grid item xs={12}>
      <Card elevation={3} style={{ minHeight: '180px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <TrendingDownIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Producto menos producido ({meses[mesSeleccionado]})
          </Typography>
          {cargando ? (
            <CircularProgress />
          ) : productoMenosProducido ? (
            <>
              <Typography variant="body1">
                <strong>Producto:</strong> {productoMenosProducido.nombre}
              </Typography>
              <Typography variant="body1">
                <strong>Total CT:</strong> {productoMenosProducido.total}
              </Typography>
            </>
          ) : (
            <Typography>No hay datos para este mes.</Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</Box>

    </div>
  );
}

export default Estadisticas;
