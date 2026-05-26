import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./AdminPage.css";
import api from "../../services/api";

export default function EscanerQR() {
  const scannerRef = useRef(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [escaneado, setEscaneado] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        if (escaneado) return;

        setEscaneado(true);
        setError("");
        setMensaje("QR detectado. Registrando asistencia...");

        try {
          const cliente_id = Number(decodedText);

          if (!cliente_id) {
            setError("QR inválido. No contiene un cliente válido.");
            setMensaje("");
            setEscaneado(false);
            return;
          }

          const res = await api.post("/asistencias", {
            cliente_id,
          });

          if (res.data.estado === "VALIDO") {
            setMensaje("✅ Asistencia registrada correctamente. Ingreso permitido.");
          } else {
            setError("❌ Ingreso denegado. Cliente sin membresía activa.");
            setMensaje("");
          }

          setTimeout(() => {
            setEscaneado(false);
            setMensaje("");
            setError("");
          }, 4000);
        } catch (err) {
          console.error(err);
          setError("No se pudo registrar la asistencia.");
          setMensaje("");
          setEscaneado(false);
        }
      },
      (scanError) => {
        // no mostramos errores constantes del scanner
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [escaneado]);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Escáner QR</h1>
          <p>Escanea el QR del cliente para registrar su asistencia automáticamente.</p>
        </div>
      </div>

      {mensaje && <div className="form-success">{mensaje}</div>}
      {error && <div className="form-error">{error}</div>}

      <div className="scanner-card">
        <div id="qr-reader"></div>
      </div>
    </div>
  );
}