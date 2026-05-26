import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  children,
  roles = [],
}) {
  const token = localStorage.getItem("toreto_token");

  const usuario =
    JSON.parse(localStorage.getItem("toreto_admin")) || {};

  const location = useLocation();

  // SIN LOGIN
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // SIN ROL
  if (roles.length > 0) {
    const tienePermiso = roles.includes(usuario.rol);

    if (!tienePermiso) {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
          state={{
            from: location,
          }}
        />
      );
    }
  }

  return children;
}