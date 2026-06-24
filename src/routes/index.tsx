import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '../components'
import { useAuth } from '../context/AuthContext'
import { Dashboard, Clients, Products, Invoices, Orders, Tasker, Calendar, Revenue, ClientsChart, InvoicesChart, MostSold, Login, UserProfile } from '../pages'
import NotFound from '../pages/NotFound'

const Router = () => {
    const { user } = useAuth()

    return (
        <Routes>
            <Route path='/login' element={user ? <Login /> : <Navigate to='/dashboard' replace />} />
            <Route path='/' element={!user ? <Layout /> : <Navigate to='/login' replace />}>
                <Route index element={<Navigate to='/dashboard' replace />} />
                <Route path='profile' element={<UserProfile />} />
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='clients' element={<Clients />} />
                <Route path='products' element={<Products />} />
                <Route path='invoices' element={<Invoices />} />
                <Route path='orders' element={<Orders />} />
                <Route path='tasker' element={<Tasker />} />
                <Route path='calendar' element={<Calendar />} />
                <Route path='/analytics/revenue' element={<Revenue />} />
                <Route path='/analytics/invoices-per-month' element={<InvoicesChart />} />
                <Route path='/analytics/clients-per-month' element={<ClientsChart />} />
                <Route path='/analytics/most-sold' element={<MostSold />} />
                <Route path='*' element={<NotFound />} />
            </Route>
        </Routes>
    )
}

export default Router