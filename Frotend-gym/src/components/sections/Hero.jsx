import { motion } from "framer-motion";
import "./Hero.css";
import heroGym from "../../assets/images/hero/hero-gym.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 45 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section
      className="hero hero--image"
      id="inicio"
      style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(0,0,0,0.90), rgba(0,0,0,0.68), rgba(0,0,0,0.90)),
          url(${heroGym})
        `,
      }}
    >
      <div className="hero__bg">
        <div className="hero__grid"></div>
        <div className="hero__gradient"></div>
        <div className="hero__noise"></div>
      </div>

      <motion.div
        className="hero__stat hero__stat--left"
        initial={{ opacity: 0, x: -35 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
      >
        <span className="hero__stat-number">12+</span>
        <span className="hero__stat-label">Años de experiencia</span>
      </motion.div>

      <motion.div
        className="hero__stat hero__stat--right"
        initial={{ opacity: 0, x: 35 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
      >
        <span className="hero__stat-number">98%</span>
        <span className="hero__stat-label">Clientes satisfechos</span>
      </motion.div>

      <div className="hero__content">
        <motion.div
          className="hero__copy"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="hero__eyebrow">
            <span className="hero__dot"></span>
            <span>El gimnasio que te transforma</span>
          </div>

          <h1 className="hero__title">
            FORJA TU<br />
            <span className="hero__title-accent">MEJOR</span><br />
            VERSIÓN
          </h1>

          <p className="hero__desc">
            Equipo de última generación. Entrenadores certificados.
            <br />
            Sin excusas. Solo resultados.
          </p>

          <div className="hero__actions">
            <a href="#planes" className="btn-primary hero__btn">
              Empezar Ahora
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a href="#servicios" className="btn-outline hero__btn">
              Ver Servicios
            </a>
          </div>

          <div className="hero__members">
            <div className="hero__avatars">
              {[
                ["M", "red"],
                ["A", "orange"],
                ["C", "steel"],
                ["J", "gold"],
              ].map(([letter, tone]) => (
                <div key={letter} className={`hero__avatar hero__avatar--${tone}`}>
                  {letter}
                </div>
              ))}
            </div>

            <p>
              <strong>+2,400</strong> miembros activos este mes
            </p>
          </div>
        </motion.div>

        <motion.div
          className="hero__visual"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.94, x: 35 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.35, ease: "easeOut" }}
        >
          <div className="hero__visual-card">
            <div className="hero__visual-top">
              <span>TORETO MODE</span>
              <strong>ON</strong>
            </div>

            <div className="hero__visual-body">
              <span className="hero__visual-icon">🏋️</span>
              <div className="hero__visual-bars">
                {[72, 92, 58, 84, 68].map((height, index) => (
                  <span key={index} style={{ height: `${height}%` }}></span>
                ))}
              </div>
            </div>

            <div className="hero__visual-bottom">
              <span>Plan recomendado</span>
              <strong>Elite</strong>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hero__watermark">TORETO</div>

      <div className="hero__scroll">
        <div className="hero__scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>
  );
}
