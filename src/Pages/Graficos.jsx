import React, { useEffect, useState } from 'react';
import { supabase } from '../Components/supabaseClient';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  CircularProgress, Typography, Box, Paper, Stack
} from '@mui/material';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

function Graficos() {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: reportes, error } = await supabase
        .from('reporte')
        .select('ct, fecha, nombreProduccion');

      if (error) {
        console.error('Error al obtener datos:', error.message);
        setCargando(false);
        return;
      }

      setData(reportes);
      setCargando(false);
    };

    cargarDatos();
  }, []);

  // Agrupación por fecha (para barras y área)
  const datosBarras = (() => {
    const porDia = {};
    for (const item of data) {
      const fecha = new Date(item.fecha).toISOString().split('T')[0];
      porDia[fecha] = (porDia[fecha] || 0) + (item.ct || 0);
    }
    return Object.entries(porDia).map(([fecha, ct]) => ({ fecha, ct }));
  })();

  // Agrupación por producto (para pastel y radar)
  const datosPastel = (() => {
    const porProducto = {};
    for (const item of data) {
      const producto = item.nombreProduccion;
      porProducto[producto] = (porProducto[producto] || 0) + (item.ct || 0);
    }
    return Object.entries(porProducto).map(([nombre, ct]) => ({ name: nombre, value: ct }));
  })();

  // Agrupación por fecha y producto (para líneas y barras apiladas)
  const datosLineas = (() => {
    const agrupado = {};
    for (const item of data) {
      const fecha = new Date(item.fecha).toISOString().split('T')[0];
      const producto = item.nombreProduccion;
      const ct = item.ct || 0;

      if (!agrupado[fecha]) {
        agrupado[fecha] = { fecha };
      }
      agrupado[fecha][producto] = (agrupado[fecha][producto] || 0) + ct;
    }
    return Object.values(agrupado).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  })();

  const clavesProductos = (() => {
    const setProductos = new Set();
    data.forEach(item => setProductos.add(item.nombreProduccion));
    return Array.from(setProductos);
  })();

  return (
    <div>
      <Box p={4}>
        <Stack spacing={4}>
          {/* Gráfico de barras */}
          <Paper elevation={4} style={{ padding: '10px', width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Producción total por día
            </Typography>
            {cargando ? (
              <CircularProgress />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosBarras}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ct" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>

          {/* Gráfico de pastel */}
          <Paper elevation={4} style={{ padding: '10px', width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Producción total por producto
            </Typography>
            {cargando ? (
              <CircularProgress />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={datosPastel}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {datosPastel.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>

          {/* Gráfico de líneas */}
          <Paper elevation={4} style={{ padding: '10px', width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Evolución diaria por producto
            </Typography>
            {cargando ? (
              <CircularProgress />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosLineas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {clavesProductos.map((producto, index) => (
                    <Line
                      key={producto}
                      type="monotone"
                      dataKey={producto}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>

          {/* Gráfico de barras apiladas */}
          <Paper elevation={4} style={{ padding: '10px', width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Producción diaria por producto (Barras Apiladas)
            </Typography>
            {cargando ? (
              <CircularProgress />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosLineas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {clavesProductos.map((producto, index) => (
                    <Bar
                      key={producto}
                      dataKey={producto}
                      stackId="a"
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>

          {/* Gráfico de área */}
          <Paper elevation={4} style={{ padding: '10px', width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Producción acumulada en el tiempo
            </Typography>
            {cargando ? (
              <CircularProgress />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={datosBarras}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="ct" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Paper>

          {/* Gráfico de araña (Radar) */}
          <Paper elevation={4} style={{ padding: '10px', width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Comparación de producción por producto (Radar)
            </Typography>
            {cargando ? (
              <CircularProgress />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={datosPastel}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Producción"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Stack>
      </Box>
    </div>
  );
}

export default Graficos;
