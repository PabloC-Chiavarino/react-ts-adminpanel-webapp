import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import Router from './routes'
import { CssBaseline } from '@mui/material'
import './App.css'

function App() {

  const queryClient = new QueryClient()

  return (
    <>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
}

export default App
