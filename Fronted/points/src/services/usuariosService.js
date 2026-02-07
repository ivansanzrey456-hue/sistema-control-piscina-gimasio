export const registrarTrabajador = async (formData) => {
  try {
    const res = await fetch("http://localhost/edpointsPHP/auth.php?accion=registro", {
      method: "POST",
      body: formData
    });
    return await res.json();
  } catch (error) {
    console.error("Error al registrar trabajador:", error);
    return { status: 'Error', mensaje: 'Error de conexión' };
  }
};
