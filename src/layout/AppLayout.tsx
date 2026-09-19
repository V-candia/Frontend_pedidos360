import { NavLink, Outlet } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { getRoles } from "../auth/msalConfig";

export function AppLayout() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const roles = getRoles(account?.idTokenClaims as Record<string, unknown>);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 200, borderRight: "1px solid #ddd", padding: 16 }}>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/orders">Pedidos</NavLink>
          <NavLink to="/catalog">Catálogo</NavLink>
          <NavLink to="/reports">Reportería</NavLink>
          <NavLink to="/audit">Auditoría</NavLink>
        </nav>
      </aside>
      <div style={{ flex: 1 }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid #ddd",
          }}
        >
          <strong>Pedidos360</strong>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span>
              {account?.name ?? account?.username} ({roles.join(", ") || "sin rol"})
            </span>
            <button onClick={() => instance.logoutRedirect()}>Cerrar sesión</button>
          </div>
        </header>
        <main style={{ padding: 24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
