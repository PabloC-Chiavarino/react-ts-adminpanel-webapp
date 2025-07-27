import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter } from 'react-router-dom'
import Router from './routes'
import { CssBaseline } from '@mui/material'
import './App.css'

function App() {

  const queryClient = new QueryClient()

  return (
    <>
      <CssBaseline />
      <SnackbarProvider maxSnack={1}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </QueryClientProvider>
      </SnackbarProvider>
    </>
  )
}

export default App
