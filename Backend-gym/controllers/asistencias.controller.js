const pool = require("../config/database");

const listar = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.id,
        a.cliente_id,
        c.nombre AS cliente,
        a.fecha,
        a.hora_ingreso,
        a.hora_salida,
        a.estado
      FROM asistencias a
      INNER JOIN clientes c
        ON c.id = a.cliente_id
      ORDER BY a.id DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar asistencias",
      error: error.message,
    });
  }
};

const crear = async (req, res) => {
  try {
    const { cliente_id } = req.body;

    const fechaActual = new Date().toISOString().slice(0, 10);
    const horaActual = new Date().toTimeString().slice(0, 8);

    const [membresia] = await pool.query(
      `
      SELECT *
      FROM cliente_membresias
      WHERE cliente_id = ?
      AND estado = 'ACTIVO'
      AND fecha_fin >= CURDATE()
      ORDER BY fecha_fin DESC
      LIMIT 1
      `,
      [cliente_id]
    );

    let estado = "VALIDO";

    if (membresia.length === 0) {
      estado = "DENEGADO";

      await pool.query(
        `
        INSERT INTO notificaciones
        (titulo, mensaje, tipo, estado)
        VALUES (?, ?, ?, ?)
        `,
        [
          "Ingreso denegado",
          `El cliente ID ${cliente_id} intentó ingresar sin membresía activa.`,
          "ASISTENCIA",
          "NO_LEIDO",
        ]
      );
    }

    await pool.query(
      `
      INSERT INTO asistencias
      (
        cliente_id,
        fecha,
        hora_ingreso,
        estado
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        cliente_id,
        fechaActual,
        horaActual,
        estado,
      ]
    );

    res.json({
      mensaje:
        estado === "VALIDO"
          ? "Ingreso permitido"
          : "Ingreso denegado por membresía vencida",
      estado,
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar asistencia",
      error: error.message,
    });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      cliente_id,
      fecha,
      hora_ingreso,
      hora_salida,
      estado,
    } = req.body;

    await pool.query(
      `
      UPDATE asistencias
      SET
        cliente_id = ?,
        fecha = ?,
        hora_ingreso = ?,
        hora_salida = ?,
        estado = ?
      WHERE id = ?
      `,
      [
        cliente_id,
        fecha,
        hora_ingreso,
        hora_salida,
        estado,
        id,
      ]
    );

    res.json({
      mensaje: "Asistencia actualizada correctamente",
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar asistencia",
      error: error.message,
    });
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM asistencias WHERE id = ?",
      [id]
    );

    res.json({
      mensaje: "Asistencia eliminada correctamente",
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar asistencia",
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