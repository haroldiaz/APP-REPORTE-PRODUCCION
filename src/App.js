// src/App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import RegistroReporte from "./Pages/RegistroReporte";
import VerReporteProduccion from "./Pages/VerReporteProduccion";
import MenuPrincipal from "./Pages/MenuPrincipal";
import Estadisticas from "./Pages/Estadisticas";
import Navbar from "./Components/NavBar";
import { Box } from "@mui/material";
import Graficos from "./Pages/Graficos";
import Reportes from "./Pages/Reportes";
import Alertas from "./Pages/Alertas";
import Configuracion from "./Pages/Configuracion";
import ReporteProducto from "./Pages/ReporteProducto";
import SeleccionarColor from "./Pages/SeleccionarColor";
import RegistroLogs from "./Pages/RegistroLogs";
import Login from "./Pages/Login";

const drawerWidthOpen = 240;
const drawerWidthClosed = 70;

function AppContent() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const location = useLocation();

  // ✅ Ocultar Navbar en login
  const mostrarNavbar = location.pathname !== "/";

  return (
    <Box sx={{ display: "flex" }}>
      {/* Navbar solo si no estamos en login */}
      {mostrarNavbar && (
        <Navbar open={drawerOpen} setOpen={setDrawerOpen} />
      )}

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: mostrarNavbar
            ? drawerOpen
              ? `${drawerWidthOpen}px`
              : `${drawerWidthClosed}px`
            : 0,
          transition: "margin 0.3s",
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<MenuPrincipal />} />
          <Route path="/HacerReporte" element={<RegistroReporte />} />
          <Route path="/VerReporte" element={<VerReporteProduccion />} />
          <Route path="/Estadisticas" element={<Estadisticas />} />
          <Route path="/Graficos" element={<Graficos />} />
          <Route path="/Reportes" element={<Reportes />} />
          <Route path="/Alerta" element={<Alertas />} />
          <Route path="/Configuracion" element={<Configuracion />} />
          <Route path="/ReporteProducto" element={<ReporteProducto />} />
          <Route path="/SeleccionColor" element={<SeleccionarColor />} />
          <Route path="/Logs" element={<RegistroLogs />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
