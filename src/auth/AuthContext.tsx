import { createContext, useContext } from "react";
import type { Role } from "./msalConfig";

export type AuthAccount = { name: string; roles: Role[] };

export type AuthContextValue = {
  isAuthenticated: boolean;
  account: AuthAccount | null;
  login: (user?: string) => void | Promise<void>;
  logout: () => void;
  getToken: () => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
}
