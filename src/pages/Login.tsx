import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const isDev = (import.meta.env.VITE_AUTH_MODE ?? "dev") === "dev";
const USERS = ["admin", "operador", "cliente"];

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function handleLogin(user?: string) {
    setError(null);
    try {
      await login(user);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al iniciar sesión");
    }
  }

  return (
    <div className="grid h-screen place-items-center bg-slate-50">
      <div className="w-80 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Pedidos360</h1>
        <p className="mb-6 text-sm text-slate-500">Panel corporativo de gestión de pedidos</p>

        {isDev ? (
          <>
            <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Modo dev: token del emisor local. Elige un usuario.
            </p>
            <div className="flex flex-col gap-2">
              {USERS.map((user) => (
                <button
                  key={user}
                  onClick={() => handleLogin(user)}
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  Entrar como {user}
                </button>
              ))}
            </div>
          </>
        ) : (
          <button
            onClick={() => handleLogin()}
            className="w-full rounded-md bg-[#2f2f2f] px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
          >
            Iniciar sesión con Microsoft
          </button>
        )}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
