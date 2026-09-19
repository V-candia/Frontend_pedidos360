import { useAuth } from "../auth/AuthContext";

export function Dashboard() {
  const { account } = useAuth();
  const roles = account?.roles ?? [];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.includes("Admin") && (
          <Card title="KPIs globales" body="Pedidos, ventas y usuarios activos." />
        )}
        {roles.includes("Operador") && (
          <Card title="Pedidos en curso" body="Pendientes y en preparación." />
        )}
        {roles.includes("Cliente") && (
          <Card title="Tus pedidos" body="Últimos pedidos y su estado actual." />
        )}
        {roles.length === 0 && (
          <Card title="Sin rol" body="No hay un rol asignado en el token." />
        )}
      </div>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-sm font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{body}</p>
    </div>
  );
}
