import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./AdminPage.css";
import api from "../../services/api";

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerNotificaciones();
  }, []);

  const obtenerNotificaciones = async () => {
    try {
      const res = await api.get("/notificaciones");
      setNotificaciones(res.data);
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron cargar las notificaciones.");
    }
  };

  const generarAlertasMembresias = async () => {
    try {
      setError("");

      const res = await api.post("/notificaciones/generar-alertas-membresias");

      await obtenerNotificaciones();

      toast.success(
        `Revisión completada. Se generaron ${res.data.total || 0} notificaciones.`
      );
    } catch (err) {
      console.error(err);
      setError("No se pudieron generar las alertas automáticas.");
      toast.error("No se pudieron generar las alertas automáticas.");
    }
  };

  const marcarLeida = async (id) => {
    try {
      await api.put(`/notificaciones/${id}`, {
        estado: "LEIDO",
      });

      await obtenerNotificaciones();
      toast.success("Notificación marcada como leída.");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo marcar como leída.");
    }
  };

  const eliminarNotificacion = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar notificación?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ffd700",
      cancelButtonColor: "#d33",
      background: "#111",
      color: "#fff",
    });

    if (!confirmar.isConfirmed) return;

    try {
      await api.delete(`/notificaciones/${id}`);
      await obtenerNotificaciones();
      toast.success("Notificación eliminada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar la notificación.");
    }
  };

  const notificacionesFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return notificaciones.filter(
      (n) =>
        n.titulo?.toLowerCase().includes(texto) ||
        n.mensaje?.toLowerCase().includes(texto) ||
        n.tipo?.toLowerCase().includes(texto) ||
        n.estado?.toLowerCase().includes(texto)
    );
  }, [notificaciones, busqueda]);

  const noLeidas = notificaciones.filter(
    (n) => n.estado === "NO_LEIDO"
  ).length;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Notificaciones</h1>
          <p>
            Alertas automáticas de membresías vencidas, próximas a vencer y avisos del sistema.
          </p>
        </div>

        <div className="admin-total">
          <span>No leídas</span>
          <strong>{noLeidas}</strong>
        </div>
      </div>

      <div className="admin-form">
        {error && <div className="form-error">{error}</div>}

        <button
          type="button"
          onClick={generarAlertasMembresias}
        >
          Generar notificaciones automáticas
        </button>
      </div>

      <input
        className="admin-search"
        type="text"
        placeholder="Buscar notificación..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Mensaje</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {notificacionesFiltradas.map((n) => (
              <tr key={n.id}>
                <td>{n.titulo}</td>
                <td>{n.mensaje}</td>
                <td>{n.tipo}</td>
                <td>{n.created_at?.slice(0, 10) || "-"}</td>
                <td>
                  <span className={`badge ${n.estado.toLowerCase()}`}>
                    {n.estado === "NO_LEIDO" ? "No leído" : "Leído"}
                  </span>
                </td>
                <td>
                  {n.estado === "NO_LEIDO" && (
                    <button type="button" onClick={() => marcarLeida(n.id)}>
                      Marcar leído
                    </button>
                  )}

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => eliminarNotificacion(n.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {notificacionesFiltradas.length === 0 && (
              <tr>
                <td colSpan="6">
                  No hay notificaciones generadas automáticamente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}