import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import React, { useEffect, useState } from 'react';
import '../styles/pagosDia.css'; // Puedes usar el mismo estilo

function PagosMembresia({ onVolver }) {
  const [pagos, setPagos] = useState([]);
  const [filtros, setFiltros] = useState({
  fechaInicio: '',
  busqueda: '',
  metodo: ''
});
const limpiarFiltros = () => {
  setFiltros({
    fechaInicio: '',
    busqueda: '',
    metodo: ''
  });
  aplicarFiltros(); // vuelve a cargar todos
};


  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerPagos = async () => {
      const res = await fetch('http://localhost/edpointsPHP/api/listar_pagos_membresia.php');
      const data = await res.json();
      setPagos(data);
      setCargando(false);
    };
    obtenerPagos();
  }, []);

  const handleFiltroChange = (e) => {
  setFiltros({ ...filtros, [e.target.name]: e.target.value });
};

const aplicarFiltros = async () => {
  setCargando(true);
  const params = new URLSearchParams(filtros);
  const res = await fetch(`http://localhost/edpointsPHP/api/listar_pagos_membresia.php?${params}`);
  const data = await res.json();
  setPagos(data);
  setCargando(false);
};


  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Pagos de Membresía', 14, 20);

    const headers = [["#", "Nombre", "Monto", "Método", "Fecha", "Registrado Por"]];
    const data = pagos.map((pago, index) => [
      index + 1,
      pago.nombre_completo,
      `$${parseFloat(pago.monto).toFixed(2)}`,
      pago.metodo_pago,
      pago.fecha_pago,
      pago.registrado_por
    ]);

    const total = pagos.reduce((sum, p) => sum + parseFloat(p.monto), 0);
    data.push(["", "", `Total: $${total.toFixed(2)}`, "", "", ""]);

    autoTable(doc, {
      startY: 30,
      head: headers,
      body: data,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [12, 34, 68] },
      theme: 'striped'
    });

    doc.save(`reporte_pagos_membresia_${new Date().toISOString().slice(0, 10)}.pdf`);
};
const generarExcel = () => {
  const ws = XLSX.utils.json_to_sheet(pagos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pagos Membresía");
  XLSX.writeFile(wb, `reporte_pagos_membresia_${new Date().toISOString().slice(0, 10)}.xlsx`);
};


  return (
    <div className="form-wrapper pagos-dia-container">
      <div className="neumorphics-card">
        <h2>💳 Pagos de Membresía</h2>
        <div className="filtros-membresia">
        <label htmlFor="fechaInicio">Fecha de realizacion de pago:</label>
        <input type="date" name="fechaInicio" value={filtros.fechaInicio} onChange={handleFiltroChange} />
        <input type="text" name="busqueda" value={filtros.busqueda} placeholder="Buscar por nombre o ID" onChange={handleFiltroChange} />
        <select name="metodo" value={filtros.metodo} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
        </select>
        <button onClick={aplicarFiltros}>🔍 Filtrar</button>
        <button onClick={limpiarFiltros}>Limpiar Filtros</button>
        </div>
        {cargando ? (
          <p>Cargando pagos...</p>
        ) : pagos.length === 0 ? (
          <p>No hay registros aún.</p>
        ) : (
          <div className="tabla-pagos-wrapper">
            <table className="tabla-pagos">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Fecha</th>
                  <th>Registrado por</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago, index) => (
                  <tr key={pago.id}>
                    <td>{index + 1}</td>
                    <td>{pago.nombre_completo}</td>
                    <td>${parseFloat(pago.monto).toFixed(2)}</td>
                    <td>{pago.metodo_pago}</td>
                    <td>{pago.fecha_pago}</td>
                    <td>{pago.registrado_por}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2"><strong>Total:</strong></td>
                  <td><strong>${pagos.reduce((acc, p) => acc + parseFloat(p.monto), 0).toFixed(2)}</strong></td>
                  <td colSpan="3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <button className="neumorphic-button" onClick={onVolver}>
          🔙 Volver
        </button>
        {pagos.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="btn-export-pdf" onClick={generarPDF}>
                📄 Exportar PDF
                </button>
                <button className="btn-export-excel" onClick={generarExcel}>
                📊 Exportar Excel
                </button>
            </div>
            )}
      </div>
    </div>
  );
}

export default PagosMembresia;
