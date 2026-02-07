import React, { useState, useEffect } from 'react';
import '../styles/registroVisita.css';
import { registrarVisitaDia } from '../services/visitasService';

function RegistroVisita({ onVolver }) {
  const [form, setForm] = useState({
    nombre: '',
    monto_pagado: '',
    comentarios: ''
  });

  const [mensaje, setMensaje] = useState(null);
  const [esExito, setEsExito] = useState(false);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!soloLetras.test(form.nombre)) {
      setMensaje("El nombre solo puede contener letras y espacios.");
      setEsExito(false);
      return;
    }

    if (isNaN(form.monto_pagado) || form.monto_pagado <= 0) {
      setMensaje("El monto debe ser un número mayor que 0.");
      setEsExito(false);
      return;
    }

    if (!form.nombre || !form.monto_pagado) {
      setMensaje("Nombre y monto son obligatorios.");
      setEsExito(false);
      return;
    }

    const res = await registrarVisitaDia(form);
    setMensaje(res.mensaje);
    setEsExito(res.status === 'Éxito');

    if (res.status === 'Éxito') {
      setForm({ nombre: '', monto_pagado: '', comentarios: '' });

      setTimeout(() => {
        onVolver();
      }, 2500);
    }
  };

  return (
    <div className="visita-wrapper">
      <div className="visita-card">
        <h2>🎫 Registrar Visita por Día</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            className="visita-input"
            required
            pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$"
            title="Solo letras y espacios (mínimo 2 caracteres)"
          />
          <input
            type="number"
            name="monto_pagado"
            placeholder="Monto pagado"
            value={form.monto_pagado}
            onChange={handleChange}
            className="visita-input"
            required
            min="1"
            max="9999.99"
            step="0.01"
            title="Debe ser un monto válido (mínimo 1)"
          />
          <textarea
            name="comentarios"
            placeholder="Comentarios (opcional)"
            value={form.comentarios}
            onChange={handleChange}
            className="visita-input"
            rows="3"
          />

          <button type="submit" className="visita-button">
            Registrar visita
          </button>

          <button type="button" onClick={onVolver} className="visita-regresar">
            Volver al Dashboard
          </button>

          {mensaje && (
            <div className={`visita-mensaje ${esExito ? 'exito' : 'error'}`}>
              {mensaje}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegistroVisita;
