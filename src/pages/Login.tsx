import { useAuth } from "../auth/AuthContext";
import type { Role } from "../auth/msalConfig";

const isMock = (import.meta.env.VITE_AUTH_MODE ?? "mock") === "mock";
const ROLES: Role[] = ["Admin", "Operador", "Cliente"];

export function Login() {
  const { login } = useAuth();

  return (
    <div className="grid h-screen place-items-center bg-slate-50">
      <div className="w-80 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Pedidos360</h1>
        <p className="mb-6 text-sm text-slate-500">Panel corporativo de gestión de pedidos</p>

        {isMock ? (
          <>
            <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              Modo mock: sin tenant de Azure AD configurado. Elige un rol para simular el login.
            </p>
            <div className="flex flex-col gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => login(role)}
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  Entrar como {role}
                </button>
              ))}
            </div>
          </>
        ) : (
          <button
            onClick={() => login()}
            className="w-full rounded-md bg-[#2f2f2f] px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
          >
            Iniciar sesión con Microsoft
          </button>
        )}
      </div>
    </div>
  );
}
