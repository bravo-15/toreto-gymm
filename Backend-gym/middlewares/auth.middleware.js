const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // TOKEN NO ENVIADO
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "Acceso denegado. Token no enviado.",
      });
    }

    const token = authHeader.split(" ")[1];

    // VALIDAR TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "toreto_gym_secret"
    );

    req.usuario = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o expirado.",
    });
  }
};

// VALIDAR ROLES
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          mensaje: "Usuario no autenticado.",
        });
      }

      const rolUsuario = req.usuario.rol;

      if (!rolesPermitidos.includes(rolUsuario)) {
        return res.status(403).json({
          mensaje: "No tienes permisos para acceder.",
        });
      }

      next();

    } catch (error) {
      return res.status(500).json({
        mensaje: "Error al validar permisos.",
      });
    }
  };
};

module.exports = {
  verificarToken,
  verificarRol,
};