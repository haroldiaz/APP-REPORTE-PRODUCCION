import React, { useEffect, useState } from 'react';
import { supabase } from '../Components/supabaseClient';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Grid
} from '@mui/material';

// Importar íconos
import SummarizeIcon from '@mui/icons-material/Summarize'; // Total General
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; // Mes actual
import TodayIcon from '@mui/icons-material/Today'; // Hoy
import StarIcon from '@mui/icons-material/Star'; // Producto más producido

function MenuPrincipal() {
  const [data, setData] = useState([]);
  const [totalCT, setTotalCT] = useState(0);
  const [totalHoy, setTotalHoy] = useState(0);
  const [totalMes, setTotalMes] = useState(0);
  const [productoTop, setProductoTop] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      const { data, error } = await supabase
        .from('reporte')
        .select('ct, nombreProduccion, fecha');

      if (error) {
        console.error('Error al obtener datos:', error.message);
        setCargando(false);
        return;
      }

      setData(data);
    };

    obtenerDatos();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();
    const diaActual = hoy.getDate();

    let sumaTotal = 0;
    let sumaHoy = 0;
    let sumaMes = 0;

    const produccionPorProducto = {};

    for (const item of data) {
      const ct = item.ct || 0;
      sumaTotal += ct;

      const fecha = new Date(item.fecha);
      const esMismoAño = fecha.getFullYear() === añoActual;
      const esMismoMes = fecha.getMonth() === mesActual;
      const esMismoDia = fecha.getDate() === diaActual;

      if (esMismoAño && esMismoMes) {
        sumaMes += ct;

        const nombre = item.nombreProduccion;
        produccionPorProducto[nombre] = (produccionPorProducto[nombre] || 0) + ct;
      }

      if (esMismoAño && esMismoMes && esMismoDia) {
        sumaHoy += ct;
      }
    }

    let topProducto = null;
    let maxCT = 0;
    for (const nombre in produccionPorProducto) {
      if (produccionPorProducto[nombre] > maxCT) {
        topProducto = {
          nombre,
          total: produccionPorProducto[nombre]
        };
        maxCT = produccionPorProducto[nombre];
      }
    }

    setTotalCT(sumaTotal);
    setTotalHoy(sumaHoy);
    setTotalMes(sumaMes);
    setProductoTop(topProducto);
    setCargando(false);
  }, [data]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'block',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffffff',
        p: 4,
      }}
    >
      <Grid
        container
        spacing={4}
        sx={{ width: '100%', maxWidth: 680, height: "80%", maxHeight:400, margin: '0 auto' }}
      >
        {/* Tarjeta: Total General */}
        <Grid item xs={12} sm={4} sx={{ height: 200,width: 200, }}>
          <Card elevation={3} sx={{ height: "100%", display: 'flex', alignItems: 'center' }}>
            <CardContent sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <SummarizeIcon color="primary" />
                <Typography variant="h6">Total General</Typography>
              </Box>
              {cargando ? (
                <CircularProgress />
              ) : (
                <Typography variant="body1">
                  <strong>CT:</strong> {totalCT}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta: Total Mes Actual */}
        <Grid item xs={12} sm={6} sx={{ height: 200, width: 200}}>
          <Card elevation={3} sx={{ height: "100%", display: 'flex', alignItems: 'center' }}>
            <CardContent sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CalendarMonthIcon color="secondary" />
                <Typography variant="h6">Total Mes Actual</Typography>
              </Box>
              {cargando ? (
                <CircularProgress />
              ) : (
                <Typography variant="body1">
                  <strong>CT:</strong> {totalMes}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta: Total Hoy */}
        <Grid item xs={12} sm={6} sx={{ height: 200,width: 200, }}>
          <Card elevation={3} sx={{ height: "100%", display: 'flex', alignItems: 'center' }}>
            <CardContent sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TodayIcon color="success" />
                <Typography variant="h6">Total Hoy</Typography>
              </Box>
              {cargando ? (
                <CircularProgress />
              ) : (
                <Typography variant="body1">
                  <strong>CT:</strong> {totalHoy}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta: Producto más producido */}
        <Grid item xs={12} sm={6} sx={{ height: 250,width: '100%' }}>
          <Card elevation={3} sx={{ height: "100%", display: 'flex', alignItems: 'center' }}>
            <CardContent sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <StarIcon color="warning" />
                <Typography variant="h6">Producto más producido</Typography>
              </Box>
              {cargando ? (
                <CircularProgress />
              ) : productoTop ? (
                <>
                  <Typography variant="body1">
                    <strong>Producto:</strong> {productoTop.nombre}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total CT:</strong> {productoTop.total}
                  </Typography>
                </>
              ) : (
                <Typography>No hay datos de este mes.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MenuPrincipal;
