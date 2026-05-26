import "./About.css";

const stats = [
  { number: "2,400+", label: "Miembros activos" },
  { number: "35+", label: "Entrenadores certificados" },
  { number: "6AM", label: "Apertura diaria" },
  { number: "3,000m²", label: "Área total" },
];

export default function About() {
  return (
    <section className="about" id="nosotros">
      <div className="container">
        <div className="about__inner">
          <div className="about__visual">
            <div className="about__image-wrap">
              <div className="about__image-placeholder">
                <div className="about__image-content">
                  <span className="about__year">EST. 2012</span>
                  <div className="about__image-bars">
                    {[80,60,90,70,85,65,95].map((h,i) => (
                      <div key={i} className="about__bar" style={{height: `${h}%`}}></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="about__badge">
                <svg className="about__badge-ring" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(232,22,27,0.3)" strokeWidth="1"/>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="var(--red)" strokeWidth="1.5"
                    strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round"
                    transform="rotate(-90 50 50)"/>
                </svg>
                <div className="about__badge-text">
                  <span className="about__badge-num">#1</span>
                  <span className="about__badge-label">Gym</span>
                </div>
              </div>
            </div>
          </div>

          <div className="about__text">
            <p className="section-label">Quiénes somos</p>
            <h2 className="section-title">
              MÁS QUE UN<br />
              <span>GIMNASIO</span>
            </h2>
            <p className="section-subtitle">
              Desde 2012, TORETO GYM ha sido el lugar donde las personas rompen sus límites.
              No somos solo un espacio con máquinas — somos una comunidad que te impulsa,
              una metodología que funciona, y un ambiente diseñado para tu máximo rendimiento.
            </p>
            <p className="about__desc2">
              Nuestras instalaciones de <strong>3,000m²</strong> incluyen zonas de pesas libres,
              cardio avanzado, crossfit, sauna, piscina y más de 60 clases grupales semanales.
              Todo lo que necesitas, bajo un mismo techo.
            </p>

            <a href="#servicios" className="btn-primary about__btn">
              Explorar Servicios
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="about__stats">
          {stats.map(({ number, label }) => (
            <div key={label} className="about__stat">
              <span className="about__stat-num">{number}</span>
              <span className="about__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
