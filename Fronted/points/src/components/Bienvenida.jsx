import React, { useState, useEffect } from 'react';
import '../styles/bienvenida.css';

function Bienvenida({ onStart }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoverButton, setHoverButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bienvenida-container">
      {/* Partículas animadas en el fondo */}
      <div className="bienvenida-particles">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="bienvenida-particle"
            style={{
              '--size': `${Math.random() * 20 + 5}px`,
              '--left': `${Math.random() * 100}%`,
              '--top': `${Math.random() * 100}%`,
              '--delay': `${Math.random() * 5}s`,
              '--duration': `${Math.random() * 3 + 3}s`
            }}
          />
        ))}
      </div>

      <div className={`bienvenida-card ${isVisible ? 'bienvenida-visible' : ''}`}>
        <div className="bienvenida-logo">🕹️</div>
        
        <h1 className="bienvenida-title">
          ¡Bienvenido a Nuestro Sistema!
        </h1>
        
        <p className="bienvenida-text">
          Gestiona usuarios, pagos y más de forma fácil y segura.
        </p>
        
        <button
          className={`bienvenida-button ${hoverButton ? 'bienvenida-button-hover' : ''}`}
          onClick={onStart}
          onMouseEnter={() => setHoverButton(true)}
          onMouseLeave={() => setHoverButton(false)}
        >
          <span>Ir al Inicio de Sesión</span>
          <span className="bienvenida-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

export default Bienvenida;