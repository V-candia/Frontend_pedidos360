import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";

export function AuthCallback() {
  const isAuthenticated = useIsAuthenticated();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}
