import React, { useState, useEffect } from 'react';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import RelojDigital from './components/RelojDigital';
import Dashboard from './components/Dashboard';
import Saludo from './components/Saludo';
import Bienvenida from './components/Bienvenida';
import './app.css';

function App() {
  const VISTAS = {
    DASHBOARD: null,
    LECTOR: 'lector',
    GESTION: 'gestion',
  };

  const [vista, setVista] = useState('bienvenida'); // 👈 Arranca en Bienvenida
  const [usuario, setUsuario] = useState(null);
  const [vistaDashboard, setVistaDashboard] = useState(VISTAS.DASHBOARD);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuarioParseado = JSON.parse(usuarioGuardado);
        setUsuario(usuarioParseado);
        setVista('dashboard');
      } catch (error) {
        console.error("Error al parsear usuario:", error);
        localStorage.removeItem('usuario');
      }
    }
  }, []);

  const obtenerTemaPorHora = () => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) return 'tema-dia';
    if (hora >= 12 && hora < 18) return 'tema-tarde';
    return 'tema-noche';
  };

  const temaActual = obtenerTemaPorHora();

  useEffect(() => {
    document.body.className = temaActual;
  }, [temaActual]);

  const mostrarLogin = () => setVista('login');
  const mostrarRegistro = () => setVista('registro');

  const manejarLogin = (usuario) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setUsuario(usuario);
    setVista('dashboard');
  };

  const manejarRegistro = () => setVista('login');

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    setVista('login');
  };

  return (
    <div className={`app-container ${temaActual}`}>
      <div className="app-content">
        <div className="app-left">
          {vista === 'bienvenida' && <Bienvenida onStart={mostrarLogin} />}
          {vista === 'login' && (
            <LoginForm
              onLogin={manejarLogin}
              onShowRegister={mostrarRegistro}
              onGoBack={() => setVista('bienvenida')} // 👈 Esto activa el botón
            />
          )}
          {vista === 'registro' && (
            <RegisterForm onSuccess={manejarRegistro} onShowLogin={mostrarLogin} />
          )}
          {vista === 'dashboard' && usuario && (
            <Dashboard
              usuario={usuario}
              onLogout={cerrarSesion}
              vistaActual={vistaDashboard}
              setVistaActual={setVistaDashboard}
            />
          )}
        </div>

        {vista === 'login' && (
          <div className="login-reloj-saludo">
            <RelojDigital />
            <Saludo />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
