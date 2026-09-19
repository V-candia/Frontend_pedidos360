import type { ReactNode } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { AuthContext } from "./AuthContext";
import { getRoles, loginRequest } from "./msalConfig";

export function AzureAuthProvider({ children }: { children: ReactNode }) {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = accounts[0];

  const value = {
    isAuthenticated,
    account: account
      ? {
          name: account.name ?? account.username,
          roles: getRoles(account.idTokenClaims as Record<string, unknown>),
        }
      : null,
    login: () => instance.loginRedirect(loginRequest),
    logout: () => instance.logoutRedirect(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
