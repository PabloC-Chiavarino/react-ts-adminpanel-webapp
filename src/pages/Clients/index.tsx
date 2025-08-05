import { useState, useRef } from 'react'
import type { GridRenderCellParams } from '@mui/x-data-grid'
import type { User } from '../../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useDynamicQuery } from '../../hooks'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Modal, IconButton } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { AddBtn, UserForm, ConfirmDialog } from '../../components'

const Clients = () => {
    const [open, setOpen] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [clientData, setClientData] = useState<User | null>(null)

    let requestAction = useRef<(() => void) | null>(null)

    const USERS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/users'
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const { data, isLoading, error } = useDynamicQuery<User[]>(USERS_ENDPOINT)

    const emptyClient: User = {
        id: 0,
        name: '',
        email: '',
        lastName: '',
        phone: '',
        address: '',
        createdAt: ''
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
            setClientData(emptyClient);
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

    const handleOpen = () => setOpen(true)

    const handleClose = () => {
        setOpen(false)
        setClientData(emptyClient)
    }

    const handleOpenDialogPayload = (action: () => void) => {
        requestAction.current = action
        setOpenDialog(true)
    }

    const handleCloseDialog = () => setOpenDialog(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (!clientData) return

        const updated = { ...clientData, [name]: value }
        setClientData(updated)
    }

    const handleSubmit = async () => {
        if (!clientData) return
        try {
            await mutation.mutate(clientData)
            enqueueSnackbar('Created successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleUpdate = async () => {
        try {
            if (!clientData) return
            await updateMutation.mutate(clientData)
            enqueueSnackbar('Updated successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleDelete = () => {
        try {
            deleteMutation.mutate(clientData!.id)
            enqueueSnackbar('Deleted successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleAddClient = () => {
        setClientData(emptyClient)
        handleOpen()
    }

    const columns = [
        {
            field: 'id', headerName: 'ID', width: 100, flex: .5, renderCell: (params: GridRenderCellParams<User>) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>{params.row.id}</span>
                    <Box sx={{ display: clientData?.id === params.row.id ? 'block' : 'none' }}>
                        <IconButton onClick={() => handleOpen()}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDialogPayload(handleDelete)}>
                            <Delete />
                        </IconButton>
                    </Box>
                </Box>
            )
        },
        { field: 'name', headerName: 'First name', width: 130, flex: 1 },
        { field: 'lastName', headerName: 'Last name', width: 130, flex: 1 },
        { field: 'email', headerName: 'Email', width: 130, flex: 1 },
        { field: 'address', headerName: 'Address', width: 130, flex: 1 },
        { field: 'phone', headerName: 'Phone', width: 130, flex: .5 },
        { field: 'createdAt', headerName: 'Created At', width: 130, flex: .5 }
    ]

    if (isLoading) return <Typography variant='h5'>Loading...</Typography>
    if (!data) return <Typography variant='h5'>No users</Typography>
    if (error) return <Typography variant='h5'>{error.message}</Typography>

    return (
        <>
            <ConfirmDialog
                open={openDialog}
                onConfirm={() => {
                    requestAction!.current!()
                    handleCloseDialog()
                }}
                onCancel={handleCloseDialog} />
            <Modal open={open} onClose={handleClose} >
                <UserForm
                    handleInputChange={handleInputChange}
                    handleSubmit={(e) => {
                        e.preventDefault();
                        handleOpenDialogPayload(handleSubmit)
                    }}
                    formData={clientData ?? emptyClient}
                    handleUpdate={(e) => {
                        e.preventDefault();
                        handleOpenDialogPayload(handleUpdate)
                    }}
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
                <AddBtn onClick={handleAddClient} />
            </Box>
            <DataGrid
                rows={data}
                columns={columns}
                onRowClick={(params) => {
                    setClientData(params.row)
                }}
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