const express = require("express");
const router = express.Router();

const controller = require("../controllers/usuarios.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middlewares/auth.middleware");

router.get(
  "/",
  verificarToken,
  verificarRol("ADMINISTRADOR"),
  controller.listar
);

router.post(
  "/",
  verificarToken,
  verificarRol("ADMINISTRADOR"),
  controller.crear
);

router.put(
  "/:id",
  verificarToken,
  verificarRol("ADMINISTRADOR"),
  controller.actualizar
);

router.delete(
  "/:id",
  verificarToken,
  verificarRol("ADMINISTRADOR"),
  controller.eliminar
);

module.exports = router;