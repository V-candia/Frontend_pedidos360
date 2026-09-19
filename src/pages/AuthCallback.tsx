import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AuthCallback() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}
