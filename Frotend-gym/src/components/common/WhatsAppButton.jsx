import "./WhatsAppButton.css";

export default function WhatsAppButton() {
  const phone = "51999000111";
  const message = encodeURIComponent("Hola TORETO GYM, quiero información sobre los planes.");

  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
      title="Escríbenos por WhatsApp"
    >
      <span className="whatsapp-float__icon">☘</span>
      <span className="whatsapp-float__text">WhatsApp</span>
    </a>
  );
}
