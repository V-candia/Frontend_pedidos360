import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { Role } from "./msalConfig";

export function RoleGuard({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { isAuthenticated, account } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const roles = account?.roles ?? [];
  const authorized = roles.some((r) => allow.includes(r));

  if (!authorized) {
    return (
      <div className="p-8">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">Sin acceso</h2>
        <p className="text-sm text-slate-500">
          Tu rol ({roles.join(", ") || "sin rol asignado"}) no tiene permiso para ver esta sección.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
