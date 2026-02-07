import React, { useState, useEffect, useCallback } from 'react';
import ModalPago from './ModalPago';
import '../styles/gestionSocios.css';

function GestionSocios({ onVolver }) {
  const [socios, setSocios] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: '', estado: '', fecha: '' });
  const [socioParaPagar, setSocioParaPagar] = useState(null); // 👈 NUEVO

  const obtenerSocios = useCallback(async () => {
    const params = new URLSearchParams(filtros);
    const res = await fetch(`http://localhost/edpointsPHP/api/listar_socios.php?${params}`);
    const data = await res.json();
    setSocios(data);
  }, [filtros]);

  useEffect(() => {
    obtenerSocios();
  }, [obtenerSocios]);

  const handleChangeFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const aplicarFiltros = () => {
    obtenerSocios();
  };

  const suspenderSocio = async (id, estado) => {
    await fetch('http://localhost/edpointsPHP/api/suspender_socio.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ id, estado })
    });
    obtenerSocios();
  };

  return (
    <div className="gestion-socios-wrapper">
      <div className="gestion-socios-container">
        <h2 className="gestion-socios-title">📋 Gestión de Socios</h2>

        <div className="gestion-socios-filtros">
          <input 
            className="gestion-socios-input"
            name="nombre" 
            placeholder="Buscar por nombre" 
            value={filtros.nombre} 
            onChange={handleChangeFiltro} 
          />
          <select 
            className="gestion-socios-select"
            name="estado" 
            value={filtros.estado} 
            onChange={handleChangeFiltro}
          >
            <option value="">Todos</option>
            <option value="activo">Activos</option>
            <option value="vencido">Vencidos</option>
          </select>
          <input 
            className="gestion-socios-date"
            type="date" 
            name="fecha" 
            value={filtros.fecha} 
            onChange={handleChangeFiltro} 
          />
          <button 
            className="gestion-socios-filtrar-btn"
            onClick={aplicarFiltros}
          >
            🔍 Filtrar
          </button>
        </div>

        <div className="gestion-socios-tabla-scrollable">
          <table className="gestion-socios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Fecha de Registro</th>
                <th>Edad</th>
                <th>Vencimiento</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {socios.map((socio) => (
                <tr key={socio.id}>
                  <td>{socio.id}</td>
                  <td>
                    <img src={socio.foto_perfil} alt="foto" />
                  </td>
                  <td>{socio.nombre} {socio.apellido_paterno} {socio.apellido_materno}</td>
                  <td>{socio.correo}</td>
                  <td>{socio.telefono}</td>
                  <td>{socio.fecha_registro}</td>
                  <td>{socio.edad}</td>
                  <td>{socio.fecha_vencimiento}</td>
                  <td>{socio.membresia_activa == 1 ? 'Activo' : 'Vencido'}</td>
                  <td>
                     <button
                      className="gestion-socios-accion-btn"
                      onClick={() => {
                        if (socio.membresia_activa === 1) {
                          suspenderSocio(socio.id, 0); // Suspender
                        } else {
                          setSocioParaPagar(socio); // Mostrar modal de pago
                        }
                      }}
                    >
                      {socio.membresia_activa === 1 ? 'Suspender' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button 
          className="gestion-socios-volver-btn"
          onClick={onVolver}
        >
          ⬅️ Volver al Dashboard
        </button>
      </div>
   {socioParaPagar && (
        <ModalPago 
          socio={socioParaPagar} 
          onClose={() => setSocioParaPagar(null)} 
          onPagoExitoso={obtenerSocios} 
        />
      )}
    </div>
  );
}
export default GestionSocios;