
import '../src/Styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistroReporte from './Pages/RegistroReporte';
import VerReporteProduccion from './Pages/VerReporteProduccion';
import MenuPrincipal from './Pages/MenuPrincipal';  
import Estadisticas from './Pages/Estadisticas';
function App() {
  return (
     <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MenuPrincipal />} />
          <Route path="/HacerReporte" element={<RegistroReporte />} />
          <Route path="/verReporte" element={<VerReporteProduccion />} />
          <Route path="/Estadisticas" element={<Estadisticas />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
