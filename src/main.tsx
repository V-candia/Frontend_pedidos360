import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication, EventType } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import './index.css'
import App from './App.tsx'
import { msalConfig } from './auth/msalConfig'

const msalInstance = new PublicClientApplication(msalConfig)

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const account = (event.payload as { account?: unknown }).account
    if (account) msalInstance.setActiveAccount(account as never)
  }
})

async function bootstrap() {
  await msalInstance.initialize()
  await msalInstance.handleRedirectPromise()

  const active = msalInstance.getActiveAccount()
  if (!active && msalInstance.getAllAccounts().length > 0) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0])
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </StrictMode>,
  )
}

bootstrap()
