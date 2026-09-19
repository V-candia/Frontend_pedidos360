export const STATUS_FLOW = ["CREADO", "ACEPTADO", "EN_PREPARACION", "DESPACHADO", "ENTREGADO"] as const;
export type OrderStatus = (typeof STATUS_FLOW)[number] | "CANCELADO";

export type OrderItem = { productId: string; productName: string; qty: number; price: number };
export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};
export type Product = { id: string; name: string; price: number; stock: number };
export type AuditEvent = {
  id: string;
  entityId: string;
  eventType: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};
export type Kpis = {
  salesByHour: { hour: string; total: number }[];
  leadTimeAvgMinutes: number;
  activeOrdersByStatus: Record<string, number>;
};
