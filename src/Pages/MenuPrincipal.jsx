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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffffff',
        p: 1,
      }}
    >
      <Grid
        container
        direction="column"
        spacing={4}
        alignItems="center"
        sx={{ width: '100%', maxWidth: 500 }}
      >
        {/* Tarjeta: Total General */}
        <Grid item sx={{ width: '100%' }}>
          <Card elevation={3} sx={{ height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total General
              </Typography>
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
        <Grid item sx={{ width: '100%' }}>
          <Card elevation={3} sx={{ height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Mes Actual
              </Typography>
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
        <Grid item sx={{ width: '100%' }}>
          <Card elevation={3} sx={{ height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Hoy
              </Typography>
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
        <Grid item sx={{ width: '100%' }}>
          <Card elevation={3} sx={{ height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Producto más producido este mes
              </Typography>
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
