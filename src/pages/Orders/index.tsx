import { useState, useRef, useMemo } from 'react'
import type { GridRenderCellParams } from '@mui/x-data-grid'
import type { Order, Product, Field } from '../../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useDynamicQuery } from '../../hooks'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Modal, IconButton, CircularProgress, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemText } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { EditOutlined, VisibilityOutlined, DeleteOutlined, PictureAsPdfOutlined, AddOutlined } from '@mui/icons-material'
import { AddBtn, OrderForm, ConfirmDialog } from '../../components'
import type { User } from '../../types'

const Orders = () => {
    const [openView, setOpenView] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [orderData, setOrderData] = useState<Order | null>(null)

    let requestAction = useRef<(() => void) | null>(null)

    const ORDERS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/pendingOrders'
    const USERS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/users'
    const PRODUCTS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/products'

    const queryClient = useQueryClient()

    const { enqueueSnackbar } = useSnackbar()

    const { data, isLoading, error } = useDynamicQuery<Order[]>(['pendingOrders'], ORDERS_ENDPOINT)
    const { data: productsData, isLoading: productsIsLoading, error: productsError } = useDynamicQuery<Product[]>(['products'], PRODUCTS_ENDPOINT)
    const { data: usersData, isLoading: usersIsLoading, error: usersError } = useDynamicQuery<User[]>(['users'], USERS_ENDPOINT)

    const emptyOrder: Order = {
        id: 0,
        clientId: null,
        productIds: [],
        totalPrice: 0,
        createdAt: ''
    }

    const mutation = useMutation({
        mutationFn: async (user: Order) => {
            const response = await fetch(ORDERS_ENDPOINT, {
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
            setOrderData(emptyOrder);
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const updateMutation = useMutation({
        mutationFn: async (user: Order) => {
            const response = await fetch(`${ORDERS_ENDPOINT}/${user.id}`, {
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
            const response = await fetch(`${ORDERS_ENDPOINT}/${id}`, {
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

    const handleOpenView = () => setOpenView(true)

    const handleOpenEdit = () => setOpenEdit(true)

    const handleClose = () => {
        openView ? setOpenView(false) : setOpenEdit(false)
        setOrderData(emptyOrder)
    }

    const handleOpenDialogPayload = (action: () => void) => {
        requestAction.current = action
        setOpenDialog(true)
    }

    const handleCloseDialog = () => setOpenDialog(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (!orderData) return

        const updated = { ...orderData, [name]: value }
        setOrderData(updated)
    }

    const handleSelectChange = (e: SelectChangeEvent<string | string[]>, field: Field) => {
        const { name, value } = e.target;
        const isMultiple = field?.multiple || false;

        setOrderData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: isMultiple ? (
                    Array.isArray(value) ? value.map(Number) : [Number(value)]
                ) : Number(value)
            };
        });
    }

    const handleSubmit = async () => {
        if (!orderData) return
        try {
            await mutation.mutateAsync(orderData)
            handleClose()
            enqueueSnackbar('Created successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleUpdate = async () => {
        try {
            if (!orderData) return
            await updateMutation.mutateAsync(orderData)
            handleClose()
            enqueueSnackbar('Updated successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(orderData!.id)
            enqueueSnackbar('Deleted successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleAddOrder = () => {
        setOrderData(emptyOrder)
        handleOpenEdit()
    }

    //lookup O(1)
    const usersMap = useMemo(() => {
        const map = new Map<number, User>()
        usersData?.forEach(user => {
            map.set(user.id, user)
        })
        return map
    }, [usersData])

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, flex: .1 },
        {
            field: 'clientId', headerName: 'Client', width: 130, flex: .4, renderCell: (params: GridRenderCellParams<Order>) => {

                const client = params.row.clientId != null ? usersMap?.get(params.row.clientId) : null

                return <span>{client ? `${client.name} ${client.lastName}` : '—'}</span>
            }
        },
        {
            field: 'clientIdonly', headerName: 'Client ID', width: 130, flex: .2, renderCell: (params: GridRenderCellParams<Order>) => {

                return <span>ID <strong>{params?.row.clientId}</strong></span>
            }
        },
        { field: 'totalPrice', headerName: 'Total', width: 100, flex: .2 },
        {
            field: 'createdAt', headerName: 'Created At', width: 100, flex: .2, renderCell: (params: GridRenderCellParams<Order>) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{params.row.id}</span>
                    <Box sx={{ display: orderData?.id === params.row.id ? 'flex' : 'none', alignItems: 'center' }}>
                        <IconButton onClick={() => handleOpenView()} sx={{ '&:hover .MuiSvgIcon-root': { transform: 'translateY(-2px)' } }}>
                            <Box display="flex" gap={0}>
                                <VisibilityOutlined sx={{ color: 'text.primary', transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                <AddOutlined sx={{ fontSize: '15px', color: 'text.primary', transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
                            </Box>
                        </IconButton>
                        <IconButton onClick={() => handleOpenEdit()} sx={{ '&:hover .MuiSvgIcon-root': { transform: 'translateY(-2px)' }, }}>
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

    if (isLoading || usersIsLoading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><CircularProgress size={60} /></Box>
    if (error || usersError) return <Typography variant='h1' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>{error?.message || usersError?.message}</Typography>

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
            <Modal open={openView || openEdit} onClose={handleClose} >
                {orderData?.id !== 0 && openView === true
                    ? (
                        <Box sx={{
                            width: '650px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            gap: 3,
                            pt: 4,
                            pb: 5,
                            borderRadius: 2,
                            boxShadow: 3,
                            backgroundColor: 'background.paper',
                            zIndex: 100,
                        }}>
                            <DialogTitle>Order # {orderData?.id}</DialogTitle>
                            <DialogContent>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Client ID:</strong> {orderData?.clientId}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Created At:</strong> {orderData?.createdAt}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Total:</strong> ${orderData?.totalPrice}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" gutterBottom>Products</Typography>
                                <List dense>
                                    {productsIsLoading ? (
                                        <Typography variant='h6'>Loading...</Typography>
                                    ) : (
                                        productsError ? (
                                            <Typography variant='h6'>{productsError.message}</Typography>
                                        ) : (
                                            productsData?.filter(product =>
                                                orderData?.productIds.includes(product.id)
                                            ).map((product, index) => (
                                                <ListItem key={index} disablePadding>
                                                    <ListItemText
                                                        primary={`Product: ${product.name}`}
                                                        secondary={`Price: $${product.price}`}
                                                    />
                                                </ListItem>
                                            )
                                            )
                                        ))}
                                </List>
                            </DialogContent>
                            <DialogActions>
                                <IconButton sx={{ '&:hover .MuiSvgIcon-root': { transform: 'translateY(-2px)' }, }}>
                                    <PictureAsPdfOutlined sx={{ color: 'text.primary', transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                </IconButton>
                            </DialogActions>
                        </Box>
                    ) : (
                        <OrderForm
                            handleInputChange={handleInputChange}
                            handleSelectChange={handleSelectChange}
                            handleSubmit={(e) => {
                                e.preventDefault();
                                handleOpenDialogPayload(handleSubmit)
                            }}
                            handleUpdate={(e) => {
                                e.preventDefault();
                                handleOpenDialogPayload(handleUpdate)
                            }}
                            formData={orderData!}
                            users={usersData!}
                            products={productsData!}
                        />
                    )}
            </Modal>
            <Box sx={{
                mb: 5,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: "center"
            }}>
                <Typography variant="h1">
                    Orders
                </Typography>
                <AddBtn onClick={handleAddOrder} text="Order" />
            </Box>
            {!data ? (
                <Typography variant='h2' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontWeight: "bold", fontSize: "24px", mb: 15 }}>No Orders</Typography>
            ) : (
                <DataGrid
                    rows={data}
                    columns={columns}
                    onRowClick={(params) => {
                        setOrderData(params.row)
                    }}
                    rowSelectionModel={
                        orderData
                            ? { type: 'include', ids: new Set([orderData.id]) }
                            : { type: 'include', ids: new Set() }
                    }
                    sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: "8px",
                        boxShadow: "3px 3px 3px 0 rgba(0, 0, 0, 0.3)",
                        border: "1px solid rgba(255, 255, 255, 0.02)",
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

export default Orders