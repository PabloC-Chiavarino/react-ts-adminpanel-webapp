import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import type { Product } from '../../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useDynamicQuery } from '../../hooks'
import { DataGrid, type GridRenderCellParams } from '@mui/x-data-grid'
import { Box, Typography, Modal, IconButton, CircularProgress, useTheme, useMediaQuery } from '@mui/material'
import { AddBtn, ConfirmDialog, ProductForm } from '../../components'
import { EditOutlined, DeleteOutlined } from '@mui/icons-material'
import { API_BASE_URL } from '../../config'
export const Products = () => {

    const [open, setOpen] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [productData, setProductData] = useState<Product | null>(null)
    const location = useLocation()
    const foundProduct = location.state?.foundProduct
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const isXs = useMediaQuery(theme.breakpoints.down('sm'))

    let requestAction = useRef<(() => void) | null>(null)

    const emptyProduct: Product = {
        id: 0,
        name: '',
        category: '',
        price: 0,
        stock: 0,
        createdAt: ''
    }

    const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`
    const queryClient = useQueryClient()
    const { data, isLoading, error } = useDynamicQuery<Product[]>(['products'], PRODUCTS_ENDPOINT)
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (foundProduct) {
            setProductData(foundProduct)
        }
    }, [foundProduct])

    const mutation = useMutation({
        mutationFn: async (product: Product) => {
            const response = await fetch(PRODUCTS_ENDPOINT, {
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
            queryClient.invalidateQueries({ queryKey: ['products'] })
            setProductData(emptyProduct);
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const updateMutation = useMutation({
        mutationFn: async (product: Product) => {
            const response = await fetch(`${PRODUCTS_ENDPOINT}/${product.id}`, {
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
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const handleOpen = () => setOpen(true)

    const handleClose = () => {
        setOpen(false)
        setProductData(emptyProduct)
    }

    const handleOpenDialogPayload = (action: () => void) => {
        requestAction.current = action
        setOpenDialog(true)
    }

    const handleCloseDialog = () => setOpenDialog(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (!productData) return

        const updated = { ...productData, [name]: value }
        setProductData(updated)
    }

    const handleSubmit = async () => {
        if (!productData) return
        try {
            await mutation.mutateAsync(productData)
            enqueueSnackbar('Created successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleUpdate = async () => {
        if (!productData) return
        try {
            await updateMutation.mutateAsync(productData)
            enqueueSnackbar('Updated successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleDelete = () => {
        try {
            deleteMutation.mutateAsync(productData!.id)
            enqueueSnackbar('Deleted successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleAddProduct = () => {
        setProductData(emptyProduct)
        handleOpen()
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, flex: .1 },
        { field: 'name', headerName: 'Product', width: 130, flex: .4 },
        { field: 'category', headerName: 'Category', width: 130, flex: .2, hide: isXs },
        { field: 'price', headerName: 'Price', width: 130, flex: .2 },
        {
            field: 'stock', headerName: 'Stock', width: 130, flex: .2, renderCell: (params: GridRenderCellParams<Product>) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{params.row.stock}</span>
                    <Box sx={{ display: productData?.id === params.row.id ? 'flex' : 'none', alignItems: 'center' }}>
                        <IconButton onClick={() => handleOpen()} sx={{ '&:hover .MuiSvgIcon-root': { transform: 'translateY(-2px)' }, }}>
                            <EditOutlined sx={{ color: 'text.primary', transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDialogPayload(handleDelete)} sx={{ '&:hover .MuiSvgIcon-root': { transform: 'translateY(-2px)' }, }}>
                            <DeleteOutlined sx={{ color: 'text.primary', transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
                        </IconButton>
                    </Box>
                </Box>
            )
        },
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
            <Modal
                open={open}
                onClose={handleClose} >
                <ProductForm
                    formData={productData ?? emptyProduct}
                    handleInputChange={handleInputChange}
                    handleSubmit={(e) => {
                        e.preventDefault();
                        handleOpenDialogPayload(handleSubmit)
                    }}
                    handleUpdate={(e) => {
                        e.preventDefault();
                        handleOpenDialogPayload(handleUpdate)
                    }} />
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
                <Typography variant="h1" className="dash-page-title" sx={{ fontSize: { lg: '2.2rem', xl: '2.5rem' } }}>Products</Typography>
                <AddBtn onClick={handleAddProduct} text="Product" />
            </Box>
            {!data ? (
                <Typography variant='h2' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontWeight: "bold", fontSize: "24px", mb: 15 }}>No Products</Typography>
            ) : (
                <DataGrid
                    rows={data}
                    columns={columns}
                    pageSizeOptions={[25, 50, 100]}
                    initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                    onRowClick={(params) => setProductData(params.row)}
                    rowSelectionModel={
                        productData
                            ? { type: 'include', ids: new Set([productData.id]) }
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

export default Products