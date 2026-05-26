import "./Trainers.css";

const trainers = [
  {
    name: "Carlos Mendoza",
    role: "Head Coach — Fuerza & Potencia",
    exp: "12 años",
    spec: ["Powerlifting", "Hipertrofia", "Olimpismo"],
    initials: "CM",
    color: "#c0392b",
  },
  {
    name: "Valeria Torres",
    role: "Coach — CrossFit & HIIT",
    exp: "8 años",
    spec: ["CrossFit L2", "Kettlebell", "Nutrición"],
    initials: "VT",
    color: "#e67e22",
  },
  {
    name: "Miguel Ríos",
    role: "Coach — Artes Marciales",
    exp: "15 años",
    spec: ["MMA", "Boxing", "Muay Thai"],
    initials: "MR",
    color: "#2c3e50",
  },
  {
    name: "Sofía Paredes",
    role: "Instructora — Yoga & Pilates",
    exp: "9 años",
    spec: ["Hatha Yoga", "Pilates Reformer", "Meditación"],
    initials: "SP",
    color: "#8e44ad",
  },
];

export default function Trainers() {
  return (
    <section className="trainers" id="entrenadores">
      <div className="container">
        <div className="trainers__header">
          <div>
            <p className="section-label">Nuestro equipo</p>
            <h2 className="section-title">
              LOS MEJORES<br /><span>ENTRENADORES</span>
            </h2>
          </div>
          <p className="section-subtitle">
            Certificados internacionalmente. Apasionados por tu progreso. Ellos son los que harán que des todo.
          </p>
        </div>

        <div className="trainers__grid">
          {trainers.map((t) => (
            <div key={t.name} className="trainer-card">
              <div className="trainer-card__avatar" style={{ background: t.color }}>
                {t.initials}
                <div className="trainer-card__avatar-ring"></div>
              </div>

              <div className="trainer-card__info">
                <h3 className="trainer-card__name">{t.name}</h3>
                <p className="trainer-card__role">{t.role}</p>

                <div className="trainer-card__exp">
                  <span className="trainer-card__exp-num">{t.exp}</span>
                  <span className="trainer-card__exp-label">experiencia</span>
                </div>

                <div className="trainer-card__specs">
                  {t.spec.map(s => (
                    <span key={s} className="trainer-card__spec">{s}</span>
                  ))}
                </div>
              </div>

              <div className="trainer-card__action">
                <a href="#contacto" className="trainer-card__btn">
                  Reservar sesión →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
