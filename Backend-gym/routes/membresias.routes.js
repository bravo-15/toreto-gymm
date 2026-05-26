const express = require("express");
const router = express.Router();

const controller = require("../controllers/membresias.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middlewares/auth.middleware");

// VER MEMBRESÍAS
router.get(
  "/",
  verificarToken,
  verificarRol("ADMINISTRADOR", "RECEPCIONISTA"),
  controller.listar
);

// CREAR MEMBRESÍA
router.post(
  "/",
  verificarToken,
  verificarRol("ADMINISTRADOR"),
  controller.crear
);

// ACTUALIZAR MEMBRESÍA
router.put(
  "/:id",
  verificarToken,
  verificarRol("ADMINISTRADOR"),
  controller.actualizar
);

// ELIMINAR MEMBRESÍA
router.delete(
  "/:id",
  verificarToken,
  verificarRol("ADMINISTRADOR"),
  controller.eliminar
);

module.exports = router;