import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AdminLayout.css";
import api from "../../services/api";

const menu = [
  { path: "/admin/dashboard", icon: "🏠", label: "Dashboard", roles: ["ADMINISTRADOR", "RECEPCIONISTA", "ENTRENADOR"] },
  { path: "/admin/clientes", icon: "👥", label: "Clientes", roles: ["ADMINISTRADOR", "RECEPCIONISTA"] },
  { path: "/admin/membresias", icon: "💳", label: "Membresías", roles: ["ADMINISTRADOR"] },
  { path: "/admin/pagos", icon: "💰", label: "Pagos", roles: ["ADMINISTRADOR", "RECEPCIONISTA"] },
  { path: "/admin/asistencias", icon: "✅", label: "Asistencias", roles: ["ADMINISTRADOR", "RECEPCIONISTA"] },
  { path: "/admin/rutinas", icon: "🏋️", label: "Rutinas", roles: ["ADMINISTRADOR", "ENTRENADOR"] },
  { path: "/admin/usuarios", icon: "👤", label: "Usuarios", roles: ["ADMINISTRADOR"] },
  { path: "/admin/notificaciones", icon: "🔔", label: "Notificaciones", roles: ["ADMINISTRADOR", "RECEPCIONISTA"] },
  { path: "/admin/cliente-membresias", icon: "🪪", label: "Cliente Membresías", roles: ["ADMINISTRADOR", "RECEPCIONISTA"] },
  { path: "/admin/escaner-qr", icon: "📷", label: "Escáner QR", roles: ["ADMINISTRADOR", "RECEPCIONISTA"] },
  { path: "/admin/reportes", icon: "📊", label: "Reportes", roles: ["ADMINISTRADOR"] },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarNotis, setMostrarNotis] = useState(false);

  const usuario =
    JSON.parse(localStorage.getItem("toreto_admin")) || {
      nombre: "Administrador",
      rol: "ADMINISTRADOR",
    };

  const menuFiltrado = menu.filter((item) =>
    item.roles.includes(usuario.rol)
  );

  useEffect(() => {
    obtenerNotificaciones();

    const intervalo = setInterval(() => {
      obtenerNotificaciones();
    }, 10000);

    return () => clearInterval(intervalo);
  }, []);

  const obtenerNotificaciones = async () => {
    try {
      const res = await api.get("/notificaciones");
      setNotificaciones(res.data || []);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  const noLeidas = notificaciones.filter(
    (n) => n.estado === "NO_LEIDO"
  ).length;

  const ultimasNotificaciones = notificaciones.slice(0, 5);

  const logout = () => {
    localStorage.removeItem("toreto_admin");
    localStorage.removeItem("toreto_token");
    navigate("/login");
  };

  const irANotificaciones = () => {
    setMostrarNotis(false);
    navigate("/admin/notificaciones");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-content">
          <div className="admin-brand">
            <span className="brand-icon">⚡</span>

            <div>
              <h2>TORETO</h2>
              <p>Panel Gym</p>
            </div>
          </div>

          <nav className="admin-menu">
            {menuFiltrado.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "admin-link active" : "admin-link"
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p>Bienvenido</p>
            <h1>{usuario.nombre}</h1>
            <span className="admin-role">{usuario.rol}</span>
          </div>

          <div className="topbar-actions">
            <div className="noti-wrapper">
              <button
                className="noti-button"
                type="button"
                onClick={() => setMostrarNotis(!mostrarNotis)}
              >
                🔔
                {noLeidas > 0 && (
                  <span className="noti-badge">{noLeidas}</span>
                )}
              </button>

              {mostrarNotis && (
                <div className="noti-dropdown">
                  <div className="noti-dropdown-header">
                    <strong>Notificaciones</strong>
                    <span>{noLeidas} no leídas</span>
                  </div>

                  {ultimasNotificaciones.length > 0 ? (
                    ultimasNotificaciones.map((n) => (
                      <div
                        key={n.id}
                        className={`noti-item ${
                          n.estado === "NO_LEIDO" ? "unread" : ""
                        }`}
                      >
                        <strong>{n.titulo}</strong>
                        <p>{n.mensaje}</p>
                        <small>{n.created_at?.slice(0, 10)}</small>
                      </div>
                    ))
                  ) : (
                    <div className="noti-empty">
                      No hay notificaciones.
                    </div>
                  )}

                  <button
                    className="noti-see-all"
                    type="button"
                    onClick={irANotificaciones}
                  >
                    Ver todas
                  </button>
                </div>
              )}
            </div>

            <div className="admin-user">
              {usuario.nombre?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}