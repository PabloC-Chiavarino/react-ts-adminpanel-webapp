import { BrowserRouter } from 'react-router-dom'
import Router from './routes'
import { CssBaseline } from '@mui/material'
import './App.css'

function App() {

  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  )
}

export default App
