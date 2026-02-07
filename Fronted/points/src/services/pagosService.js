export const obtenerPagosDelDia = async () => {
  try {
    const res = await fetch("http://localhost/edpointsPHP/pagos.php?accion=consultar_pagos_dia");
    return await res.json();
  } catch (error) {
    console.error("Error al obtener pagos del día:", error);
    return [];
  }
};
