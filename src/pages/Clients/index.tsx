import { useDynamicQuery } from '../../hooks'
import { DataGrid } from '@mui/x-data-grid'
import { Typography } from '@mui/material'
import type { User } from '../../types'
export const Clients = () => {

    const USERS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/users'

    const { data, isLoading, error } = useDynamicQuery<User[]>(USERS_ENDPOINT)

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        { field: 'phone', headerName: 'Phone', width: 130 },
        { field: 'email', headerName: 'Email', width: 130 },
        { field: 'address', headerName: 'Address', width: 130 },
        { field: 'createdAt', headerName: 'Created At', width: 130 },
    ]

    if (isLoading) return <Typography variant='h5'>Loading...</Typography>
    if (error) return <Typography variant='h5'>{error.message}</Typography>

    return (
        <>
            <Typography variant='h5'>Clients</Typography>
            <DataGrid rows={data} columns={columns} />
        </>
    )
}

export default Clients