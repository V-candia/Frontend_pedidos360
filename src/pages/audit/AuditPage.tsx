import { PlaceholderPage } from "../../components/PlaceholderPage";

export function AuditPage() {
  return (
    <PlaceholderPage
      title="Auditoría"
      pending="Pendiente de conectar con ms-pedidos360-audit (eventos Kafka) vía API Gateway."
      empty="Sin eventos — backend no disponible."
    />
  );
}
