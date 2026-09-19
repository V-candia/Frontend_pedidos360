export function QueryState({ loading, error }: { loading: boolean; error: string | null }) {
  if (error) return <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
  if (loading) return <p className="mb-3 text-sm text-slate-400">Cargando…</p>;
  return null;
}
