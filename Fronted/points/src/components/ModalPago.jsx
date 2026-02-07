import React, { useState } from 'react';
import '../styles/ModalPago.css'; // Puedes crear estilos si deseas

function ModalPago({ socio, onClose, onPagoExitoso }) {
  const [monto, setMonto] = useState('');
  const [metodo, setMetodo] = useState('Efectivo');

  const registrarPago = async () => {
    if (!monto) return alert("Ingresa el monto del pago");

    try {
      const res = await fetch('http://localhost/edpointsPHP/api/registrar_pago_membresia.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          socio_id: socio.id,
          monto: parseFloat(monto),
          metodo,
          registrado_por: 'admin' // puedes hacerlo dinámico
        })
      });

      const data = await res.json();

      if (data.status === 'Éxito') {
        onPagoExitoso();
        onClose();
      } else {
        alert(data.mensaje || "Error al registrar el pago");
      }
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      alert("Error en la conexión");
    }
  };

  return (
    <div className="modal-fondo">
      <div className="modal-pago">
        <h3>💳 Registrar Pago de Membresía</h3>
        <p><strong>Socio:</strong> {socio.nombre} {socio.apellido_paterno}</p>
        <p><strong>Estado:</strong> {socio.membresia_activa === 0 ? 'Vencido' : 'Activo'}</p>

        <input 
          type="number" 
          placeholder="Monto del pago" 
          value={monto}
          onChange={(e) => setMonto(e.target.value)} 
        />

        <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Otro">Otro</option>
        </select>

        <div className="modal-botones">
          <button onClick={registrarPago}>Registrar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalPago;
