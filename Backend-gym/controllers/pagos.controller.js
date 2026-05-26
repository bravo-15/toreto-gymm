const pool = require("../config/database");

const calcularFechaFin = (fechaInicio, duracion) => {
  const fecha = new Date(fechaInicio);
  const texto = String(duracion || "").toLowerCase();

  if (texto.includes("1")) fecha.setDate(fecha.getDate() + 1);
  if (texto.includes("7")) fecha.setDate(fecha.getDate() + 7);
  if (texto.includes("15")) fecha.setDate(fecha.getDate() + 15);
  if (texto.includes("30")) fecha.setDate(fecha.getDate() + 30);
  if (texto.includes("90")) fecha.setDate(fecha.getDate() + 90);
  if (texto.includes("180")) fecha.setDate(fecha.getDate() + 180);
  if (texto.includes("365")) fecha.setDate(fecha.getDate() + 365);

  return fecha.toISOString().slice(0, 10);
};

const listar = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id,
        p.cliente_id,
        p.membresia_id,
        c.nombre AS cliente,
        m.nombre AS membresia,
        p.monto,
        p.metodo_pago,
        p.estado,
        p.fecha_pago
      FROM pagos p
      INNER JOIN clientes c ON c.id = p.cliente_id
      INNER JOIN membresias m ON m.id = p.membresia_id
      ORDER BY p.id DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar pagos",
      error: error.message,
    });
  }
};

const crear = async (req, res) => {
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    const {
      cliente_id,
      membresia_id,
      monto,
      metodo_pago,
      estado,
      fecha_pago,
    } = req.body;

    await conexion.query(
      `
      INSERT INTO pagos
      (cliente_id, membresia_id, monto, metodo_pago, estado, fecha_pago)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [cliente_id, membresia_id, monto, metodo_pago, estado, fecha_pago]
    );

    if (estado === "PAGADO") {
      const [[membresia]] = await conexion.query(
        "SELECT duracion FROM membresias WHERE id = ?",
        [membresia_id]
      );

      const fechaInicio = fecha_pago;
      const fechaFin = calcularFechaFin(fechaInicio, membresia.duracion);

      await conexion.query(
        `
        UPDATE cliente_membresias
        SET estado = 'VENCIDO'
        WHERE cliente_id = ?
        AND estado = 'ACTIVO'
        `,
        [cliente_id]
      );

      await conexion.query(
        `
        INSERT INTO cliente_membresias
        (cliente_id, membresia_id, fecha_inicio, fecha_fin, estado)
        VALUES (?, ?, ?, ?, 'ACTIVO')
        `,
        [cliente_id, membresia_id, fechaInicio, fechaFin]
      );

      await conexion.query(
        `
        INSERT INTO notificaciones
        (titulo, mensaje, tipo, estado)
        VALUES (?, ?, ?, ?)
        `,
        [
          "Membresía activada",
          `Se activó una nueva membresía para el cliente ID ${cliente_id}. Vence el ${fechaFin}.`,
          "MEMBRESIA",
          "NO_LEIDO",
        ]
      );
    }

    await conexion.commit();

    res.json({
      mensaje: "Pago registrado y membresía procesada correctamente",
    });
  } catch (error) {
    await conexion.rollback();

    res.status(500).json({
      mensaje: "Error al crear pago",
      error: error.message,
    });
  } finally {
    conexion.release();
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      cliente_id,
      membresia_id,
      monto,
      metodo_pago,
      estado,
      fecha_pago,
    } = req.body;

    await pool.query(
      `
      UPDATE pagos
      SET cliente_id = ?, membresia_id = ?, monto = ?, metodo_pago = ?, estado = ?, fecha_pago = ?
      WHERE id = ?
      `,
      [cliente_id, membresia_id, monto, metodo_pago, estado, fecha_pago, id]
    );

    res.json({
      mensaje: "Pago actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar pago",
      error: error.message,
    });
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM pagos WHERE id = ?", [id]);

    res.json({
      mensaje: "Pago eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar pago",
      error: error.message,
    });
  }
};

module.exports = {
  listar,
  crear,
  actualizar,
  eliminar,
};