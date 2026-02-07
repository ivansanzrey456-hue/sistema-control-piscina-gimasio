const API_URL = 'http://localhost/edpointsPHP/auth.php';

export async function registrar(datos) {
  const res = await fetch(`${API_URL}?accion=registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return await res.json();
}

export async function login(datos) {
  const res = await fetch(`${API_URL}?accion=login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return await res.json();
}
