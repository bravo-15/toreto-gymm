const express = require("express");
const router = express.Router();

const controller = require("../controllers/clientes.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middlewares/auth.middleware");

// VER CLIENTES
router.get(
  "/",
  verificarToken,
  verificarRol("ADMINISTRADOR", "RECEPCIONISTA"),
  controller.listar
);

// CREAR CLIENTE
router.post(
  "/",
  verificarToken,
  verificarRol("ADMINISTRADOR", "RECEPCIONISTA"),
  controller.crear
);

// ACTUALIZAR CLIENTE
router.put(
  "/:id",
  verificarToken,
  verificarRol("ADMINISTRADOR", "RECEPCIONISTA"),
  controller.actualizar
);

// ELIMINAR CLIENTE
router.delete(
  "/:id",
  verificarToken,
  verificarRol("ADMINISTRADOR"),
  controller.eliminar
);

module.exports = router;