import { useState } from "react";
import { useApiQuery } from "../../api/useApi";
import type { AuditEvent } from "../../api/types";
import { QueryState } from "../../components/QueryState";

export function AuditPage() {
  const [filters, setFilters] = useState({ userId: "", eventType: "", from: "", to: "" });
  const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString();
  const { data: events, error, loading } = useApiQuery<AuditEvent[]>(`/api/audit/events${qs && `?${qs}`}`);
  const input = "rounded-md border border-slate-300 px-2 py-1 text-sm";

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">Auditoría</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <input placeholder="Usuario" value={filters.userId} onChange={(e) => setFilters({ ...filters, userId: e.target.value })} className={input} />
        <input placeholder="Tipo de evento" value={filters.eventType} onChange={(e) => setFilters({ ...filters, eventType: e.target.value })} className={input} />
        <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} className={input} />
        <input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} className={input} />
      </div>

      <QueryState loading={loading} error={error} />

      <ol className="space-y-2">
        {events?.map((ev) => (
          <li key={ev.id} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
            <span className="font-medium text-slate-900">{ev.eventType}</span>{" "}
            <span className="text-slate-500">
              — {ev.actor} · pedido {ev.entityId} · {new Date(ev.timestamp).toLocaleString("es-CL")}
            </span>
          </li>
        ))}
        {events?.length === 0 && <li className="text-sm text-slate-400">Sin eventos.</li>}
      </ol>
    </div>
  );
}
