import React, { useState } from 'react';

function FormularioClave({ onVerificada, onCancelar }) {
  const [clave, setClave] = useState('');
  const [error, setError] = useState(null);

  const claveCorrecta = "admin123"; // Puedes mover esto a una variable de entorno en producción

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clave === claveCorrecta) {
      onVerificada();
      
    } else {
      setError("Clave incorrecta. Intenta de nuevo.");
    }
  };
  

  return (
    <div className="form-wrapper">
      <div className="neumorphic-card">
        <h2>🔒 Acceso restringido</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Ingresa la clave de acceso"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="neumorphic-input"
            required
          />
          {error && <div className="mensaje error">{error}</div>}

          <button type="submit" className="neumorphic-button">Acceder</button>
          <button type="button" onClick={onCancelar} className="button-regresar">Cancelar</button>
        </form>
      </div>
    </div>
  );
}

export default FormularioClave;
