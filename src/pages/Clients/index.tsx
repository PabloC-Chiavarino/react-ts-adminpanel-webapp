import { useDynamicQuery } from '../../hooks'
import { DataGrid } from '@mui/x-data-grid'
import { Typography } from '@mui/material'
import type { User } from '../../types'
export const Clients = () => {

    const USERS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/users'

    const { data, isLoading, error } = useDynamicQuery<User[]>(USERS_ENDPOINT)

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, flex: .5 },
        { field: 'name', headerName: 'First name', width: 130, flex: 1},
        { field: 'lastName', headerName: 'Last name', width: 130, flex: 1},
        { field: 'email', headerName: 'Email', width: 130, flex: 1},
        { field: 'address', headerName: 'Address', width: 130, flex: 1},
        { field: 'phone', headerName: 'Phone', width: 130, flex: .5},
        { field: 'createdAt', headerName: 'Created At', width: 130, flex: .5}
    ]

    if (isLoading) return <Typography variant='h5'>Loading...</Typography>
    if (error) return <Typography variant='h5'>{error.message}</Typography>

    return (
        <>
            <Typography variant='h4' sx={{
                mb: 8,
                width: '90%',
                textAlign: 'start'
            }}
            >
                Clients
            </Typography>
            <DataGrid 
                rows={data} 
                columns={columns}
                sx={{
                     width: '90%',
                     maxHeight: '80%',
                    }}
                    />
        </>
    )
}

export default Clients