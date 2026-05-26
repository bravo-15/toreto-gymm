import { useState } from "react";
import "./Plans.css";

const plans = [
  {
    name: "Básico",
    price: { monthly: 29, annual: 23 },
    desc: "Perfecto para empezar tu camino fitness",
    features: [
      "Acceso zona de pesas",
      "Zona de cardio",
      "Vestuarios y duchas",
      "App TORETO GYM",
      "2 clases grupales/semana",
    ],
    disabled: ["Entrenador personal", "Acceso 24/7", "Nutrición", "Sauna & Spa"],
    color: "basic",
  },
  {
    name: "Pro",
    price: { monthly: 59, annual: 47 },
    desc: "El favorito de nuestros miembros",
    features: [
      "Todo lo del plan Básico",
      "Clases grupales ilimitadas",
      "2 sesiones/mes entrenador",
      "Acceso 24/7",
      "Sauna & Spa",
      "Plan nutricional básico",
    ],
    disabled: ["Entrenador personal dedicado"],
    featured: true,
    color: "pro",
  },
  {
    name: "Elite",
    price: { monthly: 99, annual: 79 },
    desc: "La experiencia TORETO GYM completa",
    features: [
      "Todo lo del plan Pro",
      "Entrenador personal dedicado",
      "Plan nutricional premium",
      "Acceso zona VIP",
      "Análisis corporal mensual",
      "Prioridad en clases",
      "Invitado gratis 1x/mes",
    ],
    disabled: [],
    color: "elite",
  },
];

export default function Plans() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="plans" id="planes">
      <div className="plans__bg"></div>
      <div className="container">
        <div className="plans__header">
          <p className="section-label">Inversión</p>
          <h2 className="section-title">
            ELIGE TU<br /><span>PLAN</span>
          </h2>

          <div className="plans__toggle">
            <span className={!annual ? "active" : ""}>Mensual</span>
            <button
              className={`plans__toggle-btn ${annual ? "plans__toggle-btn--on" : ""}`}
              onClick={() => setAnnual(!annual)}
            >
              <span className="plans__toggle-thumb"></span>
            </button>
            <span className={annual ? "active" : ""}>
              Anual
              <em className="plans__save">Ahorra 20%</em>
            </span>
          </div>
        </div>

        <div className="plans__grid">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`plan-card plan-card--${plan.color} ${plan.featured ? "plan-card--featured" : ""}`}
            >
              {plan.featured && (
                <div className="plan-card__badge">Más popular</div>
              )}

              <div className="plan-card__header">
                <h3 className="plan-card__name">{plan.name}</h3>
                <p className="plan-card__desc">{plan.desc}</p>
              </div>

              <div className="plan-card__price">
                <span className="plan-card__currency">S/.</span>
                <span className="plan-card__amount">
                  {annual ? plan.price.annual : plan.price.monthly}
                </span>
                <span className="plan-card__period">/mes</span>
              </div>

              <a href="#contacto" className={`plan-card__btn ${plan.featured ? "btn-primary" : "btn-outline"}`}>
                {plan.featured ? "Empezar Ahora" : "Elegir Plan"}
              </a>

              <div className="plan-card__features">
                {plan.features.map(f => (
                  <div key={f} className="plan-card__feature plan-card__feature--yes">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-6" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{f}</span>
                  </div>
                ))}
                {plan.disabled.map(f => (
                  <div key={f} className="plan-card__feature plan-card__feature--no">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 3l8 8M11 3l-8 8" stroke="rgba(136,136,128,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="plans__note">
          Todos los planes incluyen acceso a la app, sin contrato de permanencia, cancela cuando quieras.
        </p>
      </div>
    </section>
  );
}
