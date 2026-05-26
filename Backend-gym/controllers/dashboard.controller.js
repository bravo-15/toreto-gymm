const pool = require("../config/database");

const resumen = async (req, res) => {
  try {
    const [[clientes]] = await pool.query(`
      SELECT COUNT(*) total 
      FROM clientes
    `);

    const [[membresiasActivas]] = await pool.query(`
      SELECT COUNT(*) total 
      FROM cliente_membresias
      WHERE estado = 'ACTIVO'
      AND fecha_fin >= CURDATE()
    `);

    const [[membresiasVencidas]] = await pool.query(`
      SELECT COUNT(*) total 
      FROM cliente_membresias
      WHERE estado = 'VENCIDO'
      OR fecha_fin < CURDATE()
    `);

    const [[membresiasPorVencer]] = await pool.query(`
      SELECT COUNT(*) total 
      FROM cliente_membresias
      WHERE fecha_fin BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
      AND estado = 'ACTIVO'
    `);

    const [[pagos]] = await pool.query(`
      SELECT COALESCE(SUM(monto), 0) total 
      FROM pagos 
      WHERE estado = 'PAGADO'
      AND MONTH(fecha_pago) = MONTH(CURDATE())
      AND YEAR(fecha_pago) = YEAR(CURDATE())
    `);

    const [[asistencias]] = await pool.query(`
      SELECT COUNT(*) total 
      FROM asistencias 
      WHERE fecha = CURDATE()
    `);

    const [[notificaciones]] = await pool.query(`
      SELECT COUNT(*) total 
      FROM notificaciones
      WHERE estado = 'NO_LEIDO'
    `);

    res.json({
      clientes: clientes.total,
      membresiasActivas: membresiasActivas.total,
      membresiasVencidas: membresiasVencidas.total,
      membresiasPorVencer: membresiasPorVencer.total,
      pagosMes: Number(pagos.total),
      asistenciasHoy: asistencias.total,
      notificacionesNoLeidas: notificaciones.total,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error en dashboard",
      error: error.message,
    });
  }
};

module.exports = { resumen };