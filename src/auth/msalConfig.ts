import type { Configuration } from "@azure/msal-browser";

const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI ?? "http://localhost:5173/auth/callback";

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}/`,
    redirectUri,
    postLogoutRedirectUri: "/login",
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "User.Read"],
};

export const apiScope = import.meta.env.VITE_API_SCOPE ?? "";

export type Role = "Admin" | "Operador" | "Cliente";

const ROLE_BY_LOWER: Record<string, Role> = {
  admin: "Admin",
  operador: "Operador",
  cliente: "Cliente",
};

export function getRoles(claims: Record<string, unknown> | undefined): Role[] {
  const raw = claims?.roles;
  const list = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : [];
  return list.flatMap((r) => ROLE_BY_LOWER[String(r).toLowerCase()] ?? []);
}
