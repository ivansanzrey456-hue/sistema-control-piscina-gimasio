import React, { useEffect, useState } from 'react';
import '../styles/GestionAccesos.css';

function GestionAccesos({ onVolver }) {
  const [registros, setRegistros] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost/edpointsPHP/listar_registros.php')
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.error);
        setRegistros(data.data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="accesos-blaquito-wrapper">
      <div className="accesos-blaquito-container">
        <h2>📝 Registro de Accesos</h2>
        <button onClick={onVolver} className="blaquito-boton">🔙 Volver</button>
        {loading ? (
          <p className="blaquito-msg">Cargando registros...</p>
        ) : error ? (
          <p className="blaquito-error">Error: {error}</p>
        ) : (
          <div className="tabla-blaquito-scroll">
            <table className="accesos-blaquito-tabla">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Socio</th>
                  <th>Fecha</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                </tr>
              </thead>
              <tbody>
                {registros.map(reg => (
                  <tr key={reg.id}>
                    <td>{reg.id}</td>
                    <td>{reg.nombre_completo}</td>
                    <td>{reg.fecha}</td>
                    <td>{reg.hora_entrada ? new Date(reg.hora_entrada).toLocaleTimeString('es-MX', {
                      hour: '2-digit', minute: '2-digit', hour12: true
                    }) : '—'}</td>
                    <td>{reg.hora_salida ? new Date(reg.hora_salida).toLocaleTimeString('es-MX', {
                      hour: '2-digit', minute: '2-digit', hour12: true
                    }) : '⏳'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default GestionAccesos;
