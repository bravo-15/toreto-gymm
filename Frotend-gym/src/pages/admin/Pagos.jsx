import { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./AdminPage.css";
import api from "../../services/api";

const formInicial = {
  cliente_id: "",
  membresia_id: "",
  monto: "",
  metodo_pago: "EFECTIVO",
  fecha_pago: "",
  estado: "PAGADO",
};

export default function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formInicial);
  const [error, setError] = useState("");
  const [boleta, setBoleta] = useState(null);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const [pagosRes, clientesRes, membresiasRes] = await Promise.all([
        api.get("/pagos"),
        api.get("/clientes"),
        api.get("/membresias"),
      ]);

      setPagos(pagosRes.data);
      setClientes(clientesRes.data);
      setMembresias(membresiasRes.data);
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron cargar los datos de pagos.");
    }
  };

  const pagosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return pagos.filter(
      (pago) =>
        pago.cliente?.toLowerCase().includes(texto) ||
        pago.membresia?.toLowerCase().includes(texto) ||
        pago.metodo_pago?.toLowerCase().includes(texto) ||
        pago.estado?.toLowerCase().includes(texto)
    );
  }, [pagos, busqueda]);

  const totalPagado = pagos
    .filter((pago) => pago.estado === "PAGADO")
    .reduce((total, pago) => total + Number(pago.monto || 0), 0);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    if (name === "membresia_id") {
      const membresia = membresias.find(
        (m) => String(m.id) === String(value)
      );

      setForm({
        ...form,
        membresia_id: value,
        monto: membresia?.precio || form.monto,
      });

      setError("");
      return;
    }

    setForm({ ...form, [name]: value });
    setError("");
  };

  const validarFormulario = () => {
    if (!form.cliente_id) return "Selecciona un cliente.";
    if (!form.membresia_id) return "Selecciona una membresía.";
    if (!form.monto || Number(form.monto) <= 0) return "El monto debe ser mayor a 0.";
    if (!form.fecha_pago) return "Selecciona la fecha de pago.";
    return "";
  };

  const guardarPago = async (e) => {
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
        membresia_id: Number(form.membresia_id),
        monto: Number(form.monto),
        metodo_pago: form.metodo_pago,
        estado: form.estado,
        fecha_pago: form.fecha_pago,
      };

      if (editandoId) {
        await api.put(`/pagos/${editandoId}`, datos);
        toast.success("Pago actualizado correctamente.");
      } else {
        await api.post("/pagos", datos);
        toast.success("Pago registrado y membresía procesada.");
      }

      await obtenerDatos();
      setForm(formInicial);
      setEditandoId(null);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el pago.");
      toast.error("No se pudo guardar el pago.");
    }
  };

  const editarPago = (pago) => {
    setForm({
      cliente_id: pago.cliente_id || "",
      membresia_id: pago.membresia_id || "",
      monto: pago.monto || "",
      metodo_pago: pago.metodo_pago || "EFECTIVO",
      fecha_pago: pago.fecha_pago?.slice(0, 10) || "",
      estado: pago.estado || "PAGADO",
    });

    setEditandoId(pago.id);
    setError("");
    toast.info("Editando pago seleccionado.");
  };

  const eliminarPago = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar pago?",
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
      await api.delete(`/pagos/${id}`);
      await obtenerDatos();
      toast.success("Pago eliminado correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar el pago.");
    }
  };

  const abrirBoleta = (pago) => {
    setBoleta(pago);
    toast.info("Boleta generada correctamente.");
  };

  const imprimirBoleta = () => {
    toast.success("Preparando impresión de boleta.");
    setTimeout(() => window.print(), 300);
  };

  const limpiarFormulario = () => {
    setForm(formInicial);
    setEditandoId(null);
    setError("");
  };

  return (
    <div className="admin-page">
      <div className="admin-header no-print">
        <div>
          <h1>Pagos</h1>
          <p>Gestiona pagos y genera boletas de TORETO GYM</p>
        </div>

        <div className="admin-total">
          <span>Total pagado</span>
          <strong>S/ {totalPagado.toFixed(2)}</strong>
        </div>
      </div>

      <form className="admin-form no-print" onSubmit={guardarPago}>
        {error && <div className="form-error">{error}</div>}

        <select name="cliente_id" value={form.cliente_id} onChange={manejarCambio}>
          <option value="">Seleccionar cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} - DNI: {cliente.dni}
            </option>
          ))}
        </select>

        <select name="membresia_id" value={form.membresia_id} onChange={manejarCambio}>
          <option value="">Seleccionar membresía</option>
          {membresias.map((membresia) => (
            <option key={membresia.id} value={membresia.id}>
              {membresia.nombre} - S/ {Number(membresia.precio).toFixed(2)}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="monto"
          placeholder="Monto"
          value={form.monto}
          onChange={manejarCambio}
        />

        <select name="metodo_pago" value={form.metodo_pago} onChange={manejarCambio}>
          <option value="EFECTIVO">Efectivo</option>
          <option value="YAPE">Yape</option>
          <option value="PLIN">Plin</option>
          <option value="TARJETA">Tarjeta</option>
        </select>

        <input
          type="date"
          name="fecha_pago"
          value={form.fecha_pago}
          onChange={manejarCambio}
        />

        <select name="estado" value={form.estado} onChange={manejarCambio}>
          <option value="PAGADO">Pagado</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="ANULADO">Anulado</option>
        </select>

        <button type="submit">
          {editandoId ? "Actualizar pago" : "Registrar pago"}
        </button>

        <button type="button" className="secondary-btn" onClick={limpiarFormulario}>
          Limpiar
        </button>
      </form>

      <input
        className="admin-search no-print"
        type="text"
        placeholder="Buscar pago por cliente, membresía, método o estado..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="admin-table-container no-print">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Membresía</th>
              <th>Monto</th>
              <th>Método</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pagosFiltrados.map((pago) => (
              <tr key={pago.id}>
                <td>{pago.cliente}</td>
                <td>{pago.membresia}</td>
                <td>S/ {Number(pago.monto).toFixed(2)}</td>
                <td>{pago.metodo_pago}</td>
                <td>{pago.fecha_pago?.slice(0, 10)}</td>
                <td>
                  <span className={`badge ${pago.estado.toLowerCase()}`}>
                    {pago.estado}
                  </span>
                </td>
                <td>
                  <button type="button" onClick={() => abrirBoleta(pago)}>
                    Boleta
                  </button>

                  <button type="button" onClick={() => editarPago(pago)}>
                    Editar
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => eliminarPago(pago.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {pagosFiltrados.length === 0 && (
              <tr>
                <td colSpan="7">No hay pagos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {boleta && (
        <div className="boleta-overlay">
          <div className="boleta-actions no-print">
            <button onClick={() => setBoleta(null)}>Cerrar</button>
            <button onClick={imprimirBoleta}>Imprimir / Guardar PDF</button>
          </div>

          <div className="boleta-ticket">
            <div className="boleta-top">
              <div>
                <div className="boleta-logo">⚡ TORETO GYM</div>
                <p>PUCALLPA</p>
              </div>

              <div className="boleta-serie">
                <h2>BOLETA ELECTRÓNICA</h2>
                <strong>BB01-{String(boleta.id).padStart(8, "0")}</strong>
              </div>
            </div>

            <div className="boleta-line"></div>

            <div className="boleta-info">
              <p><b>Cliente:</b> {boleta.cliente}</p>
              <p><b>DNI:</b> {boleta.dni || "00000000"}</p>
              <p><b>Tienda:</b> PUCALLPA</p>
              <p><b>Vendedor:</b> Administrador</p>
              <p><b>Fecha:</b> {boleta.fecha_pago?.slice(0, 10)}</p>
            </div>

            <table className="boleta-table">
              <thead>
                <tr>
                  <th>CANT.</th>
                  <th>DESCRIPCIÓN</th>
                  <th>VALOR U.</th>
                  <th>TOTAL</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>{boleta.membresia}</td>
                  <td>S/ {Number(boleta.monto).toFixed(2)}</td>
                  <td>S/ {Number(boleta.monto).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div className="boleta-total">
              <p>OP. EXONERADA <span>S/ 0.00</span></p>
              <p>OP. GRAVADA <span>S/ 0.00</span></p>
              <p>IGV 18% <span>S/ 0.00</span></p>
              <h3>TOTAL A PAGAR <span>S/ {Number(boleta.monto).toFixed(2)}</span></h3>
            </div>

            <div className="boleta-qr">
              <QRCodeCanvas
                value={`TORETO GYM | BOLETA BB01-${boleta.id} | CLIENTE ${boleta.cliente} | TOTAL S/ ${boleta.monto}`}
                size={120}
              />
              <p>Comprobante generado por TORETO GYM</p>
            </div>

            <div className="boleta-pago">
              <b>CONDICIÓN DE PAGO:</b> CONTADO
              <span>{boleta.metodo_pago} - S/ {Number(boleta.monto).toFixed(2)}</span>
            </div>

            <div className="boleta-footer">
              ¡GRACIAS POR TU PREFERENCIA!
              <small>Sigue entrenando, sigue superándote ⚡</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}