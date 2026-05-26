import "./StatCard.css";

export default function StatCard({ title, value, icon, detail }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
        <span>{detail}</span>
      </div>
    </article>
  );
}
