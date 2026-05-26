import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

  if (!usuarioLogueado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}