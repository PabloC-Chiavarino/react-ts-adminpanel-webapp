import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter } from 'react-router-dom'
import Router from './routes'
import { ColorModeProvider } from './context/ColorModeContext'
import './App.css'

function App() {

  const queryClient = new QueryClient()

  return (
    <ColorModeProvider>
      <SnackbarProvider maxSnack={1}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </QueryClientProvider>
      </SnackbarProvider>
    </ColorModeProvider>
  )
}

export default App
