import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/public/Home";
import Login from "./pages/admin/Login";

import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import Dashboard from "./pages/admin/Dashboard";
import Clientes from "./pages/admin/Clientes";
import Membresias from "./pages/admin/Membresias";
import Pagos from "./pages/admin/Pagos";
import Asistencias from "./pages/admin/Asistencias";
import Rutinas from "./pages/admin/Rutinas";
import Usuarios from "./pages/admin/Usuarios";
import Notificaciones from "./pages/admin/Notificaciones";
import ClienteMembresias from "./pages/admin/ClienteMembresias";
import EscanerQR from "./pages/admin/EscanerQR";
import Reportes from "./pages/admin/Reportes";

import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute roles={["ADMINISTRADOR", "RECEPCIONISTA", "ENTRENADOR"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="clientes"
            element={
              <ProtectedRoute roles={["ADMINISTRADOR", "RECEPCIONISTA"]}>
                <Clientes />
              </ProtectedRoute>
            }
          />

          <Route
            path="membresias"
            element={
              <ProtectedRoute roles={["ADMINISTRADOR"]}>
                <Membresias />
              </ProtectedRoute>
            }
          />

          <Route
            path="pagos"
            element={
              <ProtectedRoute roles={["ADMINISTRADOR", "RECEPCIONISTA"]}>
                <Pagos />
              </ProtectedRoute>
            }
          />

          <Route
            path="asistencias"
            element={
              <ProtectedRoute roles={["ADMINISTRADOR", "RECEPCIONISTA"]}>
                <Asistencias />
              </ProtectedRoute>
            }
          />

          <Route
            path="rutinas"
            element={
              <ProtectedRoute roles={["ADMINISTRADOR", "ENTRENADOR"]}>
                <Rutinas />
              </ProtectedRoute>
            }
          />

          <Route
            path="usuarios"
            element={
              <ProtectedRoute roles={["ADMINISTRADOR"]}>
                <Usuarios />
              </ProtectedRoute>
            }
          />

          <Route
            path="notificaciones"
            element={
              <ProtectedRoute roles={["ADMINISTRADOR", "RECEPCIONISTA"]}>
                <Notificaciones />
              </ProtectedRoute>
            }
          />

          <Route
            path="cliente-membresias"
            element={
              <ProtectedRoute roles={["ADMINISTRADOR", "RECEPCIONISTA"]}>
                <ClienteMembresias />
              </ProtectedRoute>
            }
          />

          <Route
            path="escaner-qr"
            element={
              <ProtectedRoute roles={["ADMINISTRADOR", "RECEPCIONISTA"]}>
                <EscanerQR />
              </ProtectedRoute>
            }
          />

          <Route
            path="reportes"
            element={
              <ProtectedRoute roles={["ADMINISTRADOR"]}>
                <Reportes />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
      />
    </BrowserRouter>
  );
}