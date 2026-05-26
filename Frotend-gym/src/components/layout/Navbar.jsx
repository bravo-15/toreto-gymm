import { useState } from "react";
import "./Navbar.css";

const links = [
  "Inicio",
  "Nosotros",
  "Servicios",
  "Planes",
  "Entrenadores",
  "Galería",
  "Contacto",
];

const crearId = (texto) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function Navbar({ scrolled }) {
  const [open, setOpen] = useState(false);

  const cerrarMenu = () => {
    setOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <a href="#inicio" className="navbar__logo" onClick={cerrarMenu}>
          <span className="navbar__logo-icon">⚡</span>
          <span>
            TORETO <strong>GYM</strong>
          </span>
        </a>

        <div
          className={`navbar__mobile-bg ${
            open ? "navbar__mobile-bg--show" : ""
          }`}
          onClick={cerrarMenu}
        ></div>

        <div className={`navbar__panel ${open ? "navbar__panel--open" : ""}`}>
          <ul className="navbar__links">
            {links.map((link) => (
              <li key={link}>
                <a
                  href={`#${crearId(link)}`}
                  className="navbar__link"
                  onClick={cerrarMenu}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          <div className="navbar__actions">
            <a href="/login" className="navbar__login" onClick={cerrarMenu}>
              Admin
            </a>

            <a
              href="#planes"
              className="btn-primary navbar__cta"
              onClick={cerrarMenu}
            >
              Únete Ahora
            </a>
          </div>
        </div>

        <button
          className={`navbar__burger ${open ? "navbar__burger--open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}