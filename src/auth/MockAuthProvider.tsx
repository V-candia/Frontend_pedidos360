import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthAccount } from "./AuthContext";
import type { Role } from "./msalConfig";

const STORAGE_KEY = "pedidos360.mockAccount";

const MOCK_USERS: Record<Role, AuthAccount> = {
  Admin: { name: "Admin Demo", roles: ["Admin"] },
  Operador: { name: "Operador Demo", roles: ["Operador"] },
  Cliente: { name: "Cliente Demo", roles: ["Cliente"] },
};

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AuthAccount | null>(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthAccount) : null;
  });

  function login(role: Role = "Cliente") {
    const next = MOCK_USERS[role];
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAccount(next);
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAccount(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!account, account, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
