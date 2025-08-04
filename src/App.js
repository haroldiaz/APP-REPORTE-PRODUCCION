
import '../src/Styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistroReporte from './Pages/RegistroReporte';
import VerReporteProduccion from './Pages/VerReporteProduccion';

function App() {
  return (
     <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<RegistroReporte />} />
          <Route path="/verReporte" element={<VerReporteProduccion />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
