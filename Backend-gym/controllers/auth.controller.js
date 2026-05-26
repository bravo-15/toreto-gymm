const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
    }

    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE correo = ? AND estado = "ACTIVO"',
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    const usuario = rows[0];

    let passwordValido = false;

    if (usuario.password.startsWith("$2a$") || usuario.password.startsWith("$2b$")) {
      passwordValido = await bcrypt.compare(password, usuario.password);
    } else {
      passwordValido = password === usuario.password;
    }

    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET || "toreto_gym_secret",
      { expiresIn: "8h" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error en login",
      error: error.message,
    });
  }
};

module.exports = { login };