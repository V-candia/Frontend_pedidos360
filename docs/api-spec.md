# API Spec — contrato frontend ↔ backend Pedidos360

Este documento define lo que el frontend espera de cada microservicio, para que el
backend (detrás de AWS API Gateway) implemente exactamente estos endpoints y
contratos. Todas las rutas van precedidas por la base del API Gateway (ej.
`https://<api-id>.execute-api.<region>.amazonaws.com`).

## Auth (todas las rutas salvo las marcadas "público")

- Header: `Authorization: Bearer <access_token>` (JWT emitido por Azure AD, adjuntado por MSAL en el frontend).
- El backend valida `issuer` (`https://login.microsoftonline.com/<TENANT_ID>/v2.0`) y `audience` (`api://<API_CLIENT_ID>`).
- El rol viene en el claim `roles` del token: `Admin` | `Operador` | `Cliente`.
- Respuesta si el rol no tiene permiso sobre el endpoint: `403 Forbidden`.
- Respuesta si el token es inválido/expiró: `401 Unauthorized`.

## Formato de error estándar

```json
{
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "descripción legible",
  "timestamp": "2026-09-18T10:00:00Z"
}
```

---

## ms-pedidos360-orders — `/api/orders/*`

### `GET /api/orders`
- Roles: `Admin`, `Operador`, `Cliente`.
- `Cliente` solo recibe sus propios pedidos (filtrar server-side por el `sub`/email del token, no confiar en un customerId que mande el cliente).
- Query params opcionales: `status`, `from`, `to`.
- Respuesta `200`:
```json
[
  {
    "id": "uuid",
    "customerId": "uuid-o-email-del-token",
    "customerName": "string",
    "items": [{ "productId": "uuid", "productName": "string", "qty": 2, "price": 4990 }],
    "status": "CREADO",
    "createdAt": "iso-datetime",
    "updatedAt": "iso-datetime"
  }
]
```

### `GET /api/orders/{id}`
- Roles: `Admin`, `Operador`, `Cliente` (dueño del pedido).
- `404` si no existe o si un `Cliente` intenta ver un pedido que no es suyo (no `403`, para no filtrar existencia).

### `POST /api/orders`
- Roles: `Cliente`, `Operador`.
- Body:
```json
{ "customerName": "string", "items": [{ "productId": "uuid", "qty": 2 }] }
```
- Reglas: valida stock disponible en `ms-pedidos360-catalog` antes de crear (o rechaza en el paso de aceptación, a definir). Estado inicial siempre `CREADO`.
- Publica evento `OrderCreated` en Kafka (`orders.events`).
- Respuesta `201` con el pedido creado.

### `PATCH /api/orders/{id}/status`
- Roles: `Operador`, `Admin`.
- Body: `{ "status": "ACEPTADO" }`
- **Regla de negocio (server-side, no confiar en el frontend):** solo se permite avanzar al siguiente estado del flujo:
  `CREADO → ACEPTADO → EN_PREPARACION → DESPACHADO → ENTREGADO`, o pasar a `CANCELADO` desde cualquier estado no terminal. Saltar pasos (ej. `CREADO → DESPACHADO`) devuelve `409 Conflict`.
- Al pasar a `ACEPTADO`: decrementa stock en `ms-pedidos360-catalog` (llamada síncrona o evento, a decidir) y encola notificación (`q.cmd.email` / RabbitMQ) con el nuevo estado.
- Cada cambio de estado publica evento en Kafka (`OrderAccepted`, `OrderPreparing`, `OrderDispatched`, `OrderDelivered`, `OrderCancelled`) en `orders.events`.
- Respuesta `200` con el pedido actualizado. `409` si la transición no es válida.

---

## ms-pedidos360-catalog — `/api/catalog/*`

### `GET /api/catalog/products`
- Roles: `Admin`, `Operador`, `Cliente` (lectura necesaria para que el cliente pueda armar un pedido).
- Respuesta `200`:
```json
[{ "id": "uuid", "name": "string", "price": 4990, "stock": 25 }]
```

### `POST /api/catalog/products`
- Roles: `Admin`.
- Body: `{ "name": "string", "price": 4990, "stock": 25 }` → `201`.

### `PUT /api/catalog/products/{id}`
- Roles: `Admin`.
- Body igual a `POST` → `200`.

### `PATCH /api/catalog/products/{id}/stock` (uso interno desde orders-service)
- Roles: `Admin`, o llamada de servicio a servicio (no expuesta al frontend).
- Body: `{ "delta": -2 }` → decrementa/incrementa stock, `409` si quedaría negativo.

---

## ms-pedidos360-notify (sin exposición pública)

- No tiene rutas HTTP para el frontend. Consume `q.cmd.email` (RabbitMQ) publicado por orders-service en cada cambio de estado y envía email/push. El frontend no interactúa con este servicio directamente.

---

## ms-pedidos360-audit — `/api/audit/*` (solo lectura)

### `GET /api/audit/events`
- Roles: `Admin` (el caso menciona un rol "Auditor" que no está en la lista de roles de la app; si se agrega, incluirlo aquí).
- Query params: `userId`, `from`, `to`, `eventType`.
- Respuesta `200`:
```json
[
  {
    "id": "uuid",
    "entityId": "uuid-del-pedido",
    "eventType": "OrderAccepted",
    "actor": "email-o-nombre",
    "timestamp": "iso-datetime",
    "metadata": { "from": "CREADO", "to": "ACEPTADO" }
  }
]
```
- Datos alimentados por el consumer de Kafka (`audit.timeline`), no por escritura directa.

---

## ms-pedidos360-report — `/api/report/*` (solo lectura)

### `GET /api/report/kpis`
- Roles: `Admin`.
- Respuesta `200`:
```json
{
  "salesByHour": [{ "hour": "2026-09-18T10:00:00Z", "total": 125000 }],
  "leadTimeAvgMinutes": 34.5,
  "activeOrdersByStatus": { "CREADO": 3, "ACEPTADO": 5, "EN_PREPARACION": 2 }
}
```
- `leadTime` = tiempo entre `OrderCreated` y `OrderDelivered` (ambos vía Kafka `orders.events`), agregado por el consumer, no calculado en el frontend.

---

## Pendiente al definir el backend

- Decidir si `POST /api/orders/{id}/status` valida stock de forma síncrona (llamada REST a catalog) o asíncrona (evento + compensación si falla). Afecta si el frontend debe manejar un estado "pendiente de confirmación".
- Confirmar si `Cliente` necesita lectura de catálogo vía `/api/catalog/products` o si eso debe exponerse por un BFF agregador distinto.
- Añadir rol `Auditor` en Azure AD App Roles si se implementa el módulo de Auditoría con ese actor separado de `Admin`.
