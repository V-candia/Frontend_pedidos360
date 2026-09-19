import type { ReactNode } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Navigate } from "react-router-dom";
import { getRoles } from "./msalConfig";
import type { Role } from "./msalConfig";

export function RoleGuard({
  allow,
  children,
}: {
  allow: Role[];
  children: ReactNode;
}) {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const roles = getRoles(accounts[0]?.idTokenClaims as Record<string, unknown>);
  const authorized = roles.some((r) => allow.includes(r));

  if (!authorized) {
    return (
      <div style={{ padding: 32 }}>
        <h2>Sin acceso</h2>
        <p>Tu rol ({roles.join(", ") || "sin rol asignado"}) no tiene permiso para ver esta sección.</p>
      </div>
    );
  }

  return <>{children}</>;
}
