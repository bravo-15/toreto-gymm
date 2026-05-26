import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./AdminPage.css";
import api from "../../services/api";

const formInicial = {
  nombre: "",
  correo: "",
  password: "",
  rol: "ADMINISTRADOR",
  estado: "ACTIVO",
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formInicial);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron cargar los usuarios.");
    }
  };

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return usuarios.filter(
      (usuario) =>
        usuario.nombre?.toLowerCase().includes(texto) ||
        usuario.correo?.toLowerCase().includes(texto) ||
        usuario.rol?.toLowerCase().includes(texto)
    );
  }, [usuarios, busqueda]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const validarFormulario = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio.";
    if (!form.correo.includes("@")) return "El correo debe ser válido.";

    if (!editandoId && !form.password.trim()) {
      return "La contraseña es obligatoria.";
    }

    return "";
  };

  const guardarUsuario = async (e) => {
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
        correo: form.correo,
        rol: form.rol,
        estado: form.estado,
      };

      if (form.password.trim()) {
        datos.password = form.password;
      }

      if (editandoId) {
        await api.put(`/usuarios/${editandoId}`, datos);
        toast.success("Usuario actualizado correctamente.");
      } else {
        await api.post("/usuarios", datos);
        toast.success("Usuario registrado correctamente.");
      }

      await obtenerUsuarios();
      limpiarFormulario();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el usuario. Revisa si el correo ya existe.");
      toast.error("No se pudo guardar el usuario.");
    }
  };

  const editarUsuario = (usuario) => {
    setForm({
      nombre: usuario.nombre || "",
      correo: usuario.correo || "",
      password: "",
      rol: usuario.rol || "ADMINISTRADOR",
      estado: usuario.estado || "ACTIVO",
    });

    setEditandoId(usuario.id);
    setError("");
    toast.info("Editando usuario seleccionado.");
  };

  const eliminarUsuario = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar usuario?",
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
      await api.delete(`/usuarios/${id}`);
      await obtenerUsuarios();
      toast.success("Usuario eliminado correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar el usuario.");
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
          <h1>Usuarios</h1>
          <p>Gestiona usuarios y roles del sistema TORETO GYM</p>
        </div>

        <div className="admin-total">
          <span>Total usuarios</span>
          <strong>{usuarios.length}</strong>
        </div>
      </div>

      <form className="admin-form" onSubmit={guardarUsuario}>
        {error && <div className="form-error">{error}</div>}

        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={manejarCambio}
        />

        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={form.correo}
          onChange={manejarCambio}
        />

        <input
          type="password"
          name="password"
          placeholder={editandoId ? "Nueva contraseña opcional" : "Contraseña"}
          value={form.password}
          onChange={manejarCambio}
        />

        <select name="rol" value={form.rol} onChange={manejarCambio}>
          <option value="ADMINISTRADOR">Administrador</option>
          <option value="RECEPCIONISTA">Recepcionista</option>
          <option value="ENTRENADOR">Entrenador</option>
        </select>

        <select name="estado" value={form.estado} onChange={manejarCambio}>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>

        <button type="submit">
          {editandoId ? "Actualizar usuario" : "Registrar usuario"}
        </button>

        <button type="button" className="secondary-btn" onClick={limpiarFormulario}>
          Limpiar
        </button>
      </form>

      <input
        className="admin-search"
        type="text"
        placeholder="Buscar usuario por nombre, correo o rol..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.rol}</td>
                <td>
                  <span className={`badge ${usuario.estado.toLowerCase()}`}>
                    {usuario.estado}
                  </span>
                </td>
                <td>
                  <button type="button" onClick={() => editarUsuario(usuario)}>
                    Editar
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => eliminarUsuario(usuario.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {usuariosFiltrados.length === 0 && (
              <tr>
                <td colSpan="5">No hay usuarios registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}