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

export type Role = "Admin" | "Operador" | "Cliente";

export function getRoles(idTokenClaims: Record<string, unknown> | undefined): Role[] {
  const roles = idTokenClaims?.roles;
  return Array.isArray(roles) ? (roles as Role[]) : [];
}
