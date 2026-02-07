import React, { useState } from 'react';
import GestionSociosAdmin from './GestionSociosAdmin';
import RegistrarTrabajador from './RegistrarTrabajador';
import PagosPorDia from './PagosPorDia';
import PagosMembresia from './PagosMembresia';

function DashboardAdmin({ onVolver }) {
  const [vistaAdmin, setVistaAdmin] = useState(null);

  const menuOptions = [
    { id: 'actualizar', label: 'Actualizar Datos de Socios', icon: '🔁' },
    { id: 'trabajador', label: 'Registrar Trabajador', icon: '👷' },
    { id: 'pagosDia', label: 'Consultar Pagos por Día', icon: '💰' },
    { id: 'membresias', label: 'Consultar Pagos de Membresía', icon: '📆' }
  ];

  const renderVista = () => {
    switch (vistaAdmin) {
      case 'actualizar':
        return <GestionSociosAdmin onVolver={() => setVistaAdmin(null)} />;
      case 'trabajador':
        return <RegistrarTrabajador onVolver={() => setVistaAdmin(null)} />;
      case 'pagosDia':
        return <PagosPorDia onVolver={() => setVistaAdmin(null)} />;
      case 'membresias':
        return <PagosMembresia onVolver={() => setVistaAdmin(null)} />;
      default:
        return (
          <div className="dashboard-wrapper">
            <div className="grid-menu-container">
              <h2>📓 Panel de Administración</h2>
              <p>Selecciona una opción:</p>
              
              <div className="menu-grid">
                {menuOptions.map((option) => (
                  <button
                    key={option.id}
                    className="grid-menu-button"
                    onClick={() => setVistaAdmin(option.id)}
                  >
                    <span className="menu-icon">{option.icon}</span>
                    <span className="menu-label">{option.label}</span>
                  </button>
                ))}
              </div>
              
              <button className="logout-button" onClick={onVolver}>
                🔙 Volver al Panel Principal
              </button>
            </div>
          </div>
        );
    }
  };

  return <>{renderVista()}</>;
}

export default DashboardAdmin;