const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const clientesRoutes = require("./routes/clientes.routes");
const membresiasRoutes = require("./routes/membresias.routes");
const pagosRoutes = require("./routes/pagos.routes");
const asistenciasRoutes = require("./routes/asistencias.routes");
const rutinasRoutes = require("./routes/rutinas.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const notificacionesRoutes = require("./routes/notificaciones.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const clienteMembresiasRoutes = require("./routes/cliente_membresias.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "Backend TORETO GYM funcionando 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/membresias", membresiasRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/asistencias", asistenciasRoutes);
app.use("/api/rutinas", rutinasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/notificaciones", notificacionesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cliente-membresias", clienteMembresiasRoutes);

// 🔔 REVISAR MEMBRESÍAS AUTOMÁTICAMENTE
const revisarMembresiasAutomaticamente = async () => {
  try {
    const controller = require("./controllers/notificaciones.controller");

    await controller.generarAlertasMembresias(
      {},
      {
        json: () => {},
        status: () => ({
          json: () => {},
        }),
      }
    );

    console.log("✅ Revisión automática de membresías completada");
  } catch (error) {
    console.log("❌ Error en revisión automática:", error.message);
  }
};

// Cada 1 hora
setInterval(revisarMembresiasAutomaticamente, 1000 * 60 * 60);

// Al iniciar el servidor
revisarMembresiasAutomaticamente();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});