const STATUSES = ["CREADO", "ACEPTADO", "EN_PREPARACIÓN", "DESPACHADO", "ENTREGADO", "CANCELADO"];

export function OrdersPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Pedidos</h1>
      <p className="mb-4 text-sm text-slate-500">
        Pendiente de conectar con ms-pedidos360-orders vía API Gateway.
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <span
            key={s}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600"
          >
            {s}
          </span>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">ID</th>
              <th className="px-4 py-2 font-medium">Cliente</th>
              <th className="px-4 py-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                Sin datos — backend no disponible.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
