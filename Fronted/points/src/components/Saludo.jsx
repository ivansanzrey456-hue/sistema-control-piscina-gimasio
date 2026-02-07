import React, { useState, useEffect } from 'react';
import '../styles/saludo.css';

function Saludo() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) setMensaje('¡Buenos días! ☀️');
    else if (hora >= 12 && hora < 19) setMensaje('¡Buenas tardes! 🌤️');
    else setMensaje('¡Buenas noches!🌙');
  }, []);

  return <h3 className="saludo">{mensaje}</h3>;
}

export default Saludo;
