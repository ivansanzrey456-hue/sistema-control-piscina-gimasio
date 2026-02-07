import React, { useState, useEffect } from 'react';
import { registrarSocio } from '../services/sociosService';
import '../styles/registerForm.css';

function RegistrarSocioForm({ onSuccess }) {
  const initialForm = {
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    telefono: '',
    fecha_nacimiento: '',
  };

  const [form, setForm] = useState(initialForm);
  const [foto, setFoto] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [esExito, setEsExito] = useState(false);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);


  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFotoChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const validarFormulario = () => {
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!soloLetras.test(form.nombre)) {
    setMensaje("El nombre solo puede contener letras y espacios.");
    setEsExito(false);
    return false;
  }

  if (!soloLetras.test(form.apellido_paterno)) {
    setMensaje("El apellido paterno solo puede contener letras y espacios.");
    setEsExito(false);
    return false;
  }

  if (!soloLetras.test(form.apellido_materno)) {
    setMensaje("El apellido materno solo puede contener letras y espacios.");
    setEsExito(false);
    return false;
  }

  if (!form.correo.match(/^\S+@\S+\.\S+$/)) {
    setMensaje("Correo no válido.");
    setEsExito(false);
    return false;
  }

  if (form.telefono && !/^\d{10}$/.test(form.telefono)) {
    setMensaje("Teléfono debe tener 10 dígitos.");
    setEsExito(false);
    return false;
  }

  if (!form.fecha_nacimiento) {
    setMensaje("Fecha de nacimiento es obligatoria.");
    setEsExito(false);
    return false;
  }

  // Validar edad mínima (15 años)
  const hoy = new Date();
  const fechaNac = new Date(form.fecha_nacimiento);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const m = hoy.getMonth() - fechaNac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }

  if (edad < 15) {
    setMensaje("La edad mínima para registrarse es 15 años.");
    setEsExito(false);
    return false;
  }

  // Validar que la foto fue seleccionada (si es obligatoria)
  if (!foto) {
    setMensaje("Debe seleccionar una foto.");
    setEsExito(false);
    return false;
  }
  return true;
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    formData.append('foto', foto);

    const res = await registrarSocio(formData);
    setMensaje(res.mensaje);
    setEsExito(res.status === 'Éxito');

    if (res.status === 'Éxito') {
  setForm(initialForm);
  setFoto(null);

  if (res.id) {
    window.open(`http://localhost/edpointsPHP/generar_credencial.php?id=${res.id}`, '_blank');
    }

    setMostrarNotificacion(true); // Mostrar notificación flotante

    // Regresar al dashboard después de 2 segundos
    setTimeout(() => {
      setMostrarNotificacion(false);
      onSuccess();
    }, 2000);
  }


  };

  return (
    <div className="form-wrapper">
      <div className="neumorphic-card">
        <h2>🧑‍🤝‍🧑 Registro de Socio</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-grid">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
              className="neumorphic-input"
              required
            />
            <input
              type="text"
              name="apellido_paterno"
              placeholder="Apellido paterno"
              value={form.apellido_paterno}
              onChange={handleChange}
              className="neumorphic-input"
              required
            />
            <input
              type="text"
              name="apellido_materno"
              placeholder="Apellido materno"
              value={form.apellido_materno}
              onChange={handleChange}
              className="neumorphic-input"
              required
            />
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              value={form.correo}
              onChange={handleChange}
              className="neumorphic-input"
              required
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              className="neumorphic-input"
            />
            <input
              type="date"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              className="neumorphic-input"
              required
            />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            required
            className="neumorphic-input"
            style={{ width: '90%' }}
          />

          <button type="submit" className="neumorphic-button">
            Registrar Socio
          </button>

          {mensaje && (
            <div className={`mensaje ${esExito ? 'exito' : 'error'}`}>
              {mensaje}
            </div>
          )}

          <button
              className="button-regresar"
              onClick={onSuccess}
              type="button"
            >
              Regresar al Dashboard
          </button>

        </form>

        {mensaje && (
          <div className={`mensaje ${esExito ? 'exito' : 'error'}`}>
            {mensaje}
          </div>
        )}

      </div>
      {mostrarNotificacion && (
        <div className="notificacion-flotante exito">
          ✅ Socio registrado correctamente
        </div>
      )}
    </div>
  );
}

export default RegistrarSocioForm;
