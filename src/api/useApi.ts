import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8090";

export function useApi() {
  const { getToken, logout } = useAuth();

  return useCallback(
    async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
      const token = await getToken();
      const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...init.headers,
        },
      });
      if (res.status === 401) {
        logout();
        throw new Error("Sesión expirada");
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? `Error ${res.status}`);
      }
      return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
    },
    [getToken, logout],
  );
}

export function useApiQuery<T>(path: string) {
  const api = useApi();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    api<T>(path)
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api, path]);

  useEffect(reload, [reload]);

  return { data, error, loading, reload };
}
