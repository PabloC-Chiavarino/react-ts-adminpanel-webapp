import { useState, useRef, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { GridRenderCellParams } from '@mui/x-data-grid'
import type { SelectChangeEvent } from '@mui/material'
import type { Invoice, User, Product, Field } from '../../types'
import { useSnackbar } from 'notistack'
import { useDynamicQuery } from '../../hooks'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Modal, IconButton, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemText, CircularProgress, useTheme, useMediaQuery } from '@mui/material'
import { DeleteOutlined, VisibilityOutlined, AddOutlined, PictureAsPdfOutlined } from '@mui/icons-material'
import { ConfirmDialog, InvoiceForm, AddBtn } from '../../components'
import { API_BASE_URL } from '../../config'
export const Invoices = () => {
    const [open, setOpen] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [invoiceData, setInvoiceData] = useState<Invoice | null>(null)
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const isXs = useMediaQuery(theme.breakpoints.down('sm'))

    const requestAction = useRef<(() => void) | null>(null)

    const INVOICES_ENDPOINT = `${API_BASE_URL}/invoices`
    const USERS_ENDPOINT = `${API_BASE_URL}/users`
    const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`

    const queryClient = useQueryClient()

    const { enqueueSnackbar } = useSnackbar()

    const { data, isLoading, error } = useDynamicQuery<Invoice[]>(['invoices'], INVOICES_ENDPOINT)
    const { data: productsData, isLoading: productsIsLoading, error: productsError } = useDynamicQuery<Product[]>(['products'], PRODUCTS_ENDPOINT)
    const { data: usersData, isLoading: usersIsLoading, error: usersError } = useDynamicQuery<User[]>(['users'], USERS_ENDPOINT)

    const emptyInvoice: Invoice = {
        id: 0,
        clientId: null,
        productIds: [],
        totalPrice: 0,
        createdAt: ''
    }

    const handleOpen = () => setOpen(true)

    const handleClose = () => {
        setOpen(false)
        setInvoiceData(emptyInvoice)
    }

    const handleOpenDialogPayload = (action: () => void) => {
        requestAction.current = action
        setOpenDialog(true)
    }

    const handleCloseDialog = () => setOpenDialog(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setInvoiceData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: value,
            };
        });
    }

    const handleSelectChange = (e: SelectChangeEvent<string | string[]>, field: Field) => {
        const { name, value } = e.target;
        const isMultiple = field?.multiple || false


        setInvoiceData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: isMultiple ? (
                    Array.isArray(value) ?
                        value.map(Number)
                        :
                        [Number(value)]
                ) : (
                    Number(value)
                ),
            };
        });
    }

    const handleAddInvoice = () => {
        setInvoiceData(emptyInvoice)
        handleOpen()
    }


    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${INVOICES_ENDPOINT}/${id}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] })
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const mutation = useMutation({
        mutationFn: async (product: Invoice) => {
            const response = await fetch(INVOICES_ENDPOINT, {
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
            queryClient.invalidateQueries({ queryKey: ['invoices'] })
            setInvoiceData(emptyInvoice);
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const handleSubmit = async () => {
        if (!invoiceData) return

        try {
            await mutation.mutateAsync(invoiceData)
            enqueueSnackbar('Created successfully', { variant: 'success' })
        } catch {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }


    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(invoiceData!.id)
            enqueueSnackbar('Deleted successfully', { variant: 'success' })
        } catch {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    //lookup O(1)
    const usersMap = useMemo(() => {
        const map = new Map()
        usersData?.forEach(user => {
            map.set(user.id, user)
        })
        return map
    }, [usersData])

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, flex: .1 },
        {
            field: 'clientId', headerName: 'Client', width: 130, flex: .4, renderCell: (params: GridRenderCellParams<Invoice>) => {

                const client = usersMap.get(params.row.clientId)

                return <span>{client ? `${client.name} ${client.lastName}` : '—'}</span>
            }
        },
        {
            field: 'clientIdonly', headerName: 'Client ID', flex: .2, hide: isXs, renderCell: (params: GridRenderCellParams<Invoice>) => {

                return <span>ID <strong>{params?.row.clientId}</strong></span>

            }
        },
        { field: 'totalPrice', headerName: 'Total', width: 100, flex: .2 },
        {
            field: 'createdAt', headerName: 'Created At', width: 100, flex: .2, renderCell: (params: GridRenderCellParams<Invoice>) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{params.row.id}</span>
                    <Box sx={{ display: invoiceData?.id === params.row.id ? 'block' : 'none', paddingLeft: "20px" }}>
                        <IconButton onClick={() => handleOpen()} sx={{ '&:hover .MuiSvgIcon-root': { transform: 'translateY(-2px)' }, }} >
                            <Box display="flex" gap={0} >
                                <VisibilityOutlined sx={{ color: 'text.primary', transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                <AddOutlined sx={{ fontSize: '15px', color: 'text.primary', transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
                            </Box>
                        </IconButton >
                        <IconButton onClick={() => handleOpenDialogPayload(handleDelete)} sx={{ '&:hover .MuiSvgIcon-root': { transform: 'translateY(-2px)' }, }}>
                            <DeleteOutlined sx={{ color: 'text.primary', transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
                        </IconButton>
                    </Box>
                </Box>
            )
        }
    ]

    if (isLoading || usersIsLoading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><CircularProgress size={60} /></Box>
    if (error || usersError) return <Typography variant='h1' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>{error?.message}</Typography>

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
                {invoiceData?.id !== 0 ? (
                    <Box sx={{
                        width: { xs: '95%', sm: '90%', md: '650px' },
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
                        <DialogTitle>Invoice # {invoiceData?.id}</DialogTitle>
                        <DialogContent sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Client ID:</strong> {invoiceData?.clientId}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Created At:</strong> {invoiceData?.createdAt}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Total:</strong> ${invoiceData?.totalPrice}
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
                                            invoiceData?.productIds.includes(product.id)
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
                    < InvoiceForm
                        handleInputChange={handleInputChange}
                        handleSelectChange={handleSelectChange}
                        handleSubmit={(e) => {
                            e.preventDefault();
                            handleOpenDialogPayload(handleSubmit)
                        }}
                        formData={invoiceData}
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
                alignItems: "center",
                flexWrap: 'wrap',
                gap: 2,
            }}>
                <Typography variant="h1" className="dash-page-title" sx={{ fontSize: { sm: '1.6rem', md: '1.9rem', lg: '2.2rem', xl: '2.5rem' } }}>Invoices</Typography>
                <AddBtn onClick={handleAddInvoice} text="Invoice" />
            </Box>
            {!data ? (
                <Typography variant='h2' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontWeight: "bold", fontSize: "24px", mb: 15 }}>No Invoices</Typography>
            ) : (
                <DataGrid
                    rows={data}
                    columns={columns}
                    pageSizeOptions={[25, 50, 100]}
                    initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                    onRowClick={(params) => { setInvoiceData(params.row) }}
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

export default Invoices