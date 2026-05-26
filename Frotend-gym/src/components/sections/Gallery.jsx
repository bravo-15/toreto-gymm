import "./Gallery.css";

const gallery = [
  { title: "Zona de pesas", tag: "Fuerza", icon: "🏋️" },
  { title: "Cardio intenso", tag: "Resistencia", icon: "🔥" },
  { title: "Clases grupales", tag: "Energía", icon: "⚡" },
  { title: "Entrenamiento personalizado", tag: "Resultados", icon: "💪" },
  { title: "Área funcional", tag: "Performance", icon: "🥊" },
  { title: "Ambiente premium", tag: "Comunidad", icon: "👑" },
];

export default function Gallery() {
  return (
    <section className="gallery" id="galeria">
      <div className="container">
        <div className="gallery__header">
          <div>
            <p className="section-label">Galería</p>
            <h2 className="section-title">VIVE LA<br /><span>EXPERIENCIA</span></h2>
          </div>
          <p className="section-subtitle">
            Espacios modernos, entrenamiento fuerte y una comunidad que te empuja a mejorar cada día.
          </p>
        </div>

        <div className="gallery__grid">
          {gallery.map((item, index) => (
            <article className={`gallery__item gallery__item--${index + 1}`} key={item.title}>
              <div className="gallery__glow"></div>
              <span className="gallery__icon">{item.icon}</span>
              <div className="gallery__caption">
                <span>{item.tag}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
