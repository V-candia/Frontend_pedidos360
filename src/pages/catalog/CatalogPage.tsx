import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useApi, useApiQuery } from "../../api/useApi";
import type { Product } from "../../api/types";
import { QueryState } from "../../components/QueryState";

type ProductInput = Omit<Product, "id">;

export function CatalogPage() {
  const { account } = useAuth();
  const api = useApi();
  const isAdmin = account?.roles.includes("Admin") ?? false;
  const { data: products, error, loading, reload } = useApiQuery<Product[]>("/api/catalog/products");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function save(input: ProductInput, id?: string) {
    setActionError(null);
    try {
      await api(id ? `/api/catalog/products/${id}` : "/api/catalog/products", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(input),
      });
      setEditingId(null);
      setShowNew(false);
      reload();
    } catch (e) {
      setActionError((e as Error).message);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Catálogo</h1>
        {isAdmin && (
          <button
            onClick={() => setShowNew((v) => !v)}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            {showNew ? "Cancelar" : "Nuevo producto"}
          </button>
        )}
      </div>

      <QueryState loading={loading} error={error ?? actionError} />
      {showNew && <ProductForm onSubmit={(input) => save(input)} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((p) =>
          editingId === p.id ? (
            <ProductForm key={p.id} product={p} onSubmit={(input) => save(input, p.id)} onCancel={() => setEditingId(null)} />
          ) : (
            <div key={p.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-1 text-sm font-semibold text-slate-900">{p.name}</h2>
              <p className="mb-2 text-lg font-semibold text-slate-700">${p.price.toLocaleString("es-CL")}</p>
              <p className={`text-xs font-medium ${p.stock <= 5 ? "text-red-600" : "text-slate-500"}`}>
                Stock: {p.stock}
              </p>
              {isAdmin && (
                <button
                  onClick={() => setEditingId(p.id)}
                  className="mt-3 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Editar
                </button>
              )}
            </div>
          ),
        )}
      </div>
      {products?.length === 0 && <p className="text-sm text-slate-400">Sin productos.</p>}
    </div>
  );
}

function ProductForm({
  product,
  onSubmit,
  onCancel,
}: {
  product?: Product;
  onSubmit: (input: ProductInput) => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [stock, setStock] = useState(product?.stock ?? 0);
  const input = "rounded-md border border-slate-300 px-2 py-1 text-sm";

  return (
    <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-end gap-2">
        <label className="flex flex-col text-xs text-slate-500">
          Nombre
          <input value={name} onChange={(e) => setName(e.target.value)} className={input} />
        </label>
        <label className="flex flex-col text-xs text-slate-500">
          Precio
          <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} className={`w-28 ${input}`} />
        </label>
        <label className="flex flex-col text-xs text-slate-500">
          Stock
          <input type="number" min={0} value={stock} onChange={(e) => setStock(Number(e.target.value))} className={`w-24 ${input}`} />
        </label>
      </div>
      <div className="flex gap-2">
        <button
          disabled={!name}
          onClick={() => onSubmit({ name, price, stock })}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-40"
        >
          Guardar
        </button>
        {onCancel && (
          <button onClick={onCancel} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
