import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '../components'
import { Dashboard, Clients, Products, Invoices, Tasker, Calendar, Revenue, ClientsChart, Orders, MostSold, PendingTasks } from '../pages'

const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<Navigate to='/main' replace />} />
                
                <Route path='main' element={<Dashboard />} />
                <Route path='clients' element={<Clients />} />
                <Route path='products' element={<Products />} />
                <Route path='invoices' element={<Invoices />} />
                <Route path='tasker' element={<Tasker/>} />
                <Route path='calendar' element={<Calendar />} />
                <Route path='/analytics/revenue' element={<Revenue />} />
                <Route path='/analytics/orders-per-month' element={<Orders />} />
                <Route path='/analytics/clients-per-month' element={<ClientsChart />} />
                <Route path='/analytics/most-sold' element={<MostSold />} />
                <Route path='/analytics/pending-tasks' element={<PendingTasks />} />
            </Route>
        </Routes>
    )
}

export default Router