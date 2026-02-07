/*import React, { useState } from 'react';
import { login } from '../services/authService';
import '../styles/loginForm.css';

function LoginForm({ onLogin, onGoBack }) { // 🔥 Recibe onGoBack como prop
  const [form, setForm] = useState({ correo: '', password: '' });
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);
    setMensaje(res.mensaje);
    if (res.status === 'Éxito') {
      onLogin(res.usuario);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="neumorphic-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="correo"
            className="neumorphic-input"
            placeholder="Correo"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="neumorphic-input"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />
          <button type="submit" className="neumorphic-button">
            Iniciar Sesión
          </button>
        </form>

        // 🔥 Nuevo botón para volver al panel de bienvenida 
        <button
          type="button"
          className="neumorphic-button volver-btn"
          onClick={onGoBack}
        >
          Volver al Inicio
        </button>

        {mensaje && <div className="mensaje">{mensaje}</div>}
      </div>
    </div>
  );
}

export default LoginForm;
*/


//Esto solo funciona de ejemplo 
import React, { useState } from 'react';
import { login } from '../services/authService';
import '../styles/loginForm.css';

const DEMO_MODE = true; // 🔐 Cambiar a false en entorno real

function LoginForm({ onLogin, onGoBack }) {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (DEMO_MODE) {
      if (
        form.correo === 'admin@demo.com' &&
        form.password === 'admin123'
      ) {
        setMensaje('Éxito (modo demostración)');
        onLogin({
          nombre: 'Administrador',
          rol: 'admin'
        });
      } else {
        setMensaje('Credenciales incorrectas (modo demostración)');
      }
      return;
    }

    // 🔗 Login real con backend
    const res = await login(form);
    setMensaje(res.mensaje);
    if (res.status === 'Éxito') {
      onLogin(res.usuario);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="neumorphic-card">
        <h1>Login</h1>

        {DEMO_MODE && (
          <div className="demo-info">
            <strong>Modo demostración</strong>
            <p>Correo: <code>admin@demo.com</code></p>
            <p>Contraseña: <code>admin123</code></p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="correo"
            className="neumorphic-input"
            placeholder="Correo"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="neumorphic-input"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />
          <button type="submit" className="neumorphic-button">
            Iniciar Sesión
          </button>
        </form>

        <button
          type="button"
          className="neumorphic-button volver-btn"
          onClick={onGoBack}
        >
          Volver al Inicio
        </button>

        {mensaje && <div className="mensaje">{mensaje}</div>}
      </div>
    </div>
  );
}

export default LoginForm;
