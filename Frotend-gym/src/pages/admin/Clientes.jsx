import { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./AdminPage.css";
import api from "../../services/api";

const formInicial = {
  nombre: "",
  dni: "",
  celular: "",
  correo: "",
  estado: "Activo",
};

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [clienteQR, setClienteQR] = useState(null);

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron cargar los clientes.");
    }
  };

  const clientesFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return clientes.filter(
      (cliente) =>
        cliente.nombre?.toLowerCase().includes(texto) ||
        cliente.dni?.includes(texto) ||
        cliente.celular?.includes(texto) ||
        cliente.telefono?.includes(texto)
    );
  }, [clientes, busqueda]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const validarFormulario = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio.";
    if (!/^[0-9]{8}$/.test(form.dni)) return "El DNI debe tener 8 números.";
    if (!/^[0-9]{9}$/.test(form.celular)) return "El celular debe tener 9 números.";
    if (!form.correo.includes("@")) return "El correo debe ser válido.";
    return "";
  };

  const guardarCliente = async (e) => {
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
        dni: form.dni,
        telefono: form.celular,
        correo: form.correo,
        estado: form.estado.toUpperCase(),
      };

      if (editandoId) {
        await api.put(`/clientes/${editandoId}`, datos);
        toast.success("Cliente actualizado correctamente.");
      } else {
        await api.post("/clientes", datos);
        toast.success("Cliente registrado correctamente.");
      }

      await obtenerClientes();
      limpiarFormulario();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el cliente.");
      toast.error("No se pudo guardar el cliente.");
    }
  };

  const editarCliente = (cliente) => {
    setForm({
      nombre: cliente.nombre || "",
      dni: cliente.dni || "",
      celular: cliente.telefono || cliente.celular || "",
      correo: cliente.correo || "",
      estado: cliente.estado === "ACTIVO" ? "Activo" : "Inactivo",
    });

    setEditandoId(cliente.id);
    setError("");
    toast.info("Editando cliente seleccionado.");
  };

  const eliminarCliente = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar cliente?",
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
      await api.delete(`/clientes/${id}`);
      await obtenerClientes();

      toast.success("Cliente eliminado correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar el cliente.");
    }
  };

  const limpiarFormulario = () => {
    setForm(formInicial);
    setEditandoId(null);
    setError("");
  };

  return (
    <section className="admin-section clientes-page">
      <div className="section-title">
        <div>
          <h2>Clientes</h2>
          <p>Registra, edita, busca y controla los clientes de TORETO GYM.</p>
        </div>

        <div className="mini-resume">
          <strong>{clientes.length}</strong>
          <span>clientes registrados</span>
        </div>
      </div>

      <div className="crud-grid">
        <form className="form-card" onSubmit={guardarCliente}>
          <h3>{editandoId ? "Editar cliente" : "Nuevo cliente"}</h3>

          {error && <div className="form-error">{error}</div>}

          <label>
            Nombre completo
            <input
              name="nombre"
              value={form.nombre}
              onChange={manejarCambio}
              placeholder="Ej: Juan Pérez"
            />
          </label>

          <div className="form-row">
            <label>
              DNI
              <input
                name="dni"
                value={form.dni}
                onChange={manejarCambio}
                placeholder="8 números"
                maxLength="8"
              />
            </label>

            <label>
              Celular
              <input
                name="celular"
                value={form.celular}
                onChange={manejarCambio}
                placeholder="9 números"
                maxLength="9"
              />
            </label>
          </div>

          <label>
            Correo
            <input
              name="correo"
              value={form.correo}
              onChange={manejarCambio}
              placeholder="cliente@gmail.com"
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

        <div className="table-card clientes-table-card">
          <div className="table-toolbar">
            <h3>Lista de clientes</h3>

            <input
              className="search-input"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, DNI o celular..."
            />
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Celular</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.dni}</td>
                  <td>{cliente.telefono || cliente.celular}</td>
                  <td>{cliente.correo}</td>
                  <td>
                    <span className={`badge ${cliente.estado === "ACTIVO" ? "success" : "danger"}`}>
                      {cliente.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button type="button" onClick={() => setClienteQR(cliente)}>
                        QR
                      </button>

                      <button type="button" onClick={() => editarCliente(cliente)}>
                        Editar
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => eliminarCliente(cliente.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {clientesFiltrados.length === 0 && (
            <p className="empty-message">No se encontraron clientes.</p>
          )}
        </div>
      </div>

      {clienteQR && (
        <div className="qr-overlay">
          <div className="carnet-card">
            <button className="qr-close no-print" onClick={() => setClienteQR(null)}>
              ✕
            </button>

            <div className="carnet-header">
              <div>
                <h2>TORETO GYM</h2>
                <p>Carnet Digital</p>
              </div>
              <span>⚡</span>
            </div>

            <div className="carnet-body">
              <div className="carnet-avatar">
                {clienteQR.nombre?.charAt(0).toUpperCase()}
              </div>

              <div className="carnet-info">
                <h3>{clienteQR.nombre}</h3>
                <p>DNI: {clienteQR.dni}</p>
                <p>Celular: {clienteQR.telefono || clienteQR.celular}</p>
                <p>Estado: {clienteQR.estado}</p>
              </div>
            </div>

            <div className="carnet-qr">
              <QRCodeCanvas
                value={String(clienteQR.id)}
                size={170}
                level="H"
              />
            </div>

            <div className="carnet-footer">
              <span>ID CLIENTE: {clienteQR.id}</span>
              <small>Escanear para registrar asistencia</small>
            </div>

            <button className="print-carnet-btn no-print" onClick={() => window.print()}>
              Imprimir carnet
            </button>
          </div>
        </div>
      )}
    </section>
  );
}