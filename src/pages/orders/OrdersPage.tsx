import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useApi, useApiQuery } from "../../api/useApi";
import { STATUS_FLOW } from "../../api/types";
import type { Order, OrderStatus, Product } from "../../api/types";
import { OrderStatusBadge } from "../../components/OrderStatusBadge";
import { QueryState } from "../../components/QueryState";

const nextStatus = (s: OrderStatus) => STATUS_FLOW[STATUS_FLOW.indexOf(s as (typeof STATUS_FLOW)[number]) + 1];
const isTerminal = (s: OrderStatus) => s === "ENTREGADO" || s === "CANCELADO";

export function OrdersPage() {
  const { account } = useAuth();
  const api = useApi();
  const canManage = account?.roles.some((r) => r === "Operador" || r === "Admin") ?? false;
  const { data: orders, error, loading, reload } = useApiQuery<Order[]>("/api/orders");
  const [showForm, setShowForm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function changeStatus(id: string, status: OrderStatus) {
    setActionError(null);
    try {
      await api(`/api/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      reload();
    } catch (e) {
      setActionError((e as Error).message);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Pedidos</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          {showForm ? "Cancelar" : "Nuevo pedido"}
        </button>
      </div>

      {showForm && (
        <NewOrderForm
          defaultCustomer={account?.name ?? ""}
          onCreated={() => {
            setShowForm(false);
            reload();
          }}
        />
      )}

      <QueryState loading={loading} error={error ?? actionError} />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Cliente</th>
              <th className="px-4 py-2 font-medium">Items</th>
              <th className="px-4 py-2 font-medium">Total</th>
              <th className="px-4 py-2 font-medium">Estado</th>
              {canManage && <th className="px-4 py-2 font-medium">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Sin pedidos.
                </td>
              </tr>
            )}
            {orders?.map((o) => {
              const next = nextStatus(o.status);
              return (
                <tr key={o.id}>
                  <td className="px-4 py-3">{o.customerName}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {o.items.map((i) => `${i.qty}x ${i.productName}`).join(", ")}
                  </td>
                  <td className="px-4 py-3">
                    ${o.items.reduce((s, i) => s + i.qty * i.price, 0).toLocaleString("es-CL")}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  {canManage && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {next && !isTerminal(o.status) && (
                          <button
                            onClick={() => changeStatus(o.id, next)}
                            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                          >
                            Marcar {next.replace("_", " ")}
                          </button>
                        )}
                        {!isTerminal(o.status) && (
                          <button
                            onClick={() => changeStatus(o.id, "CANCELADO")}
                            className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewOrderForm({ defaultCustomer, onCreated }: { defaultCustomer: string; onCreated: () => void }) {
  const api = useApi();
  const { data: products, error, loading } = useApiQuery<Product[]>("/api/catalog/products");
  const [customerName, setCustomerName] = useState(defaultCustomer);
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState(1);
  const [items, setItems] = useState<{ productId: string; qty: number }[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selected = productId || products?.[0]?.id || "";
  const nameOf = (id: string) => products?.find((p) => p.id === id)?.name ?? id;

  async function submit() {
    setSubmitError(null);
    try {
      await api("/api/orders", { method: "POST", body: JSON.stringify({ customerName, items }) });
      onCreated();
    } catch (e) {
      setSubmitError((e as Error).message);
    }
  }

  return (
    <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
      <QueryState loading={loading} error={error ?? submitError} />
      {products?.length === 0 && (
        <p className="mb-3 text-sm text-slate-500">No hay productos. Un Admin debe crearlos en Catálogo.</p>
      )}
      <div className="mb-3 flex flex-wrap items-end gap-2">
        <label className="flex flex-col text-xs text-slate-500">
          Cliente
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col text-xs text-slate-500">
          Producto
          <select
            value={selected}
            onChange={(e) => setProductId(e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            {products?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (stock: {p.stock})
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-xs text-slate-500">
          Cantidad
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
        </label>
        <button
          disabled={!selected || qty < 1}
          onClick={() => setItems((prev) => [...prev, { productId: selected, qty }])}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        >
          Agregar
        </button>
      </div>

      {items.length > 0 && (
        <ul className="mb-3 text-sm text-slate-600">
          {items.map((i, idx) => (
            <li key={idx}>
              {i.qty}x {nameOf(i.productId)}
            </li>
          ))}
        </ul>
      )}

      <button
        disabled={items.length === 0 || !customerName}
        onClick={submit}
        className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-40"
      >
        Crear pedido
      </button>
    </div>
  );
}
