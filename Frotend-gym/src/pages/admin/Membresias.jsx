import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./AdminPage.css";
import api from "../../services/api";

const formInicial = {
  nombre: "",
  duracion: "30 días",
  precio: "",
  descripcion: "",
  estado: "Activo",
};

export default function Membresias() {
  const [membresias, setMembresias] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerMembresias();
  }, []);

  const obtenerMembresias = async () => {
    try {
      const res = await api.get("/membresias");
      setMembresias(res.data);
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron cargar las membresías.");
    }
  };

  const membresiasFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return membresias.filter(
      (m) =>
        m.nombre?.toLowerCase().includes(texto) ||
        m.duracion?.toLowerCase().includes(texto) ||
        m.estado?.toLowerCase().includes(texto)
    );
  }, [membresias, busqueda]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const validarFormulario = () => {
    if (!form.nombre.trim()) return "El nombre del plan es obligatorio.";
    if (!form.duracion.trim()) return "La duración es obligatoria.";
    if (!form.precio || Number(form.precio) <= 0) return "El precio debe ser mayor a 0.";
    if (!form.descripcion.trim()) return "La descripción es obligatoria.";
    return "";
  };

  const guardarMembresia = async (e) => {
    e.preventDefault();

    const mensajeError = validarFormulario();

    if (mensajeError) {
      setError(mensajeError);
      toast.warning(mensajeError);
      return;
    }

    try {
      const datos = {
        nombre: form.nombre,
        duracion: form.duracion,
        precio: Number(form.precio),
        descripcion: form.descripcion,
        estado: form.estado.toUpperCase(),
      };

      if (editandoId) {
        await api.put(`/membresias/${editandoId}`, datos);
        toast.success("Membresía actualizada correctamente.");
      } else {
        await api.post("/membresias", datos);
        toast.success("Membresía registrada correctamente.");
      }

      await obtenerMembresias();
      limpiarFormulario();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar la membresía.");
      toast.error("No se pudo guardar la membresía.");
    }
  };

  const editarMembresia = (m) => {
    setForm({
      nombre: m.nombre || "",
      duracion: m.duracion || "30 días",
      precio: m.precio || "",
      descripcion: m.descripcion || "",
      estado: m.estado === "ACTIVO" ? "Activo" : "Inactivo",
    });

    setEditandoId(m.id);
    setError("");
    toast.info("Editando membresía seleccionada.");
  };

  const eliminarMembresia = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar membresía?",
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
      await api.delete(`/membresias/${id}`);
      await obtenerMembresias();
      toast.success("Membresía eliminada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar la membresía.");
    }
  };

  const limpiarFormulario = () => {
    setForm(formInicial);
    setEditandoId(null);
    setError("");
  };

  const activas = membresias.filter((m) => m.estado === "ACTIVO").length;

  return (
    <section className="admin-section membresias-page">
      <div className="section-title">
        <div>
          <h2>Membresías</h2>
          <p>Administra los planes, precios, duración y estado de cada membresía.</p>
        </div>

        <div className="mini-resume">
          <strong>{activas}</strong>
          <span>planes activos</span>
        </div>
      </div>

      <div className="crud-grid">
        <form className="form-card" onSubmit={guardarMembresia}>
          <h3>{editandoId ? "Editar membresía" : "Nueva membresía"}</h3>

          {error && <div className="form-error">{error}</div>}

          <label>
            Nombre del plan
            <input
              name="nombre"
              value={form.nombre}
              onChange={manejarCambio}
              placeholder="Ej: Plan Mensual"
            />
          </label>

          <div className="form-row">
            <label>
              Duración
              <select name="duracion" value={form.duracion} onChange={manejarCambio}>
                <option>1 día</option>
                <option>7 días</option>
                <option>15 días</option>
                <option>30 días</option>
                <option>90 días</option>
                <option>180 días</option>
                <option>365 días</option>
              </select>
            </label>

            <label>
              Precio S/
              <input
                name="precio"
                type="number"
                min="1"
                step="0.01"
                value={form.precio}
                onChange={manejarCambio}
                placeholder="80.00"
              />
            </label>
          </div>

          <label>
            Descripción
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={manejarCambio}
              placeholder="Describe qué incluye este plan..."
              rows="4"
            />
          </label>

          <label>
            Estado
            <select name="estado" value={form.estado} onChange={manejarCambio}>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </label>

          <div className="form-actions">
            <button className="primary-btn" type="submit">
              {editandoId ? "Actualizar" : "Guardar"}
            </button>

            <button className="secondary-btn" type="button" onClick={limpiarFormulario}>
              Limpiar
            </button>
          </div>
        </form>

        <div className="table-card membresias-table-card">
          <div className="table-toolbar">
            <h3>Lista de membresías</h3>

            <input
              className="search-input"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por plan, duración o estado..."
            />
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Duración</th>
                <th>Precio</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {membresiasFiltradas.map((m) => (
                <tr key={m.id}>
                  <td>{m.nombre}</td>
                  <td>{m.duracion}</td>
                  <td>S/ {Number(m.precio).toFixed(2)}</td>
                  <td>{m.descripcion}</td>
                  <td>
                    <span className={`badge ${m.estado === "ACTIVO" ? "success" : "danger"}`}>
                      {m.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button type="button" onClick={() => editarMembresia(m)}>
                        Editar
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => eliminarMembresia(m.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {membresiasFiltradas.length === 0 && (
            <p className="empty-message">No se encontraron membresías.</p>
          )}
        </div>
      </div>
    </section>
  );
}