const express = require("express");
const router = express.Router();

const controller = require("../controllers/pagos.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middlewares/auth.middleware");

// VER PAGOS
router.get(
  "/",
  verificarToken,
  verificarRol("ADMINISTRADOR", "RECEPCIONISTA"),
  controller.listar
);

// CREAR PAGO
router.post(
  "/",
  verificarToken,
  verificarRol("ADMINISTRADOR", "RECEPCIONISTA"),
  controller.crear
);

// ACTUALIZAR PAGO
router.put(
  "/:id",
  verificarToken,
  verificarRol("ADMINISTRADOR"),
  controller.actualizar
);

// ELIMINAR PAGO
router.delete(
  "/:id",
  verificarToken,
  verificarRol("ADMINISTRADOR"),
  controller.eliminar
);

module.exports = router;