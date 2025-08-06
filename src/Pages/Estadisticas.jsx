import React, { useEffect, useState } from 'react';
import Navbar from '../Components/NavBar';
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

function Estadisticas() {
  const [data, setData] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [mesComparar1, setMesComparar1] = useState(0);
  const [mesComparar2, setMesComparar2] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [ctMes, setCtMes] = useState(0);
  const [ctComparar1, setCtComparar1] = useState(0);
  const [ctComparar2, setCtComparar2] = useState(0);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  useEffect(() => {
    const obtenerDatos = async () => {
      const { data, error } = await supabase
        .from('reporte')
        .select('ct, fecha');

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

    setCtMes(totalMes(mesSeleccionado));
    setCtComparar1(totalMes(mesComparar1));
    setCtComparar2(totalMes(mesComparar2));
  }, [mesSeleccionado, mesComparar1, mesComparar2, data]);

  return (
    <div>
      <Navbar title="Estadísticas" />
      <Box p={3}>
        <Grid container spacing={3} justifyContent="center">
          
          {/* Card 1: Total de un solo mes */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  <InsertChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  CT producidos por mes
                </Typography>

                {cargando ? (
                  <CircularProgress />
                ) : (
                  <>
                    <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
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
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  <CompareArrowsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Comparar Meses
                </Typography>

                {cargando ? (
                  <CircularProgress />
                ) : (
                  <>
                    {/* Mes 1 */}
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

                    {/* Mes 2 */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
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

                    {/* Resultados */}
                    <Typography variant="body1" gutterBottom>
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
        </Grid>
      </Box>
    </div>
  );
}

export default Estadisticas;
