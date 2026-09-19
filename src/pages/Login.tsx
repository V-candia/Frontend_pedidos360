import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/msalConfig";

export function Login() {
  const { instance } = useMsal();

  return (
    <div style={{ display: "grid", height: "100vh", placeItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Pedidos360</h1>
        <button onClick={() => instance.loginRedirect(loginRequest)}>
          Iniciar sesión con Microsoft
        </button>
      </div>
    </div>
  );
}
