const pool = require('../config/database');

const crearCrudController = ({ tabla, id = 'id', campos = [] }) => ({
  listar: async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${tabla} ORDER BY ${id} DESC`);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al listar', error: error.message });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${tabla} WHERE ${id} = ?`, [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ mensaje: 'Registro no encontrado' });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener', error: error.message });
    }
  },

  crear: async (req, res) => {
    try {
      const valores = campos.map((campo) => req.body[campo]);
      const placeholders = campos.map(() => '?').join(', ');
      const sql = `INSERT INTO ${tabla} (${campos.join(', ')}) VALUES (${placeholders})`;
      const [result] = await pool.query(sql, valores);
      res.status(201).json({ mensaje: 'Registro creado', id: result.insertId });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear', error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const set = campos.map((campo) => `${campo} = ?`).join(', ');
      const valores = campos.map((campo) => req.body[campo]);
      valores.push(req.params.id);
      const sql = `UPDATE ${tabla} SET ${set} WHERE ${id} = ?`;
      const [result] = await pool.query(sql, valores);
      if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Registro no encontrado' });
      res.json({ mensaje: 'Registro actualizado' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar', error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const [result] = await pool.query(`DELETE FROM ${tabla} WHERE ${id} = ?`, [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Registro no encontrado' });
      res.json({ mensaje: 'Registro eliminado' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar', error: error.message });
    }
  }
});

module.exports = crearCrudController;
