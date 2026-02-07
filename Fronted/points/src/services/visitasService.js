// src/services/visitasService.js

export async function registrarVisitaDia(data) {
  try {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('monto_pagado', data.monto_pagado);
    formData.append('comentarios', data.comentarios);
    
    // Si tienes un sistema de sesión, podrías agregar el usuario actual aquí:
    formData.append('registrado_por', 'admin'); // Puedes modificarlo dinámicamente después

    const response = await fetch('http://localhost/edpointsPHP/registrar_visita_dia.php', {
      method: 'POST',
      body: formData
    });

    const resultado = await response.json();
    return resultado;
  } catch (error) {
    console.error('Error al registrar visita:', error);
    return {
      status: 'Error',
      mensaje: 'Error de conexión con el servidor'
    };
  }
}
