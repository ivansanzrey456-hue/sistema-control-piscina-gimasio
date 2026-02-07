//import React, { useState } from 'react';
import RegistrarSocioForm from './RegisterForm';
import LectorQR from './LectorQR';
import GestionSocios from './GestionSocios';
import GestionAccesos from './GestionAccesos';
import RegistroVisita from './RegistroVisita';
import DashboardAdmin from './DashboardAdmin';
/* import FormularioClave from './FormularioClave'; */
import '../styles/dashboard.css';

function Dashboard({ usuario, onLogout, vistaActual, setVistaActual }) {
  if (vistaActual === 'lector') {
    return <LectorQR onVolver={() => setVistaActual(null)} />;
  }
  if (vistaActual === 'registro') {
    return <RegistrarSocioForm onSuccess={() => setVistaActual(null)} />;
  }
  if (vistaActual === 'gestion') {
    return <GestionSocios onVolver={() => setVistaActual(null)} />;
  }
  if (vistaActual === 'accesos') {
    return <GestionAccesos onVolver={() => setVistaActual(null)} />;
  }
  if (vistaActual === 'visita') {
    return <RegistroVisita onVolver={() => setVistaActual(null)} />;
  }
  if (vistaActual === 'admin') {
    return (
      <DashboardAdmin
        onVolver={() => {
          setVistaActual(null);
        }}
      />
    );
  }

  const menuOptions = [
    { id: 'lector', label: 'Consultar datos', icon: '🔍' },
    { id: 'registro', label: 'Registrar Socio', icon: '🧑‍💼' },
    { id: 'gestion', label: 'Gestión de Socios', icon: '👥' },
    { id: 'accesos', label: 'Entradas/Salidas', icon: '📝' },
    { id: 'visita', label: 'Visita por Día', icon: '🎫' },
    { id: 'admin', label: 'Administración', icon: '📓' }
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="grid-menu-container">
        <h2>👋 Bienvenido, {usuario.nombre}</h2>
        <p>Selecciona una opción:</p>
        
        <div className="menu-grid">
          {menuOptions.map((option) => (
            <button
              key={option.id}
              className="grid-menu-button"
              onClick={() => setVistaActual(option.id)}
            >
              <span className="menu-icon">{option.icon}</span>
              <span className="menu-label">{option.label}</span>
            </button>
          ))}
        </div>
        
        <button className="logout-button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
