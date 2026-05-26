const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const listar = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, correo, rol, estado, created_at FROM usuarios ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar usuarios', error: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, correo, rol, estado, created_at FROM usuarios WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
  }
};

const crear = async (req, res) => {
  try {
    const { nombre, correo, password, rol, estado } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, password, rol, estado) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, passwordHash, rol || 'RECEPCIONISTA', estado || 'ACTIVO']
    );
    res.status(201).json({ mensaje: 'Usuario creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear usuario', error: error.message });
  }
};

const actualizar = async (req, res) => {
  try {
    const { nombre, correo, password, rol, estado } = req.body;
    let sql = 'UPDATE usuarios SET nombre=?, correo=?, rol=?, estado=?';
    let values = [nombre, correo, rol, estado];

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      sql += ', password=?';
      values.push(passwordHash);
    }

    sql += ' WHERE id=?';
    values.push(req.params.id);

    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
};

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
