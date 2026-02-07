import React, { useState, useEffect, useCallback } from 'react';
import '../styles/gestionSocios.css';

function GestionSociosAdmin({ onVolver }) {
  const [socios, setSocios] = useState([]);
  const [filtros, setFiltros] = useState({ 
    nombre: '', 
    estado: '', 
    fecha: '' 
  });
  const [socioEditar, setSocioEditar] = useState(null);
  const [nuevaFoto, setNuevaFoto] = useState(null);
  const [form, setForm] = useState({
    nombre: '', 
    apellido_paterno: '', 
    apellido_materno: '', 
    correo: '', 
    telefono: '',
    edad: '', 
    foto_perfil: ''
 });


  const obtenerSocios = useCallback(async () => {
    try {
      const params = new URLSearchParams(filtros);
      const res = await fetch(`http://localhost/edpointsPHP/api/listar_socios.php?${params}`);
      const data = await res.json();
      setSocios(data);
    } catch (error) {
      console.error('Error al obtener socios:', error);
    }
  }, [filtros]);

  useEffect(() => {
    obtenerSocios();
  }, [obtenerSocios]);

  const handleChangeFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const aplicarFiltros = () => {
    obtenerSocios();
  };

  const eliminarSocio = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este socio?')) {
      try {
        await fetch('http://localhost/edpointsPHP/api/eliminar_socio.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ id })
        });
        obtenerSocios();
      } catch (error) {
        console.error('Error al eliminar socio:', error);
      }
    }
  };

  const manejarActualizar = (socio) => {
    console.log("Actualizar socio:", socio); // <- IMPORTANTE
    setSocioEditar(socio);
    setForm({
        nombre: socio.nombre,
        apellido_paterno: socio.apellido_paterno,
        apellido_materno: socio.apellido_materno,
        correo: socio.correo,
        telefono: socio.telefono,
        edad: socio.edad,
        foto_perfil: socio.foto_perfil
     });
};

const descargarCredencial = (id) => {
  const url = `http://localhost/edpointsPHP/generar_credencial.php?id=${id}`;
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank'; // para abrir en otra pestaña
  link.click();
  link.remove();
};


  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async () => {
  try {
    let formData;

    if (nuevaFoto) {
      formData = new FormData();
      formData.append("id", socioEditar.id);
      formData.append("nombre", form.nombre);
      formData.append("apellido_paterno", form.apellido_paterno);
      formData.append("apellido_materno", form.apellido_materno);
      formData.append("correo", form.correo);
      formData.append("telefono", form.telefono);
      formData.append("edad", form.edad);
      formData.append("foto", nuevaFoto); // campo esperado en PHP
    } else {
      formData = JSON.stringify({ id: socioEditar.id, ...form });
    }

    const res = await fetch(
      `http://localhost/edpointsPHP/api/actualizar_socio.php`,
      {
        method: 'POST',
        headers: nuevaFoto ? undefined : { 'Content-Type': 'application/json' },
        body: formData,
      }
    );

    const data = await res.json();

    if (data.status === 'Éxito') {
      setSocioEditar(null);
      setNuevaFoto(null);
      obtenerSocios();
    } else {
      alert('Error al actualizar: ' + data.mensaje);
    }
  } catch (error) {
    console.error('Error al guardar cambios:', error);
  }
};

  const cerrarModal = () => setSocioEditar(null);

  return (
    <>
      {socioEditar && (
        <div className="modal-fondo">
          <div className="modal-contenido">
            <input 
              name="nombre" 
              value={form.nombre} 
              onChange={handleChangeForm} 
              placeholder="Nombre" 
            />
            <input 
              name="apellido_paterno" 
              value={form.apellido_paterno} 
              onChange={handleChangeForm} 
              placeholder="Apellido Paterno" 
            />
            <input 
              name="apellido_materno" 
              value={form.apellido_materno} 
              onChange={handleChangeForm} 
              placeholder="Apellido Materno" 
            />
            <input 
              name="correo" 
              value={form.correo} 
              onChange={handleChangeForm} 
              placeholder="Correo" 
            />
            <input 
              name="telefono" 
              value={form.telefono} 
              onChange={handleChangeForm} 
              placeholder="Teléfono" 
            />
            <input 
              type="number" 
              name="edad" 
              value={form.edad} 
              onChange={handleChangeForm} 
              placeholder="Edad" 
            />
            <div>
                <label>Foto actual:</label>
                <img 
                    src={`${window.location.origin}/edpointsPHP/${form.foto_perfil}`} 
                    alt={`Foto de ${form.nombre}`} 
                    className="foto-perfil"
                    />
                </div>

                <div>
                <label>Nueva foto (opcional):</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setNuevaFoto(e.target.files[0])}
                />
            </div>
            <div className="modal-botones">
              <button onClick={guardarCambios}>Guardar</button>
              <button onClick={cerrarModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}  
      
      <div className="gestion-socios-wrapper">
        <div className="gestion-socios-container">
          <h2 className="gestion-socios-title">📋 Gestión de Socios</h2>

          <div className="gestion-socios-filtros">
            <input 
              className="gestion-socios-input"
              name="nombre" 
              placeholder="Buscar por nombre" 
              value={filtros.nombre} 
              onChange={handleChangeFiltro} 
            />
            <select 
              className="gestion-socios-select"
              name="estado" 
              value={filtros.estado} 
              onChange={handleChangeFiltro}
            >
              <option value="">Todos</option>
              <option value="activo">Activos</option>
              <option value="vencido">Vencidos</option>
            </select>
            <input 
              className="gestion-socios-date"
              type="date" 
              name="fecha" 
              value={filtros.fecha} 
              onChange={handleChangeFiltro} 
            />
            <button 
              className="gestion-socios-filtrar-btn"
              onClick={aplicarFiltros}
            >
              🔍 Filtrar
            </button>
          </div>

          <div className="gestion-socios-tabla-scrollable">
            <table className="gestion-socios-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Fecha de Registro</th>
                  <th>Edad</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {socios.map((socio) => (
                  <tr key={socio.id}>
                    <td>{socio.id}</td>
                    <td>
                      <img 
                        src={socio.foto_perfil || 'ruta-a-imagen-por-defecto'} 
                        alt={`Foto de ${socio.nombre}`} 
                        className="foto-perfil"
                      />
                    </td>
                    <td>{`${socio.nombre} ${socio.apellido_paterno} ${socio.apellido_materno}`}</td>
                    <td>{socio.correo}</td>
                    <td>{socio.telefono}</td>
                    <td>{socio.fecha_registro}</td>
                    <td>{socio.edad}</td>
                    <td>{socio.fecha_vencimiento}</td>
                    <td>{socio.membresia_activa === 1 ? 'Activo' : 'Vencido'}</td>
                    <td>
                      <select
                        className="gestion-socios-select"
                        defaultValue=""
                        onChange={(e) => {
                          const accion = e.target.value;
                          if (accion === 'actualizar') {
                            manejarActualizar(socio);
                          } else if (accion === 'eliminar') {
                            eliminarSocio(socio.id);
                          } else if (accion === 'credencial') {
                            descargarCredencial(socio.id);
                          }
                          e.target.value = "";
                        }}
                      >
                        <option value="">Elige la acción</option>
                        <option value="actualizar">✏️ Actualizar</option>
                        <option value="eliminar">🗑️ Eliminar</option>
                        <option value="credencial">🎫 Descargar Credencial</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button 
            className="gestion-socios-volver-btn"
            onClick={onVolver}
          >
            ⬅️ Volver al Panel de Administración
          </button>
        </div>
      </div>
    </>
  );
}

export default GestionSociosAdmin;