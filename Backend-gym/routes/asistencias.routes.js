const express = require("express");
const router = express.Router();

const controller = require("../controllers/asistencias.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middlewares/auth.middleware");

// VER ASISTENCIAS
router.get(
  "/",
  verificarToken,
  verificarRol("ADMINISTRADOR", "RECEPCIONISTA"),
  controller.listar
);

// REGISTRAR ASISTENCIA
router.post(
  "/",
  verificarToken,
  verificarRol("ADMINISTRADOR", "RECEPCIONISTA"),
  controller.crear
);

// ACTUALIZAR ASISTENCIA
router.put(
  "/:id",
  verificarToken,
  verificarRol("ADMINISTRADOR"),
  controller.actualizar
);

// ELIMINAR ASISTENCIA
router.delete(
  "/:id",
  verificarToken,
  verificarRol("ADMINISTRADOR"),
  controller.eliminar
);

module.exports = router;