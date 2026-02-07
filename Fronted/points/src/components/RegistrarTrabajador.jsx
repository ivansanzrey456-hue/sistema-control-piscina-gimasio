import React, { useState } from 'react';
import '../styles/registroTrabajador.css';
import { registrarTrabajador } from '../services/usuariosService';

function RegistrarTrabajador({ onVolver }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    password: '',
    telefono: '',
    rol: 'encargado',
    estatus: 'activo'
  });
  const [foto, setFoto] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFotoChange = (e) => {
    setFoto(e.target.files[0]);
  };
    const validarFormulario = () => {
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!soloLetras.test(form.nombre)) {
        setMensaje("El nombre solo debe contener letras y espacios.");
        return false;
    }

    if (!soloLetras.test(form.apellido_paterno)) {
        setMensaje("El apellido paterno solo debe contener letras y espacios.");
        return false;
    }

    if (!soloLetras.test(form.apellido_materno)) {
        setMensaje("El apellido materno solo debe contener letras y espacios.");
        return false;
    }

    if (!form.correo.match(/^\S+@\S+\.\S+$/)) {
        setMensaje("Correo electrónico no válido.");
        return false;
    }

    if (!form.password || form.password.length < 6) {
        setMensaje("La contraseña debe tener al menos 6 caracteres.");
        return false;
    }

    if (form.telefono && !/^\d{10}$/.test(form.telefono)) {
        setMensaje("El teléfono debe tener 10 dígitos.");
        return false;
    }

    if (!foto) {
        setMensaje("Debe subir una foto.");
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

    const res = await registrarTrabajador(formData);
    setMensaje(res.mensaje);

    if (res.status === 'Éxito') {
        setForm({ nombre: '', apellido_paterno: '', apellido_materno: '', correo: '', password: '', telefono: '', rol: 'encargado', estatus: 'activo' });
        setFoto(null);
        setTimeout(() => onVolver(), 2000);
    }
    };

  return (
    <div className="form-wrapper registro-trabajador">
        <div className="neumorphic-card">
        <h2>🛠️ Registro de Trabajador</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-grid">
            <input className="neumorphic-input" type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
            <input className="neumorphic-input" type="text" name="apellido_paterno" placeholder="Apellido paterno" value={form.apellido_paterno} onChange={handleChange} required/>
            <input className="neumorphic-input" type="text" name="apellido_materno" placeholder="Apellido materno" value={form.apellido_materno} onChange={handleChange} required/>
            <input className="neumorphic-input" type="email" name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} required />
            <input className="neumorphic-input" type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
            <input className="neumorphic-input" type="tel" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
            <select className="neumorphic-input" name="rol" value={form.rol} onChange={handleChange}>
                <option value="admin">Administrador</option>
                <option value="encargado">Encargado</option>
            </select>
            <select className="neumorphic-input" name="estatus" value={form.estatus} onChange={handleChange}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
            </select>
            <input className="neumorphic-input" type="file" accept="image/*" onChange={handleFotoChange} required />
            </div>

            <button className="neumorphic-button" type="submit">Registrar Trabajador</button>
            <button className="button-regresar" type="button" onClick={onVolver}>Volver</button>
        </form>
        {mensaje && <div className={`mensaje ${mensaje.includes('Éxito') ? 'exito' : 'error'}`}>{mensaje}</div>}
        </div>
    </div>
    );

}

export default RegistrarTrabajador;
