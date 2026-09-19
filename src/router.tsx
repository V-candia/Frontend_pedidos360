import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { RoleGuard } from "./auth/RoleGuard";
import { Login } from "./pages/Login";
import { AuthCallback } from "./pages/AuthCallback";
import { Dashboard } from "./pages/Dashboard";
import { OrdersPage } from "./pages/orders/OrdersPage";
import { CatalogPage } from "./pages/catalog/CatalogPage";
import { ReportsPage } from "./pages/reports/ReportsPage";
import { AuditPage } from "./pages/audit/AuditPage";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/auth/callback", element: <AuthCallback /> },
  {
    path: "/",
    element: (
      <RoleGuard allow={["Admin", "Operador", "Cliente"]}>
        <AppLayout />
      </RoleGuard>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "orders",
        element: (
          <RoleGuard allow={["Admin", "Operador", "Cliente"]}>
            <OrdersPage />
          </RoleGuard>
        ),
      },
      {
        path: "catalog",
        element: (
          <RoleGuard allow={["Admin", "Operador"]}>
            <CatalogPage />
          </RoleGuard>
        ),
      },
      {
        path: "reports",
        element: (
          <RoleGuard allow={["Admin"]}>
            <ReportsPage />
          </RoleGuard>
        ),
      },
      {
        path: "audit",
        element: (
          <RoleGuard allow={["Admin"]}>
            <AuditPage />
          </RoleGuard>
        ),
      },
      { index: true, element: <Dashboard /> },
    ],
  },
]);
