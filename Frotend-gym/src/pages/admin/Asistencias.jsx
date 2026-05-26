import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./AdminPage.css";
import api from "../../services/api";

const formInicial = {
  cliente_id: "",
  fecha: "",
  hora_ingreso: "",
  hora_salida: "",
  estado: "VALIDO",
};

export default function Asistencias() {
  const [asistencias, setAsistencias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formInicial);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const [asistenciasRes, clientesRes] = await Promise.all([
        api.get("/asistencias"),
        api.get("/clientes"),
      ]);

      setAsistencias(asistenciasRes.data);
      setClientes(clientesRes.data);
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron cargar las asistencias.");
    }
  };

  const fechaActual = () => new Date().toISOString().split("T")[0];

  const horaActual = () => new Date().toTimeString().slice(0, 5);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const asistenciasFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return asistencias.filter(
      (a) =>
        a.cliente?.toLowerCase().includes(texto) ||
        a.nombre_cliente?.toLowerCase().includes(texto) ||
        a.estado?.toLowerCase().includes(texto)
    );
  }, [asistencias, busqueda]);

  const validarFormulario = () => {
    if (!form.cliente_id) return "Selecciona un cliente.";
    return "";
  };

  const registrarAsistencia = async (e) => {
    e.preventDefault();

    const mensajeError = validarFormulario();

    if (mensajeError) {
      setError(mensajeError);
      toast.warning(mensajeError);
      return;
    }

    try {
      const datos = {
        cliente_id: Number(form.cliente_id),
        fecha: form.fecha || fechaActual(),
        hora_ingreso: form.hora_ingreso || horaActual(),
        hora_salida: form.hora_salida || null,
        estado: form.estado,
      };

      const res = editandoId
        ? await api.put(`/asistencias/${editandoId}`, datos)
        : await api.post("/asistencias", datos);

      if (editandoId) {
        toast.success("Asistencia actualizada correctamente.");
      } else if (res.data?.estado === "DENEGADO") {
        toast.error("Ingreso denegado. Cliente sin membresía activa.");
      } else {
        toast.success("Asistencia registrada. Ingreso permitido.");
      }

      await obtenerDatos();
      limpiarFormulario();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar la asistencia.");
      toast.error("No se pudo guardar la asistencia.");
    }
  };

  const registrarSalida = async (asistencia) => {
    try {
      const datos = {
        cliente_id: asistencia.cliente_id,
        fecha: asistencia.fecha?.slice(0, 10) || fechaActual(),
        hora_ingreso: asistencia.hora_ingreso,
        hora_salida: horaActual(),
        estado: asistencia.estado,
      };

      await api.put(`/asistencias/${asistencia.id}`, datos);
      await obtenerDatos();

      toast.success("Salida registrada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo registrar la salida.");
    }
  };

  const editarAsistencia = (asistencia) => {
    setForm({
      cliente_id: asistencia.cliente_id || "",
      fecha: asistencia.fecha?.slice(0, 10) || "",
      hora_ingreso: asistencia.hora_ingreso || "",
      hora_salida: asistencia.hora_salida || "",
      estado: asistencia.estado || "VALIDO",
    });

    setEditandoId(asistencia.id);
    setError("");
    toast.info("Editando asistencia seleccionada.");
  };

  const eliminarAsistencia = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar asistencia?",
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
      await api.delete(`/asistencias/${id}`);
      await obtenerDatos();
      toast.success("Asistencia eliminada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar la asistencia.");
    }
  };

  const limpiarFormulario = () => {
    setForm(formInicial);
    setEditandoId(null);
    setError("");
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Asistencias</h1>
          <p>Registra ingresos y salidas de clientes</p>
        </div>

        <div className="admin-total">
          <span>Asistencias registradas</span>
          <strong>{asistencias.length}</strong>
        </div>
      </div>

      <form className="admin-form" onSubmit={registrarAsistencia}>
        {error && <div className="form-error">{error}</div>}

        <select
          name="cliente_id"
          value={form.cliente_id}
          onChange={manejarCambio}
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} - DNI: {cliente.dni}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={manejarCambio}
        />

        <input
          type="time"
          name="hora_ingreso"
          value={form.hora_ingreso}
          onChange={manejarCambio}
        />

        <input
          type="time"
          name="hora_salida"
          value={form.hora_salida || ""}
          onChange={manejarCambio}
        />

        <select name="estado" value={form.estado} onChange={manejarCambio}>
          <option value="VALIDO">Válido</option>
          <option value="DENEGADO">Denegado</option>
        </select>

        <button type="submit">
          {editandoId ? "Actualizar asistencia" : "Registrar asistencia"}
        </button>

        <button type="button" className="secondary-btn" onClick={limpiarFormulario}>
          Limpiar
        </button>
      </form>

      <input
        className="admin-search"
        type="text"
        placeholder="Buscar asistencia por cliente o estado..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {asistenciasFiltradas.map((a) => (
              <tr key={a.id}>
                <td>{a.cliente || a.nombre_cliente}</td>
                <td>{a.fecha?.slice(0, 10)}</td>
                <td>{a.hora_ingreso || "—"}</td>
                <td>{a.hora_salida || "Sin salida"}</td>
                <td>
                  <span className={`badge ${a.estado.toLowerCase()}`}>
                    {a.estado}
                  </span>
                </td>
                <td>
                  <button type="button" onClick={() => registrarSalida(a)}>
                    Salida
                  </button>

                  <button type="button" onClick={() => editarAsistencia(a)}>
                    Editar
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => eliminarAsistencia(a.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {asistenciasFiltradas.length === 0 && (
              <tr>
                <td colSpan="6">No hay asistencias registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}