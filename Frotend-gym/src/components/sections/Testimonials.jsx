import { useState } from "react";
import "./Testimonials.css";

const testimonials = [
  {
    name: "Andrés Flores",
    result: "-18kg en 5 meses",
    text: "Llegué sin saber nada de entrenamiento. Mi coach Carlos me diseñó un plan a medida y los resultados me cambiaron la vida. El equipo es increíble y el ambiente te motiva a dar más cada día.",
    initials: "AF",
    color: "#c0392b",
    plan: "Plan Pro",
  },
  {
    name: "Lucía Cárdenas",
    result: "+8kg masa muscular",
    text: "Llevo 2 años en TORETO GYM y no me cambiaría a ningún otro lado. Las clases de CrossFit con Valeria son adictivas. Las instalaciones están siempre impecables y el ambiente es muy positivo.",
    initials: "LC",
    color: "#27ae60",
    plan: "Plan Elite",
  },
  {
    name: "Roberto Salas",
    result: "Primera competencia de boxing",
    text: "Gracias a Miguel pude participar en mi primera competencia de boxing amateur. La preparación fue total: técnica, físico y mental. No imaginé que a mis 38 años podría lograr algo así.",
    initials: "RS",
    color: "#2980b9",
    plan: "Plan Elite",
  },
  {
    name: "Camila Vega",
    result: "Corrió su primer medio maratón",
    text: "Vine buscando perder peso y terminé enamorándome del running. Con la zona de cardio y el apoyo del equipo, completé mi primer medio maratón en menos de un año. Imposible sin TORETO GYM.",
    initials: "CV",
    color: "#8e44ad",
    plan: "Plan Pro",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials__inner">
          <div className="testimonials__left">
            <p className="section-label">Resultados reales</p>
            <h2 className="section-title">
              LO QUE<br />DICEN<br /><span>NUESTROS</span><br />MIEMBROS
            </h2>
            <div className="testimonials__nav">
              <button className="testimonials__nav-btn" onClick={prev}>←</button>
              <span className="testimonials__counter">
                {String(current + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
              </span>
              <button className="testimonials__nav-btn" onClick={next}>→</button>
            </div>
          </div>

          <div className="testimonials__right">
            <div className="testimonial-card" key={current}>
              <div className="testimonial-card__quote">"</div>
              <p className="testimonial-card__text">{t.text}</p>

              <div className="testimonial-card__result">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7l5-5 5 5" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t.result}
              </div>

              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" style={{ background: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__plan">{t.plan}</p>
                </div>
              </div>
            </div>

            <div className="testimonials__dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`testimonials__dot ${i === current ? "testimonials__dot--active" : ""}`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
