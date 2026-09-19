import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthAccount } from "./AuthContext";
import { getRoles } from "./msalConfig";

const STORAGE_KEY = "pedidos360.devSession";
const TOKEN_URL = import.meta.env.VITE_DEV_TOKEN_URL ?? "http://localhost:8080/default/token";

type Session = { token: string; account: AuthAccount };

function decodeClaims(token: string): Record<string, unknown> {
  const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(payload));
}

// Emisor OAuth2 local (sin MSAL): client_credentials con el usuario como client_id.
export function DevAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  });

  async function login(user = "cliente") {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "client_credentials", client_id: user, client_secret: "dev" }),
    });
    if (!res.ok) throw new Error(`Token endpoint respondió ${res.status}`);
    const { access_token } = (await res.json()) as { access_token: string };
    const claims = decodeClaims(access_token);
    const next: Session = {
      token: access_token,
      account: { name: String(claims.name ?? claims.preferred_username ?? user), roles: getRoles(claims) },
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session,
        account: session?.account ?? null,
        login,
        logout,
        getToken: async () => session?.token ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
