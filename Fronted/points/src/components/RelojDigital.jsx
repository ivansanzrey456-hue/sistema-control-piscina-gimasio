import React, { useState, useEffect } from 'react';
import '../styles/reloj.css';

function RelojDigital() {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

  return <div className="reloj">{hora.toLocaleTimeString()}</div>;
}

export default RelojDigital;
