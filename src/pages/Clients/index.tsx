import { useState } from 'react'
import type { GridRenderCellParams } from '@mui/x-data-grid'
import type { User } from '../../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDynamicQuery } from '../../hooks'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Modal, IconButton } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { AddBtn, UserForm } from '../../components'
export const Clients = () => {
    const [open, setOpen] = useState(false)
    const [selectedRow, setSelectedRow] = useState<User | null>(null)
    const [formData, setFormData] = useState<User>({
        id: 0,
        name: '',
        email: '',
        lastname: '',
        phone: '',
        address: '',
        createdAt: ''
    })

    const USERS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/users'

    const queryClient = useQueryClient()

    const { data, isLoading, error } = useDynamicQuery<User[]>(USERS_ENDPOINT)

    const columns = [
        {
            field: 'id', headerName: 'ID', width: 100, flex: .5, renderCell: (params: GridRenderCellParams<User>) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>{params.row.id}</span>
                    <Box sx={{ display: selectedRow?.id === params.row.id ? 'block' : 'none' }}>
                        <IconButton onClick={() => handleEdit()}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(params.row.id)}>
                            <Delete />
                        </IconButton>
                    </Box>
                </Box>
            )
        },
        { field: 'name', headerName: 'First name', width: 130, flex: 1 },
        { field: 'lastname', headerName: 'Last name', width: 130, flex: 1 },
        { field: 'email', headerName: 'Email', width: 130, flex: 1 },
        { field: 'address', headerName: 'Address', width: 130, flex: 1 },
        { field: 'phone', headerName: 'Phone', width: 130, flex: .5 },
        { field: 'createdAt', headerName: 'Created At', width: 130, flex: .5 }
    ]

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const updated = { ...formData, [name]: name === 'phone' ? Number(value) : value }

        setFormData(updated)

        // console.log(updated) // debug
    }

    const mutation = useMutation({
        mutationFn: async (product: User) => {
            const response = await fetch(USERS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            return response.json()

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USERS_ENDPOINT] })
            setFormData({
                id: 0,
                name: '',
                email: '',
                lastname: '',
                phone: '',
                address: '',
                createdAt: ''
            });
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const updateMutation = useMutation({
        mutationFn: async (product: User) => {
            const response = await fetch(`${USERS_ENDPOINT}/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            return response.json()

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USERS_ENDPOINT] })
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USERS_ENDPOINT] })
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutation.mutate(formData)
    }

    const handleEdit = () => {
        if (selectedRow) {
            setFormData(selectedRow)
            handleOpen()
        }
    }

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        updateMutation.mutate(formData)
    }

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id)
    }

    if (isLoading) return <Typography variant='h5'>Loading...</Typography>
    if (!data) return <Typography variant='h5'>No users</Typography>
    if (error) return <Typography variant='h5'>{error.message}</Typography>

    return (
        <>
            <Modal open={open} onClose={handleClose} >
                <UserForm
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    formData={formData}
                    handleUpdate={handleUpdate}
                />
            </Modal>
            <Box sx={{
                mb: 6,
                width: '90%',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h4'>
                    Clients
                </Typography>
                <AddBtn onClick={handleOpen} />
            </Box>
            <DataGrid
                rows={data}
                columns={columns}
                onRowClick={(params) => setSelectedRow(params.row)}
                sx={{
                    width: '90%',
                    maxHeight: '80%',
                    userSelect: 'none',
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-cell:focus-within': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-row.Mui-selected': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                    '& .MuiDataGrid-row.Mui-selected:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                }}
            />
        </>
    )
}

export default Clients