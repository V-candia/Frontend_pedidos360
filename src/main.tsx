import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const authMode = import.meta.env.VITE_AUTH_MODE ?? 'mock'

async function bootstrap() {
  const root = createRoot(document.getElementById('root')!)

  if (authMode === 'azure') {
    const { PublicClientApplication, EventType } = await import('@azure/msal-browser')
    const { MsalProvider } = await import('@azure/msal-react')
    const { msalConfig } = await import('./auth/msalConfig')
    const { AzureAuthProvider } = await import('./auth/AzureAuthProvider')

    const msalInstance = new PublicClientApplication(msalConfig)

    msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const account = (event.payload as { account?: unknown }).account
        if (account) msalInstance.setActiveAccount(account as never)
      }
    })

    await msalInstance.initialize()
    await msalInstance.handleRedirectPromise()

    const active = msalInstance.getActiveAccount()
    if (!active && msalInstance.getAllAccounts().length > 0) {
      msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0])
    }

    root.render(
      <StrictMode>
        <MsalProvider instance={msalInstance}>
          <AzureAuthProvider>
            <App />
          </AzureAuthProvider>
        </MsalProvider>
      </StrictMode>,
    )
  } else {
    const { MockAuthProvider } = await import('./auth/MockAuthProvider')

    root.render(
      <StrictMode>
        <MockAuthProvider>
          <App />
        </MockAuthProvider>
      </StrictMode>,
    )
  }
}

bootstrap()
