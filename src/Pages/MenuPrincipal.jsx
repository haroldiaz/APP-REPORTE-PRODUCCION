import React, { useEffect, useState } from 'react';
import Navbar from '../Components/NavBar';
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
  const [totalCT, setTotalCT] = useState(0);
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

      const sumaTotal = data.reduce((acc, curr) => acc + (curr.ct || 0), 0);
      setTotalCT(sumaTotal);

      const hoy = new Date();
      const mesActual = hoy.getMonth();
      const añoActual = hoy.getFullYear();

      const reportesEsteMes = data.filter(item => {
        const fecha = new Date(item.fecha);
        return (
          fecha.getMonth() === mesActual &&
          fecha.getFullYear() === añoActual
        );
      });

      const produccionPorProducto = {};
      for (const item of reportesEsteMes) {
        const nombre = item.nombreProduccion;
        const ct = item.ct || 0;
        if (!produccionPorProducto[nombre]) {
          produccionPorProducto[nombre] = 0;
        }
        produccionPorProducto[nombre] += ct;
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

      setProductoTop(topProducto);
      setCargando(false);
    };

    obtenerDatos();
  }, []);

  return (
    <div>
      <Navbar title="Menú Principal" />

      <Box p={3} display="flex" justifyContent="center">
        <Grid container spacing={3} justifyContent="center" maxWidth="md">
          {/* Card total CT */}
          <Grid item xs={12} sm={6}>
            <Card elevation={3} style={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Reporte Mensual
                </Typography>
                {cargando ? (
                  <CircularProgress />
                ) : (
                  <Typography variant="body1">
                    <strong>Total de CTS producidos:</strong> {totalCT}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Card producto más producido */}
          <Grid item xs={12} sm={6}>
            <Card elevation={3} style={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
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
                  <Typography variant="body1">
                    No hay datos de este mes.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default MenuPrincipal;
