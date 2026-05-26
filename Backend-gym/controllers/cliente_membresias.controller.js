const pool = require("../config/database");

const listar = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        cm.id,
        cm.cliente_id,
        cm.membresia_id,

        c.nombre AS cliente_nombre,

        CONCAT(
          m.nombre,
          ' - ',
          m.duracion,
          ' días'
        ) AS membresia_nombre,

        cm.fecha_inicio,
        cm.fecha_fin,
        cm.estado

      FROM cliente_membresias cm

      INNER JOIN clientes c
        ON c.id = cm.cliente_id

      INNER JOIN membresias m
        ON m.id = cm.membresia_id

      ORDER BY cm.id DESC
    `);

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar membresías de clientes",
      error: error.message,
    });
  }
};

const crear = async (req, res) => {
  try {
    const {
      cliente_id,
      membresia_id,
      fecha_inicio,
      fecha_fin,
      estado,
    } = req.body;

    await pool.query(
      `
      INSERT INTO cliente_membresias
      (
        cliente_id,
        membresia_id,
        fecha_inicio,
        fecha_fin,
        estado
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        cliente_id,
        membresia_id,
        fecha_inicio,
        fecha_fin,
        estado,
      ]
    );

    res.json({
      mensaje: "Membresía asignada correctamente",
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear membresía",
      error: error.message,
    });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      cliente_id,
      membresia_id,
      fecha_inicio,
      fecha_fin,
      estado,
    } = req.body;

    await pool.query(
      `
      UPDATE cliente_membresias
      SET
        cliente_id = ?,
        membresia_id = ?,
        fecha_inicio = ?,
        fecha_fin = ?,
        estado = ?
      WHERE id = ?
      `,
      [
        cliente_id,
        membresia_id,
        fecha_inicio,
        fecha_fin,
        estado,
        id,
      ]
    );

    res.json({
      mensaje: "Membresía actualizada correctamente",
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar membresía",
      error: error.message,
    });
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM cliente_membresias WHERE id = ?",
      [id]
    );

    res.json({
      mensaje: "Membresía eliminada correctamente",
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar membresía",
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