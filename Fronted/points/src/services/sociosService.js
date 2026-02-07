export async function registrarSocio(formData) {
  try {
    const res = await fetch('http://localhost/edpointsPHP/auth.php?accion=registro_socio', {
      method: 'POST',
      body: formData,
    });

    return await res.json();
  } catch (error) {
    console.error('Error al registrar socio:', error);
    return { status: 'Error', mensaje: 'Error en la conexión' };
  }
}
