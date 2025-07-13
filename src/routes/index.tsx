import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '../components'
import { Dashboard, Clients, Products } from '../pages'

const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<Navigate to='/main' replace />} />
                
                <Route path='main' element={<Dashboard />} />
                <Route path='clients' element={<Clients />} />
                <Route path='products' element={<Products />} />
            </Route>
        </Routes>
    )
}

export default Router