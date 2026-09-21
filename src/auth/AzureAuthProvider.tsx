import type { ReactNode } from "react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { AuthContext } from "./AuthContext";
import { apiScope, getRoles, loginRequest } from "./msalConfig";

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
    getToken: async () => {
      if (!account) return null;
      try {
        return (await instance.acquireTokenSilent({ scopes: [apiScope], account })).accessToken;
      } catch (e) {
        if (!(e instanceof InteractionRequiredAuthError)) throw e;
        await instance.acquireTokenRedirect({ scopes: [apiScope], account }); // sesión vencida o sin consentimiento
        return null;
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
