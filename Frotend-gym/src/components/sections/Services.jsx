import { useState } from "react";
import "./Services.css";

const services = [
  {
    icon: "🏋️",
    title: "Pesas & Fuerza",
    desc: "Zona premium de pesas libres y máquinas de última generación para un entrenamiento de fuerza completo.",
    tags: ["Principiantes", "Avanzado"],
  },
  {
    icon: "🔥",
    title: "CrossFit",
    desc: "Entrenamientos funcionales de alta intensidad con caja de CrossFit certificada y coaches especializados.",
    tags: ["HIIT", "Funcional"],
  },
  {
    icon: "🏃",
    title: "Cardio Zone",
    desc: "60+ máquinas de cardio con pantallas integradas, seguimiento en tiempo real y conexión con tu app.",
    tags: ["Resistencia", "Quema grasa"],
  },
  {
    icon: "🧘",
    title: "Yoga & Pilates",
    desc: "Studios exclusivos para clases de yoga, pilates y meditación. Equilibrio para tu cuerpo y mente.",
    tags: ["Flexibilidad", "Bienestar"],
  },
  {
    icon: "🥊",
    title: "Artes Marciales",
    desc: "Boxing, MMA y kickboxing con entrenadores certificados. Técnica, potencia y disciplina.",
    tags: ["Boxing", "MMA"],
  },
  {
    icon: "🏊",
    title: "Natación",
    desc: "Piscina olímpica de 50m, clases para todos los niveles y entrenamiento de natación competitiva.",
    tags: ["Todos los niveles"],
  },
];

export default function Services() {
  const [active, setActive] = useState(null);

  return (
    <section className="services" id="servicios">
      <div className="container">
        <div className="services__header">
          <div>
            <p className="section-label">Lo que ofrecemos</p>
            <h2 className="section-title">
              NUESTROS<br /><span>SERVICIOS</span>
            </h2>
          </div>
          <p className="section-subtitle">
            Un ecosistema completo para tu entrenamiento. Desde fuerza hasta bienestar mental,
            lo tienes todo aquí.
          </p>
        </div>

        <div className="services__grid">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`service-card ${active === i ? "service-card--active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="service-card__index">{String(i + 1).padStart(2, "0")}</div>
              <div className="service-card__icon">{s.icon}</div>
              <h3 className="service-card__title">{s.title}</h3>
              <p className="service-card__desc">{s.desc}</p>
              <div className="service-card__tags">
                {s.tags.map(t => (
                  <span key={t} className="service-card__tag">{t}</span>
                ))}
              </div>
              <div className="service-card__arrow">→</div>
              <div className="service-card__glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
