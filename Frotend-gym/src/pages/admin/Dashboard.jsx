import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import "./AdminPage.css";
import api from "../../services/api";

export default function Dashboard() {
  const [resumen, setResumen] = useState({
    clientes: 0,
    membresiasActivas: 0,
    membresiasVencidas: 0,
    membresiasPorVencer: 0,
    pagosMes: 0,
    asistenciasHoy: 0,
    notificacionesNoLeidas: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerResumen();

    const intervalo = setInterval(() => {
      obtenerResumen();
    }, 15000);

    return () => clearInterval(intervalo);
  }, []);

  const obtenerResumen = async () => {
    try {
      const res = await api.get("/dashboard/resumen");

      setResumen({
        clientes: res.data.clientes || 0,
        membresiasActivas: res.data.membresiasActivas || 0,
        membresiasVencidas: res.data.membresiasVencidas || 0,
        membresiasPorVencer: res.data.membresiasPorVencer || 0,
        pagosMes: res.data.pagosMes || 0,
        asistenciasHoy: res.data.asistenciasHoy || 0,
        notificacionesNoLeidas: res.data.notificacionesNoLeidas || 0,
      });
    } catch (error) {
      console.error("Error dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const membresiasData = [
    { name: "Activas", value: resumen.membresiasActivas },
    { name: "Vencidas", value: resumen.membresiasVencidas },
    { name: "Por vencer", value: resumen.membresiasPorVencer },
  ];

  const barrasData = [
    { name: "Clientes", total: resumen.clientes },
    { name: "Asistencias hoy", total: resumen.asistenciasHoy },
    { name: "Alertas", total: resumen.notificacionesNoLeidas },
    { name: "Vencidas", total: resumen.membresiasVencidas },
  ];

  const ingresosData = [
    { mes: "Ene", ingresos: 0 },
    { mes: "Feb", ingresos: 0 },
    { mes: "Mar", ingresos: 0 },
    { mes: "Abr", ingresos: 0 },
    { mes: "May", ingresos: resumen.pagosMes },
  ];

  const totalMembresias =
    resumen.membresiasActivas +
    resumen.membresiasVencidas +
    resumen.membresiasPorVencer;

  if (loading) {
    return (
      <div className="admin-page">
        <div className="dashboard-loading">
          <div className="loader-circle"></div>
          <h2>Cargando dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page dashboard-premium">
      <div className="dashboard-hero">
        <div>
          <span className="dashboard-label">Panel administrativo</span>
          <h1>Dashboard TORETO GYM</h1>
          <p>
            Control general de clientes, membresías, pagos, asistencias y
            notificaciones del sistema.
          </p>
        </div>

        <div className="dashboard-income">
          <span>Ingresos del mes</span>
          <strong>S/ {Number(resumen.pagosMes).toFixed(2)}</strong>
          <small>Actualización automática cada 15 segundos</small>
        </div>
      </div>

      <div className="dashboard-alerts">
        {resumen.membresiasVencidas > 0 && (
          <div className="dashboard-alert danger">
            ⚠️ Hay {resumen.membresiasVencidas} membresías vencidas.
          </div>
        )}

        {resumen.membresiasPorVencer > 0 && (
          <div className="dashboard-alert warning">
            ⏳ Hay {resumen.membresiasPorVencer} membresías próximas a vencer.
          </div>
        )}

        {resumen.notificacionesNoLeidas > 0 && (
          <div className="dashboard-alert info">
            🔔 Tienes {resumen.notificacionesNoLeidas} notificaciones pendientes.
          </div>
        )}
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card premium-card">
          <span>Clientes</span>
          <h2>{resumen.clientes}</h2>
          <p>Total de clientes registrados</p>
        </div>

        <div className="dashboard-card premium-card success-card">
          <span>Membresías activas</span>
          <h2>{resumen.membresiasActivas}</h2>
          <p>Clientes con membresía vigente</p>
        </div>

        <div className="dashboard-card premium-card danger-card">
          <span>Membresías vencidas</span>
          <h2>{resumen.membresiasVencidas}</h2>
          <p>Clientes con membresía vencida</p>
        </div>

        <div className="dashboard-card premium-card warning-card">
          <span>Por vencer</span>
          <h2>{resumen.membresiasPorVencer}</h2>
          <p>Membresías que vencen en 3 días</p>
        </div>

        <div className="dashboard-card premium-card">
          <span>Asistencias hoy</span>
          <h2>{resumen.asistenciasHoy}</h2>
          <p>Ingresos registrados hoy</p>
        </div>

        <div className="dashboard-card premium-card info-card">
          <span>Notificaciones</span>
          <h2>{resumen.notificacionesNoLeidas}</h2>
          <p>Alertas pendientes por revisar</p>
        </div>
      </div>

      <div className="dashboard-kpis">
        <div className="kpi-card">
          <span>Estado general</span>
          <strong>
            {resumen.membresiasVencidas > 0 ? "Requiere atención" : "Estable"}
          </strong>
          <p>
            {resumen.membresiasVencidas > 0
              ? "Existen membresías vencidas que deben revisarse."
              : "No se detectaron alertas críticas."}
          </p>
        </div>

        <div className="kpi-card">
          <span>Total membresías asignadas</span>
          <strong>{totalMembresias}</strong>
          <p>Incluye activas, vencidas y próximas a vencer.</p>
        </div>

        <div className="kpi-card">
          <span>Control de accesos</span>
          <strong>{resumen.asistenciasHoy}</strong>
          <p>Ingresos registrados durante el día actual.</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card premium-chart">
          <h3>Estado de membresías</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={membresiasData}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                innerRadius={45}
                label
              >
                <Cell fill="#ffd400" />
                <Cell fill="#ff4d4d" />
                <Cell fill="#ff9f1c" />
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card premium-chart">
          <h3>Resumen operativo</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barrasData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#ffd400" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card premium-chart chart-wide">
          <h3>Ingresos mensuales</h3>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={ingresosData}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffd400" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffd400" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="ingresos"
                stroke="#ffd400"
                fillOpacity={1}
                fill="url(#colorIngresos)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}