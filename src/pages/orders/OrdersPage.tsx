const STATUSES = ["CREADO", "ACEPTADO", "EN_PREPARACIÓN", "DESPACHADO", "ENTREGADO", "CANCELADO"];

export function OrdersPage() {
  return (
    <div>
      <h1>Pedidos</h1>
      <p>Pendiente de conectar con ms-pedidos360-orders vía API Gateway.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {STATUSES.map((s) => (
          <span key={s} style={{ border: "1px solid #ccc", borderRadius: 4, padding: "4px 8px" }}>
            {s}
          </span>
        ))}
      </div>
      <table style={{ marginTop: 16, width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>ID</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Cliente</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} style={{ padding: 16, color: "#888" }}>
              Sin datos — backend no disponible.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
