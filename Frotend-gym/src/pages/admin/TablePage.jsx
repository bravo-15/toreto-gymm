import "./AdminPage.css";

export default function TablePage({ title, description, columns, data, getBadgeClass }) {
  return (
    <section className="admin-section">
      <div className="section-title">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <button className="primary-btn">+ Nuevo registro</button>
      </div>

      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => <th key={col.key}>{col.label}</th>)}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.key === "estado" ? (
                      <span className={`badge ${getBadgeClass ? getBadgeClass(row[col.key]) : ""}`}>{row[col.key]}</span>
                    ) : row[col.key]}
                  </td>
                ))}
                <td className="muted">Editar · Eliminar</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
