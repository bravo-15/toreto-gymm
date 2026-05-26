import { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", plan: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", plan: "", message: "" });
  };

  return (
    <section className="contact" id="contacto">
      <div className="container">
        <div className="contact__inner">
          <div className="contact__info">
            <p className="section-label">Contáctanos</p>
            <h2 className="section-title">
              DA EL<br /><span>PRIMER PASO</span>
            </h2>
            <p className="section-subtitle">
              Escríbenos y un asesor te contactará en menos de 2 horas. Sin compromisos, sin letras chicas.
            </p>

            <div className="contact__details">
              {[
                { icon: "📍", label: "Dirección", value: "Av. Principal 1240, Pucallpa, Perú" },
                { icon: "📞", label: "Teléfono", value: "+51 999 000 111" },
                { icon: "✉️", label: "Email", value: "contacto@toretogym.pe" },
                { icon: "🕐", label: "Horario", value: "Lun–Vie 6am–11pm · Sáb–Dom 7am–9pm" },
              ].map(d => (
                <div key={d.label} className="contact__detail">
                  <span className="contact__detail-icon">{d.icon}</span>
                  <div>
                    <p className="contact__detail-label">{d.label}</p>
                    <p className="contact__detail-value">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact__form-wrap">
            {sent ? (
              <div className="contact__success">
                <div className="contact__success-icon">✓</div>
                <h3>¡Mensaje enviado!</h3>
                <p>Te contactaremos muy pronto.</p>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="contact__row">
                  <div className="contact__field">
                    <label>Nombre completo</label>
                    <input
                      type="text" name="name" required
                      placeholder="Tu nombre"
                      value={form.name} onChange={handleChange}
                    />
                  </div>
                  <div className="contact__field">
                    <label>Email</label>
                    <input
                      type="email" name="email" required
                      placeholder="tu@email.com"
                      value={form.email} onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="contact__field">
                  <label>Plan de interés</label>
                  <select name="plan" value={form.plan} onChange={handleChange}>
                    <option value="">Selecciona un plan</option>
                    <option value="basico">Plan Básico — S/. 29/mes</option>
                    <option value="pro">Plan Pro — S/. 59/mes</option>
                    <option value="elite">Plan Elite — S/. 99/mes</option>
                  </select>
                </div>
                <div className="contact__field">
                  <label>Mensaje (opcional)</label>
                  <textarea
                    name="message" rows={4}
                    placeholder="Cuéntanos tus objetivos..."
                    value={form.message} onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn-primary contact__submit">
                  Enviar Mensaje
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
