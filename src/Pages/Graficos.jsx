import React, { useEffect, useState } from 'react';
import { supabase } from '../Components/supabaseClient';
import Navbar from '../Components/NavBar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { CircularProgress, Typography, Box, Paper, Grid } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#BA68C8', '#EF5350', '#26A69A', '#FFA726'];

function Graficos() {
  const [data, setData] = useState([]);
  const [pieData, setPieData] = useState([]);
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

      // Producción por día para el gráfico de barras
      const produccionPorDia = {};
      // Producción por producto para el gráfico de pastel
      const produccionPorProducto = {};

      for (const item of reportes) {
        const fecha = new Date(item.fecha);
        const fechaStr = fecha.toISOString().split('T')[0]; // formato YYYY-MM-DD
        produccionPorDia[fechaStr] = (produccionPorDia[fechaStr] || 0) + (item.ct || 0);

        const nombre = item.nombreProduccion || 'Desconocido';
        produccionPorProducto[nombre] = (produccionPorProducto[nombre] || 0) + (item.ct || 0);
      }

      const datosBarras = Object.keys(produccionPorDia).map((fecha) => ({
        fecha,
        ct: produccionPorDia[fecha]
      })).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      const datosPastel = Object.keys(produccionPorProducto).map((nombre) => ({
        name: nombre,
        value: produccionPorProducto[nombre]
      }));

      setData(datosBarras);
      setPieData(datosPastel);
      setCargando(false);
    };

    cargarDatos();
  }, []);

  return (
    <div>
     

      <Box p={4}>
        <Grid container spacing={4}>
          {/* Gráfico de barras */}
          <Grid item xs={12} md={6}>
            <Paper elevation={4} style={{ padding: '10px' }}>
              <Typography variant="h6" gutterBottom>
                Producción diaria (CT por día)
              </Typography>
              {cargando ? (
                <CircularProgress />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ct" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>

          {/* Gráfico de pastel */}
          <Grid item xs={12} md={6}>
            <Paper elevation={4} style={{ padding: '10px' }}>
              <Typography variant="h6" gutterBottom>
                Producción total por producto
              </Typography>
              {cargando ? (
                <CircularProgress />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Graficos;
