import { useApiQuery } from "../../api/useApi";
import type { Kpis } from "../../api/types";
import { QueryState } from "../../components/QueryState";

export function ReportsPage() {
  const { data, error, loading } = useApiQuery<Kpis>("/api/report/kpis");
  const max = Math.max(1, ...(data?.salesByHour.map((s) => s.total) ?? []));

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">Reportería</h1>
      <QueryState loading={loading} error={error} />
      {data && (
        <div className="grid gap-4 lg:grid-cols-3">
          <section className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Ventas por hora</h2>
            <div className="space-y-1.5">
              {data.salesByHour.map((s) => (
                <div key={s.hour} className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-14 shrink-0">{new Date(s.hour).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}</span>
                  <div className="h-4 rounded bg-slate-900" style={{ width: `${(s.total / max) * 100}%` }} />
                  <span>${s.total.toLocaleString("es-CL")}</span>
                </div>
              ))}
              {data.salesByHour.length === 0 && <p className="text-sm text-slate-400">Sin ventas.</p>}
            </div>
          </section>
          <div className="space-y-4">
            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="mb-1 text-sm font-semibold text-slate-900">Lead time promedio</h2>
              <p className="text-2xl font-semibold text-slate-700">{data.leadTimeAvgMinutes.toFixed(1)} min</p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="mb-2 text-sm font-semibold text-slate-900">Pedidos activos</h2>
              <ul className="text-sm text-slate-600">
                {Object.entries(data.activeOrdersByStatus).map(([status, n]) => (
                  <li key={status} className="flex justify-between">
                    <span>{status.replace("_", " ")}</span>
                    <span className="font-medium">{n}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
