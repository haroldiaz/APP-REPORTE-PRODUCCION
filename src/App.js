
import '../src/Styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistroReporte from './Pages/RegistroReporte';

function App() {
  return (
     <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<RegistroReporte />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
