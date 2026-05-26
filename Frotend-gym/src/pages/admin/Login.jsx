import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    correo: "admin@toreto.com",
    password: "123456",
  });

  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("toreto_admin", JSON.stringify(res.data.usuario));
      localStorage.setItem("toreto_token", res.data.token);

      navigate("/admin/dashboard");
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-logo">⚡</div>

        <h1>TORETO GYM</h1>
        <p>Panel Administrativo</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={iniciarSesion}>
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={form.correo}
            onChange={manejarCambio}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={manejarCambio}
          />

          <button type="submit">Ingresar al sistema</button>

          <button
  type="button"
  className="login-back-btn"
  onClick={() => navigate("/")}
>
  Volver al inicio
</button>
        </form>
      </div>
    </section>
  );
}