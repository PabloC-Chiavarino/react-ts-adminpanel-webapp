import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter } from 'react-router-dom'
import Router from './routes'
import { ColorModeProvider } from './context/ColorModeContext'
import { AuthProvider } from './context/AuthContext'

function App() {

  const queryClient = useMemo(() => new QueryClient(), [])

  return (
    <ColorModeProvider>
      <SnackbarProvider maxSnack={1}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </SnackbarProvider>
    </ColorModeProvider>
  )
}

export default App
