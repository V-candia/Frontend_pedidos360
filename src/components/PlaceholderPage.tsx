export function PlaceholderPage({ title, pending, empty }: { title: string; pending: string; empty: string }) {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mb-4 text-sm text-slate-500">{pending}</p>
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
        {empty}
      </div>
    </div>
  );
}
