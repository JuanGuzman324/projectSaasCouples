import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import './lib/i18n'
import './index.css'
import App from './App'
import { idbPersister, registerOfflineMutations } from './lib/offline'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      networkMode: 'offlineFirst',
    },
    mutations: {
      networkMode: 'online',
    },
  },
})

registerOfflineMutations(queryClient)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: idbPersister }}
      onSuccess={() => {
        queryClient.resumePausedMutations()
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistQueryClientProvider>
  </StrictMode>
)
