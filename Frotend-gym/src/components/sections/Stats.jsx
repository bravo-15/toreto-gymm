import "./Stats.css";

const stats = [
  { number: "+500", label: "Clientes activos", detail: "Entrenan cada mes" },
  { number: "+20", label: "Máquinas modernas", detail: "Zona fuerza y cardio" },
  { number: "+10", label: "Entrenadores", detail: "Asesoría personalizada" },
  { number: "5★", label: "Experiencia premium", detail: "Ambiente motivador" },
];

export default function Stats() {
  return (
    <section className="stats-section" aria-label="Estadísticas de TORETO GYM">
      <div className="container">
        <div className="stats-section__grid">
          {stats.map((item, index) => (
            <article className="stats-section__card" key={item.label} style={{ "--delay": `${index * 0.12}s` }}>
              <span className="stats-section__number">{item.number}</span>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
