import type { OrderStatus } from "../api/types";

const COLORS: Record<OrderStatus, string> = {
  CREADO: "bg-slate-100 text-slate-700",
  ACEPTADO: "bg-blue-100 text-blue-700",
  EN_PREPARACION: "bg-amber-100 text-amber-700",
  DESPACHADO: "bg-indigo-100 text-indigo-700",
  ENTREGADO: "bg-emerald-100 text-emerald-700",
  CANCELADO: "bg-red-100 text-red-700",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${COLORS[status] ?? COLORS.CREADO}`}>
      {status.replace("_", " ")}
    </span>
  );
}
