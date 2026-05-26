import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <a href="#inicio" className="footer__logo">
                <span>⚡</span> TORETO <strong>GYM</strong>
              </a>
              <p className="footer__tagline">
                El lugar donde los límites se rompen. Entrena con los mejores, conviértete en el mejor.
              </p>
              <div className="footer__social">
                {["Instagram", "Facebook", "YouTube", "TikTok"].map(s => (
                  <a key={s} href="#" className="footer__social-link">{s[0]}</a>
                ))}
              </div>
            </div>

            <div className="footer__links">
              <h4 className="footer__links-title">Servicios</h4>
              <ul>
                {["Pesas & Fuerza", "CrossFit", "Cardio Zone", "Yoga & Pilates", "Artes Marciales", "Natación"].map(l => (
                  <li key={l}><a href="#servicios">{l}</a></li>
                ))}
              </ul>
            </div>

            <div className="footer__links">
              <h4 className="footer__links-title">Gimnasio</h4>
              <ul>
                {["Nosotros", "Planes", "Entrenadores", "Clases grupales", "Blog", "Trabaja con nosotros"].map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>

            <div className="footer__newsletter">
              <h4 className="footer__links-title">Newsletter</h4>
              <p>Tips de entrenamiento y nutrición directo a tu email.</p>
              <div className="footer__newsletter-form">
                <input type="email" placeholder="tu@email.com" />
                <button className="btn-primary footer__newsletter-btn">→</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© 2024 TORETO GYM Gym. Todos los derechos reservados.</p>
          <div className="footer__legal">
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
