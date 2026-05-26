import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "../../services/api";
import "./AdminPage.css";

export default function ClienteMembresias() {
  const [clienteMembresias, setClienteMembresias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [membresias, setMembresias] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    cliente_id: "",
    membresia_id: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "ACTIVO",
  });

  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const [clientesRes, membresiasRes, clienteMembresiasRes] =
        await Promise.all([
          api.get("/clientes"),
          api.get("/membresias"),
          api.get("/cliente-membresias"),
        ]);

      setClientes(clientesRes.data);
      setMembresias(membresiasRes.data);
      setClienteMembresias(clienteMembresiasRes.data);
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron cargar las membresías de clientes.");
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      cliente_id: "",
      membresia_id: "",
      fecha_inicio: "",
      fecha_fin: "",
      estado: "ACTIVO",
    });

    setEditandoId(null);
    setError("");
  };

  const validarFormulario = () => {
    if (!formData.cliente_id) return "Selecciona un cliente.";
    if (!formData.membresia_id) return "Selecciona una membresía.";
    if (!formData.fecha_inicio) return "Selecciona la fecha de inicio.";
    if (!formData.fecha_fin) return "Selecciona la fecha de vencimiento.";
    return "";
  };

  const calcularFechaFin = (fechaInicio, membresiaId) => {
    const membresia = membresias.find(
      (m) => String(m.id) === String(membresiaId)
    );

    if (!fechaInicio || !membresia) return "";

    const fecha = new Date(fechaInicio);
    const duracion = String(membresia.duracion || "").toLowerCase();

    if (duracion.includes("365")) fecha.setDate(fecha.getDate() + 365);
    else if (duracion.includes("180")) fecha.setDate(fecha.getDate() + 180);
    else if (duracion.includes("90")) fecha.setDate(fecha.getDate() + 90);
    else if (duracion.includes("30")) fecha.setDate(fecha.getDate() + 30);
    else if (duracion.includes("15")) fecha.setDate(fecha.getDate() + 15);
    else if (duracion.includes("7")) fecha.setDate(fecha.getDate() + 7);
    else if (duracion.includes("1")) fecha.setDate(fecha.getDate() + 1);

    return fecha.toISOString().slice(0, 10);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nuevoForm = {
      ...formData,
      [name]: value,
    };

    if (name === "fecha_inicio" || name === "membresia_id") {
      const fechaInicio =
        name === "fecha_inicio" ? value : formData.fecha_inicio;

      const membresiaId =
        name === "membresia_id" ? value : formData.membresia_id;

      nuevoForm.fecha_fin = calcularFechaFin(fechaInicio, membresiaId);
    }

    setFormData(nuevoForm);
    setError("");
  };

  const guardar = async (e) => {
    e.preventDefault();

    const mensajeError = validarFormulario();

    if (mensajeError) {
      setError(mensajeError);
      toast.warning(mensajeError);
      return;
    }

    try {
      setError("");

      const datos = {
        cliente_id: Number(formData.cliente_id),
        membresia_id: Number(formData.membresia_id),
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        estado: formData.estado,
      };

      if (editandoId) {
        await api.put(`/cliente-membresias/${editandoId}`, datos);
        toast.success("Membresía actualizada correctamente.");
      } else {
        await api.post("/cliente-membresias", datos);
        toast.success("Membresía asignada correctamente.");
      }

      limpiarFormulario();
      await obtenerDatos();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar la membresía del cliente.");
      toast.error("No se pudo guardar la membresía del cliente.");
    }
  };

  const editar = (item) => {
    setEditandoId(item.id);

    setFormData({
      cliente_id: item.cliente_id || "",
      membresia_id: item.membresia_id || "",
      fecha_inicio: item.fecha_inicio?.slice(0, 10) || "",
      fecha_fin: item.fecha_fin?.slice(0, 10) || "",
      estado: item.estado || "ACTIVO",
    });

    setError("");
    toast.info("Editando membresía asignada.");
  };

  const eliminar = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar membresía asignada?",
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
      await api.delete(`/cliente-membresias/${id}`);
      await obtenerDatos();
      toast.success("Membresía asignada eliminada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar la membresía asignada.");
    }
  };

  const datosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return clienteMembresias.filter(
      (item) =>
        item.cliente_nombre?.toLowerCase().includes(texto) ||
        item.membresia_nombre?.toLowerCase().includes(texto) ||
        item.estado?.toLowerCase().includes(texto)
    );
  }, [clienteMembresias, busqueda]);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Membresías de Clientes</h1>
          <p>Asigna membresías a clientes y controla fechas de vencimiento</p>
        </div>

        <div className="admin-total">
          <span>Total asignadas</span>
          <strong>{clienteMembresias.length}</strong>
        </div>
      </div>

      <form className="admin-form" onSubmit={guardar}>
        {error && <div className="form-error">{error}</div>}

        <select
          name="cliente_id"
          value={formData.cliente_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar cliente</option>

          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} - DNI: {cliente.dni}
            </option>
          ))}
        </select>

        <select
          name="membresia_id"
          value={formData.membresia_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar membresía</option>

          {membresias.map((membresia) => (
            <option key={membresia.id} value={membresia.id}>
              {membresia.nombre} - {membresia.duracion}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="fecha_inicio"
          value={formData.fecha_inicio}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="fecha_fin"
          value={formData.fecha_fin}
          onChange={handleChange}
          required
        />

        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        >
          <option value="ACTIVO">Activo</option>
          <option value="VENCIDO">Vencido</option>
          <option value="SUSPENDIDO">Suspendido</option>
        </select>

        <button type="submit">
          {editandoId ? "Actualizar membresía" : "Asignar membresía"}
        </button>

        <button
          type="button"
          className="secondary-btn"
          onClick={limpiarFormulario}
        >
          Limpiar
        </button>
      </form>

      <input
        className="admin-search"
        type="text"
        placeholder="Buscar por cliente, membresía o estado..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Membresía</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {datosFiltrados.map((item) => (
              <tr key={item.id}>
                <td>{item.cliente_nombre}</td>
                <td>{item.membresia_nombre}</td>
                <td>{item.fecha_inicio?.slice(0, 10)}</td>
                <td>{item.fecha_fin?.slice(0, 10)}</td>
                <td>
                  <span className={`badge ${item.estado.toLowerCase()}`}>
                    {item.estado}
                  </span>
                </td>

                <td>
                  <button type="button" onClick={() => editar(item)}>
                    Editar
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => eliminar(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {datosFiltrados.length === 0 && (
              <tr>
                <td colSpan="6">No hay membresías asignadas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}