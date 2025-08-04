import React, { useState, useEffect } from 'react';
import { supabase } from './../Components/supabaseClient';

function RegistroReporte() {
  const today = new Date().toISOString().split('T')[0];

  const [formulario, setFormulario] = useState({
    fecha: today,
    nombreProduccion: '',
    cantidad: '0',
    cts: '0',
    baldes: '0',
    galones: '0',
  });

  const [estadoConexion, setEstadoConexion] = useState('Verificando conexión...');

  useEffect(() => {
    const verificarConexion = async () => {
      const { error } = await supabase.from('reporte').select('*').limit(1);

      if (error) {
        console.error('❌ Error de conexión a Supabase:', error.message);
        setEstadoConexion('❌ No conectado a Supabase');
      } else {
        console.log('✅ Conexión a Supabase exitosa');
        setEstadoConexion('✅ Conectado a Supabase');
      }
    };

    verificarConexion();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async () => {
    const { error } = await supabase
      .from('reporte')
      .insert([{
        fecha: formulario.fecha,
        nombreProduccion: formulario.nombreProduccion,
        cantidad: parseInt(formulario.cantidad || '0'),
        ct: parseInt(formulario.cts || '0'),
        baldes: parseInt(formulario.baldes || '0'),
        galones: parseInt(formulario.galones || '0')
      }]);

    if (error) {
      console.error('Error al insertar reporte:', error);
      alert('❌ Error al guardar el reporte.');
    } else {
      alert('✅ Reporte registrado correctamente.');

      setFormulario({
        fecha: today,
        nombreProduccion: '',
        cantidad: '0',
        cts: '0',
        baldes: '0',
        galones: '0',
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Registro de Reporte</h1>
      <p>Formulario para registrar un nuevo reporte.</p>

      <p><strong>Estado Supabase:</strong> {estadoConexion}</p>

      <form>
        <div>
          <label>Fecha:</label><br />
          <input
            type="date"
            name="fecha"
            value={formulario.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Nombre del producto:</label><br />
          <input
            type="text"
            name="nombreProduccion"
            value={formulario.nombreProduccion}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Cantidad:</label><br />
          <input
            type="number"
            name="cantidad"
            value={formulario.cantidad}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>CTS:</label><br />
          <input
            type="number"
            name="cts"
            value={formulario.cts}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Baldes:</label><br />
          <input
            type="number"
            name="baldes"
            value={formulario.baldes}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Galones:</label><br />
          <input
            type="number"
            name="galones"
            value={formulario.galones}
            onChange={handleChange}
          />
        </div>

        <br />
        <button type="button" onClick={handleSubmit}>Registrar</button>
      </form>
    </div>
  );
}

export default RegistroReporte;
