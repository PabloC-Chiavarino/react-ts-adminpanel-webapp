import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import type { GridRenderCellParams } from '@mui/x-data-grid'
import type { User } from '../../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useDynamicQuery } from '../../hooks'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Modal, IconButton, CircularProgress, useTheme, useMediaQuery } from '@mui/material'
import { DeleteOutlined, EditOutlined } from '@mui/icons-material'
import { AddBtn, UserForm, ConfirmDialog } from '../../components'
import { API_BASE_URL } from '../../config'

const Clients = () => {
    const [open, setOpen] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [clientData, setClientData] = useState<User | null>(null)
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
    const isXs = useMediaQuery(theme.breakpoints.down('sm'))

    let requestAction = useRef<(() => void) | null>(null)

    const USERS_ENDPOINT = `${API_BASE_URL}/users`
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const { data, isLoading, error } = useDynamicQuery<User[]>(['users'], USERS_ENDPOINT)
    const location = useLocation()
    const foundUser = location.state?.foundUser as User | null

    const emptyClient: User = {
        id: 0,
        name: '',
        email: '',
        lastName: '',
        phone: '',
        address: '',
        createdAt: ''
    }

    useEffect(() => {
        if (foundUser) {
            setClientData(foundUser)
        }
    }, [foundUser])

    const mutation = useMutation({
        mutationFn: async (user: User) => {
            const response = await fetch(USERS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            return response.json()

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setClientData(emptyClient);
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const updateMutation = useMutation({
        mutationFn: async (user: User) => {
            const response = await fetch(`${USERS_ENDPOINT}/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            return response.json()

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
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
            queryClient.invalidateQueries({ queryKey: ['users'] })
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
            await mutation.mutateAsync(clientData)
            handleClose()
            enqueueSnackbar('Created successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleUpdate = async () => {
        try {
            if (!clientData) return
            await updateMutation.mutateAsync(clientData)
            handleClose()
            enqueueSnackbar('Updated successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(clientData!.id)
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
        { field: 'id', headerName: 'ID', width: 70, flex: .1 },
        { field: 'name', headerName: 'First name', width: 130, flex: .15 },
        { field: 'lastName', headerName: 'Last name', width: 130, flex: .15, hide: isXs },
        { field: 'email', headerName: 'Email', width: 130, flex: .2 },
        { field: 'address', headerName: 'Address', width: 130, flex: .15, hide: isMdDown },
        { field: 'phone', headerName: 'Phone', width: 130, flex: .15, hide: isMdDown },
        {
            field: 'createdAt', headerName: 'Created At', width: 130, flex: .2, renderCell: (params: GridRenderCellParams<User>) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{params.row.createdAt}</span>
                    <Box sx={{ display: clientData?.id === params.row.id ? 'flex' : 'none', alignItems: 'center' }}>
                        <IconButton onClick={() => handleOpen()} sx={{ '&:hover .MuiSvgIcon-root': { transform: 'translateY(-2px)' }, }}>
                            <EditOutlined sx={{ color: 'text.primary', transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDialogPayload(handleDelete)} sx={{ '&:hover .MuiSvgIcon-root': { transform: 'translateY(-2px)' }, }}>
                            <DeleteOutlined sx={{ color: 'text.primary', transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
                        </IconButton>
                    </Box>
                </Box>
            )
        }
    ]

    if (isLoading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><CircularProgress size={60} /></Box>
    if (error) return <Typography variant='h1' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>{error.message}</Typography>

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }}>
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
                mb: 5,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: "center",
                flexWrap: 'wrap',
                gap: 2,
            }}>
                <Typography variant="h1" className="dash-page-title" sx={{ fontSize: { lg: '2.2rem', xl: '2.5rem' } }}>Clients</Typography>
                <AddBtn onClick={handleAddClient} text="Client" />
            </Box>
            {!data ? (
                <Typography variant='h2' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontWeight: "bold", fontSize: "24px", mb: 15 }}>No Clients</Typography>
            ) : (
                <DataGrid
                    rows={data}
                    columns={columns}
                    pageSizeOptions={[25, 50, 100]}
                    initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                    onRowClick={(params) => {
                        setClientData(params.row)
                    }}
                    rowSelectionModel={
                        clientData
                            ? { type: 'include', ids: new Set([clientData.id]) }
                            : { type: 'include', ids: new Set() }
                    }
                    sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: "8px",
                        boxShadow: isDark ? "3px 3px 3px 0 rgba(0, 0, 0, 0.3)" : "1px 2px 8px rgba(0, 0, 0, 0.06)",
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.02)" : "1px solid rgba(0, 0, 0, 0.06)",
                        userSelect: 'none',
                        backgroundColor: 'background.paper',
                        '& .MuiDataGrid-virtualScroller': {
                            pb: 2,
                            maskImage: `
                            linear-gradient(
                                to bottom,
                                black 0%,
                                black 93%,
                                transparent 100%
                            )
                        `,
                            WebkitMaskImage: `
                            linear-gradient(
                                to bottom,
                                black 0%,
                                black 93%,
                                transparent 100%
                            )
                        `,
                        },
                        '& .MuiDataGrid-row': {
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: 'secondary.main',
                            color: 'primary.contrastText',
                            cursor: 'pointer'
                        },
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-cell:focus-within': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-row.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                        },
                        '& .MuiDataGrid-row.Mui-selected:hover': {
                            backgroundColor: 'primary.main',
                        },
                    }}
                />
            )}
        </Box>
    )
}

export default Clients