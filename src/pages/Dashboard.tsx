import { useMsal } from "@azure/msal-react";
import { getRoles } from "../auth/msalConfig";

export function Dashboard() {
  const { accounts } = useMsal();
  const roles = getRoles(accounts[0]?.idTokenClaims as Record<string, unknown>);

  return (
    <div>
      <h1>Dashboard</h1>
      {roles.includes("Admin") && <p>KPIs globales: pedidos, ventas, usuarios activos.</p>}
      {roles.includes("Operador") && <p>Pedidos en curso y pendientes.</p>}
      {roles.includes("Cliente") && <p>Tus últimos pedidos y su estado actual.</p>}
      {roles.length === 0 && <p>Sin rol asignado en el token.</p>}
    </div>
  );
}
