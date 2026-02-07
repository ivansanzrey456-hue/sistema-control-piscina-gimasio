import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import '../styles/lectorQR.css';

const LectorQR = ({ onVolver }) => {
  const qrRegionId = "reader";
  const html5QrCodeRef = useRef(null);
  const [scannerIniciado, setScannerIniciado] = useState(false);

  useEffect(() => {
    const iniciarScanner = async () => {
      if (!scannerIniciado && !html5QrCodeRef.current) {
        const qrScanner = new Html5Qrcode(qrRegionId);
        html5QrCodeRef.current = qrScanner;

        try {
          await qrScanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              if (decodedText) {
                qrScanner.stop().then(() => {
                  setScannerIniciado(false);
                  window.location.href = decodedText;
                }).catch(err => {
                  console.warn("No se pudo detener el escáner:", err);
                });
              }
            },
            (errorMessage) => {
              console.warn("Error al escanear:", errorMessage);
            }
          );
          setScannerIniciado(true);
        } catch (err) {
          console.error("No se pudo iniciar el escáner:", err);
        }
      }
    };

    iniciarScanner();

    return () => {
      if (html5QrCodeRef.current && scannerIniciado) {
        html5QrCodeRef.current.stop()
          .then(() => {
            html5QrCodeRef.current.clear();
            html5QrCodeRef.current = null;
          })
          .catch(err => console.warn("Error al detener escáner:", err));
      }
    };
  }, [scannerIniciado]);

  return (
    <div className="qr-wrapper">
      <div className="qr-container">
        <h2>📷 Escanea el código QR</h2>
        <div id={qrRegionId} />
        <button className="qr-volver" onClick={() => {
          if (html5QrCodeRef.current && scannerIniciado) {
            html5QrCodeRef.current.stop()
              .then(() => {
                html5QrCodeRef.current.clear();
                html5QrCodeRef.current = null;
                setScannerIniciado(false);
                onVolver();
              })
              .catch(err => console.warn("Error al detener escáner:", err));
          } else {
            onVolver();
          }
        }}>
          ⬅️ Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default LectorQR;
