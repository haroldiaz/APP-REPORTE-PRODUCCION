// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistroReporte from './Pages/RegistroReporte';
import VerReporteProduccion from './Pages/VerReporteProduccion';
import MenuPrincipal from './Pages/MenuPrincipal';  
import Estadisticas from './Pages/Estadisticas';
import Navbar from './Components/NavBar';
import { Box } from '@mui/material';
import Graficos from './Pages/Graficos';
import Reportes from './Pages/Reportes';
import Alertas from './Pages/Alertas';
import Configuracion from './Pages/Configuracion';

const drawerWidthOpen = 240;
const drawerWidthClosed = 70;

function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        {/* Menú lateral (Navbar) */}
        <Navbar open={drawerOpen} setOpen={setDrawerOpen} />

        {/* Contenido principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: drawerOpen ? `${drawerWidthOpen}px` : `${drawerWidthClosed}px`,
            transition: 'margin 0.3s',
          }}
        >
          <Routes>
            <Route path="/" element={<MenuPrincipal />} />
            <Route path="/HacerReporte" element={<RegistroReporte />} />
            <Route path="/VerReporte" element={<VerReporteProduccion />} />
            <Route path="/Estadisticas" element={<Estadisticas />} />
            <Route path="/Graficos" element={<Graficos />} />
            <Route path="/Reportes" element={<Reportes />} />
            <Route path="/Alerta" element={<Alertas />} />
            <Route path="/Configuracion" element={<Configuracion />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
