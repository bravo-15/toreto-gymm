import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./AdminPage.css";
import api from "../../services/api";

const formInicial = {
  nombre: "",
  grupo_muscular: "Pecho",
  series: "",
  repeticiones: "",
  nivel: "PRINCIPIANTE",
  duracion: "",
  estado: "ACTIVO",
};

export default function Rutinas() {
  const [rutinas, setRutinas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formInicial);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerRutinas();
  }, []);

  const obtenerRutinas = async () => {
    try {
      const res = await api.get("/rutinas");
      setRutinas(res.data);
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron cargar las rutinas.");
    }
  };

  const rutinasFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return rutinas.filter(
      (rutina) =>
        rutina.nombre?.toLowerCase().includes(texto) ||
        rutina.grupo_muscular?.toLowerCase().includes(texto) ||
        rutina.nivel?.toLowerCase().includes(texto)
    );
  }, [rutinas, busqueda]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const validarFormulario = () => {
    if (!form.nombre.trim()) return "El nombre de la rutina es obligatorio.";
    if (!form.grupo_muscular.trim()) return "Selecciona un grupo muscular.";
    if (!form.series || Number(form.series) <= 0) return "Las series deben ser mayores a 0.";
    if (!form.repeticiones || Number(form.repeticiones) <= 0) return "Las repeticiones deben ser mayores a 0.";
    if (!form.duracion.trim()) return "La duración es obligatoria.";
    return "";
  };

  const guardarRutina = async (e) => {
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
        grupo_muscular: form.grupo_muscular,
        series: Number(form.series),
        repeticiones: Number(form.repeticiones),
        nivel: form.nivel,
        duracion: form.duracion,
        estado: form.estado,
      };

      if (editandoId) {
        await api.put(`/rutinas/${editandoId}`, datos);
        toast.success("Rutina actualizada correctamente.");
      } else {
        await api.post("/rutinas", datos);
        toast.success("Rutina registrada correctamente.");
      }

      await obtenerRutinas();
      limpiarFormulario();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar la rutina.");
      toast.error("No se pudo guardar la rutina.");
    }
  };

  const editarRutina = (rutina) => {
    setForm({
      nombre: rutina.nombre || "",
      grupo_muscular: rutina.grupo_muscular || "Pecho",
      series: rutina.series || "",
      repeticiones: rutina.repeticiones || "",
      nivel: rutina.nivel || "PRINCIPIANTE",
      duracion: rutina.duracion || "",
      estado: rutina.estado || "ACTIVO",
    });

    setEditandoId(rutina.id);
    setError("");
    toast.info("Editando rutina seleccionada.");
  };

  const eliminarRutina = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar rutina?",
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
      await api.delete(`/rutinas/${id}`);
      await obtenerRutinas();
      toast.success("Rutina eliminada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar la rutina.");
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
          <h1>Rutinas</h1>
          <p>Gestiona rutinas de entrenamiento para TORETO GYM</p>
        </div>

        <div className="admin-total">
          <span>Total rutinas</span>
          <strong>{rutinas.length}</strong>
        </div>
      </div>

      <form className="admin-form" onSubmit={guardarRutina}>
        {error && <div className="form-error">{error}</div>}

        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la rutina"
          value={form.nombre}
          onChange={manejarCambio}
        />

        <select
          name="grupo_muscular"
          value={form.grupo_muscular}
          onChange={manejarCambio}
        >
          <option value="Pecho">Pecho</option>
          <option value="Espalda">Espalda</option>
          <option value="Piernas">Piernas</option>
          <option value="Hombros">Hombros</option>
          <option value="Brazos">Brazos</option>
          <option value="Abdomen">Abdomen</option>
          <option value="Full Body">Full Body</option>
        </select>

        <input
          type="number"
          name="series"
          placeholder="Series"
          value={form.series}
          onChange={manejarCambio}
        />

        <input
          type="number"
          name="repeticiones"
          placeholder="Repeticiones"
          value={form.repeticiones}
          onChange={manejarCambio}
        />

        <select name="nivel" value={form.nivel} onChange={manejarCambio}>
          <option value="PRINCIPIANTE">Principiante</option>
          <option value="INTERMEDIO">Intermedio</option>
          <option value="AVANZADO">Avanzado</option>
        </select>

        <input
          type="text"
          name="duracion"
          placeholder="Duración ej: 45 min"
          value={form.duracion}
          onChange={manejarCambio}
        />

        <select name="estado" value={form.estado} onChange={manejarCambio}>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>

        <button type="submit">
          {editandoId ? "Actualizar rutina" : "Registrar rutina"}
        </button>

        <button type="button" className="secondary-btn" onClick={limpiarFormulario}>
          Limpiar
        </button>
      </form>

      <input
        className="admin-search"
        type="text"
        placeholder="Buscar por rutina, grupo muscular o nivel..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Rutina</th>
              <th>Grupo</th>
              <th>Series</th>
              <th>Repeticiones</th>
              <th>Nivel</th>
              <th>Duración</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {rutinasFiltradas.map((rutina) => (
              <tr key={rutina.id}>
                <td>{rutina.nombre}</td>
                <td>{rutina.grupo_muscular}</td>
                <td>{rutina.series}</td>
                <td>{rutina.repeticiones}</td>
                <td>{rutina.nivel}</td>
                <td>{rutina.duracion}</td>
                <td>
                  <span className={`badge ${rutina.estado.toLowerCase()}`}>
                    {rutina.estado}
                  </span>
                </td>
                <td>
                  <button type="button" onClick={() => editarRutina(rutina)}>
                    Editar
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => eliminarRutina(rutina.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {rutinasFiltradas.length === 0 && (
              <tr>
                <td colSpan="8">No hay rutinas registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}