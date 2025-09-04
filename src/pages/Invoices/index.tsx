import { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { GridRenderCellParams } from '@mui/x-data-grid'
import type { SelectChangeEvent } from '@mui/material'
import type { Invoice, User, Product, Field } from '../../types'
import { useSnackbar } from 'notistack'
import { useDynamicQuery } from '../../hooks'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Modal, IconButton, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemText, CircularProgress } from '@mui/material'
import { Delete, Visibility, PictureAsPdf } from '@mui/icons-material'
import { ConfirmDialog, InvoiceForm, AddBtn } from '../../components'
export const Invoices = () => {
    const [open, setOpen] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [invoiceData, setInvoiceData] = useState<Invoice | null>(null)

    let requestAction = useRef<(() => void) | null>(null)

    const INVOICES_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/invoices'
    const USERS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/users'
    const PRODUCTS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/products'

    const queryClient = useQueryClient()

    const { enqueueSnackbar } = useSnackbar()

    const { data, isLoading, error } = useDynamicQuery<Invoice[]>(INVOICES_ENDPOINT)
    const { data: productsData, isLoading: productsIsLoading, error: productsError } = useDynamicQuery<Product[]>(PRODUCTS_ENDPOINT)
    const { data: usersData, isLoading: usersIsLoading, error: usersError } = useDynamicQuery<User[]>(USERS_ENDPOINT)

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
            queryClient.invalidateQueries({ queryKey: [INVOICES_ENDPOINT] })
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
            queryClient.invalidateQueries({ queryKey: [INVOICES_ENDPOINT] })
            setInvoiceData(emptyInvoice);
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const handleSubmit = async () => {
        if (!invoiceData) return

        try {
            await mutation.mutate(invoiceData)
            enqueueSnackbar('Created successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }


    const handleDelete = () => {
        try {
            deleteMutation.mutate(invoiceData!.id)
            enqueueSnackbar('Deleted successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const columns = [
        {
            field: 'id', headerName: 'ID', width: 100, flex: .5, renderCell: (params: GridRenderCellParams<Invoice>) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>{params.row.id}</span>
                    <Box sx={{ display: invoiceData?.id === params.row.id ? 'block' : 'none' }}>
                        <IconButton>
                            <Visibility onClick={() => handleOpen()} />
                        </IconButton>
                        <IconButton>
                            <Delete onClick={() => handleOpenDialogPayload(handleDelete)} />
                        </IconButton>
                    </Box>
                </Box>
            )
        },
        {
            field: 'clientId', headerName: 'Client', width: 130, flex: 1, renderCell: (params: GridRenderCellParams<Invoice>) => {

                const client = usersData?.find(user => user.id === params.row.clientId)

                if (usersIsLoading) return <Typography variant='h6'>Loading...</Typography>
                if (usersError) return <Typography variant='h6'>{usersError.message}</Typography>

                return <span>{client?.name} {client?.lastName}</span>
            }
        },
        {
            field: 'clientIdonly', headerName: 'Client ID', width: 130, flex: 1, renderCell: (params: GridRenderCellParams<Invoice>) => {

                if (usersIsLoading) return <Typography variant='h6'>Loading...</Typography>
                if (usersError) return <Typography variant='h6'>{usersError.message}</Typography>

                return <span>ID <strong>{params?.row.clientId}</strong></span>
            }
        },
        { field: 'totalPrice', headerName: 'Total', width: 130, flex: 1 },
        { field: 'createdAt', headerName: 'Created At', width: 130, flex: .5 }
    ]

    if (isLoading) return <Typography variant='h5'><CircularProgress /></Typography>
    if (!data) return <Typography variant='h5'>No Invoices</Typography>
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
                {invoiceData?.id !== 0 ? (
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
                        backgroundColor: '#fff',
                        zIndex: 100,
                    }}>
                        <DialogTitle>Invoice # {invoiceData?.id}</DialogTitle>
                        <DialogContent>
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
                            <IconButton>
                                <PictureAsPdf />
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
                mb: 6,
                width: '90%',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h4'>
                    Invoices
                </Typography>
                <AddBtn onClick={handleAddInvoice} />
            </Box>
            <DataGrid
                rows={data}
                columns={columns}
                onRowClick={(params) => { setInvoiceData(params.row) }}
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

export default Invoices