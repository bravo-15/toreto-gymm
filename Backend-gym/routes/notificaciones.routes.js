const express = require("express");
const router = express.Router();

const controller = require("../controllers/notificaciones.controller");

router.get("/", controller.listar);

router.post("/", controller.crear);

router.put("/:id", controller.actualizar);

router.delete("/:id", controller.eliminar);

router.post(
  "/generar-alertas-membresias",
  controller.generarAlertasMembresias
);

module.exports = router;