const pool = require("../config/database");

const listar = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM notificaciones
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar notificaciones",
      error: error.message,
    });
  }
};

const crear = async (req, res) => {
  try {
    const { titulo, mensaje, tipo, estado } = req.body;

    await pool.query(
      `
      INSERT INTO notificaciones (titulo, mensaje, tipo, estado)
      VALUES (?, ?, ?, ?)
      `,
      [
        titulo,
        mensaje,
        tipo || "INFO",
        estado || "NO_LEIDO",
      ]
    );

    res.json({
      mensaje: "Notificación creada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear notificación",
      error: error.message,
    });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await pool.query(
      `
      UPDATE notificaciones
      SET estado = ?
      WHERE id = ?
      `,
      [estado || "LEIDO", id]
    );

    res.json({
      mensaje: "Notificación actualizada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar notificación",
      error: error.message,
    });
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM notificaciones
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      mensaje: "Notificación eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar notificación",
      error: error.message,
    });
  }
};

const crearSiNoExiste = async (titulo, mensaje, tipo = "MEMBRESIA") => {
  const [existe] = await pool.query(
    `
    SELECT id
    FROM notificaciones
    WHERE titulo = ?
    AND mensaje = ?
    LIMIT 1
    `,
    [titulo, mensaje]
  );

  if (existe.length === 0) {
    await pool.query(
      `
      INSERT INTO notificaciones (titulo, mensaje, tipo, estado)
      VALUES (?, ?, ?, 'NO_LEIDO')
      `,
      [titulo, mensaje, tipo]
    );

    return true;
  }

  return false;
};

const generarAlertasMembresias = async (req, res) => {
  try {
    const [vencidas] = await pool.query(`
      SELECT
        cm.id,
        cm.fecha_fin,
        c.nombre AS cliente_nombre,
        m.nombre AS membresia_nombre
      FROM cliente_membresias cm
      INNER JOIN clientes c ON c.id = cm.cliente_id
      INNER JOIN membresias m ON m.id = cm.membresia_id
      WHERE cm.fecha_fin < CURDATE()
      AND cm.estado = 'ACTIVO'
    `);

    const [porVencer] = await pool.query(`
      SELECT
        cm.id,
        cm.fecha_fin,
        c.nombre AS cliente_nombre,
        m.nombre AS membresia_nombre
      FROM cliente_membresias cm
      INNER JOIN clientes c ON c.id = cm.cliente_id
      INNER JOIN membresias m ON m.id = cm.membresia_id
      WHERE cm.fecha_fin BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
      AND cm.estado = 'ACTIVO'
    `);

    let totalGeneradas = 0;

    for (const item of vencidas) {
      const fecha = new Date(item.fecha_fin).toISOString().slice(0, 10);

      const titulo = "Membresía vencida";
      const mensaje = `La membresía "${item.membresia_nombre}" del cliente ${item.cliente_nombre} venció el ${fecha}.`;

      const creada = await crearSiNoExiste(titulo, mensaje, "MEMBRESIA");

      if (creada) totalGeneradas++;

      await pool.query(
        `
        UPDATE cliente_membresias
        SET estado = 'VENCIDO'
        WHERE id = ?
        `,
        [item.id]
      );
    }

    for (const item of porVencer) {
      const fecha = new Date(item.fecha_fin).toISOString().slice(0, 10);

      const titulo = "Membresía por vencer";
      const mensaje = `La membresía "${item.membresia_nombre}" del cliente ${item.cliente_nombre} vence el ${fecha}.`;

      const creada = await crearSiNoExiste(titulo, mensaje, "MEMBRESIA");

      if (creada) totalGeneradas++;
    }

    res.json({
      mensaje: "Alertas automáticas revisadas correctamente",
      total: totalGeneradas,
      vencidas: vencidas.length,
      porVencer: porVencer.length,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al generar alertas de membresías",
      error: error.message,
    });
  }
};

module.exports = {
  listar,
  crear,
  actualizar,
  eliminar,
  generarAlertasMembresias,
};