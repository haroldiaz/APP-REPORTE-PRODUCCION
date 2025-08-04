
import '../src/Styles/App.css';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import RegistroReporte from './Pages/RegistroReporte';
import VerReporteProduccion from './Pages/VerReporteProduccion';

function App() {
  return (
     <div className="App">
      <BrowserRouter>
      
      <Router>
        <Routes>
          <Route path="/" element={<RegistroReporte />} />
          <Route path="/verReporte" element={<VerReporteProduccion />} />
        </Routes>
      </Router>
    </BrowserRouter>
    </div>
  );
}

export default App;
