import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useEffect, useState } from 'react';
import { obtenerPagosDelDia } from '../services/pagosService';
import '../styles/pagosDia.css';

function PagosPorDia({ onVolver }) {
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPagos = async () => {
      const data = await obtenerPagosDelDia();
      setPagos(data);
      setCargando(false);
    };
    cargarPagos();
  }, []);

  const generarPDF = () => {
  const doc = new jsPDF();
  doc.text('Reporte de Pagos por Día', 14, 20);

  const headers = [["ID", "Nombre", "Monto Pagado", "Comentarios", "Fecha", "Hora", "Registrado Por"]];
  const data = pagos.map(p => [
    p.id,
    p.nombre,
    `$${parseFloat(p.monto_pagado).toFixed(2)}`,
    p.comentarios || '',
    p.fecha,
    p.hora_entrada,
    p.registrado_por
  ]);

  // Sumar el total
  const total = pagos.reduce((sum, p) => sum + parseFloat(p.monto_pagado), 0);
  data.push(["", "", `Total: $${total.toFixed(2)}`, "", "", "", ""]);

    autoTable(doc, {
    startY: 30,
    head: headers,
    body: data,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [12, 34, 68] },
    theme: 'striped'
    });


  doc.save(`reporte_pagos_${new Date().toISOString().slice(0, 10)}.pdf`);
};


  return (
    <div className="form-wrapper pagos-dia-container">
      <div className="neumorphics-card">
        <h2>💰 Pagos por Día</h2>

        {cargando ? (
          <p>Cargando pagos...</p>
        ) : pagos.length === 0 ? (
          <p>No hay registros de pagos aún.</p>
        ) : (
          <div className="tabla-pagos-wrapper">
            <table className="tabla-pagos">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Monto</th>
                  <th>Comentarios</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Registrado por</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago, index) => (
                  <tr key={pago.id}>
                    <td>{index + 1}</td>
                    <td>{pago.nombre}</td>
                    <td>${parseFloat(pago.monto_pagado).toFixed(2)}</td>
                    <td>{pago.comentarios || 'Sin comentario'}</td>
                    <td>{pago.fecha}</td>
                    <td>{pago.hora_entrada}</td>
                    <td>{pago.registrado_por}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                    <td colSpan="2"><strong>Total:</strong></td>
                    <td><strong>${pagos.reduce((acc, p) => acc + parseFloat(p.monto_pagado), 0).toFixed(2)}</strong></td>
                    <td colSpan="4"></td>
                </tr>
                </tfoot>
            </table>
          </div>
        )}

        <button className="neumorphic-button" onClick={onVolver}>
          🔙 Volver
        </button>
        {pagos.length > 0 && (
            <>
                <button className="neumorphic-button" onClick={generarPDF}>
                📄 Generar Reporte
                </button>
            </>
            )}
      </div>
    </div>
  );
}

export default PagosPorDia;
