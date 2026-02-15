import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import type { Product } from '../../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useDynamicQuery } from '../../hooks'
import { DataGrid, type GridRenderCellParams } from '@mui/x-data-grid'
import { Box, Typography, Modal, IconButton, CircularProgress } from '@mui/material'
import { AddBtn, ConfirmDialog, ProductForm } from '../../components'
import { Edit, Delete } from '@mui/icons-material'
export const Products = () => {

    const [open, setOpen] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [productData, setProductData] = useState<Product | null>(null)
    const location = useLocation()
    const foundProduct = location.state?.product

    let requestAction = useRef<(() => void) | null>(null)

    const emptyProduct: Product = {
        id: 0,
        name: '',
        category: '',
        price: 0,
        stock: 0
    }

    const PRODUCTS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/products'
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
        {
            field: 'id', headerName: 'ID', width: 70, flex: .20, renderCell: (params: GridRenderCellParams<Product>) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>{params.row.id}</span>
                    <Box sx={{ display: productData?.id === params.row.id ? 'block' : 'none', paddingLeft: "20px" }}>
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
        { field: 'name', headerName: 'Product', width: 130, flex: .5 },
        { field: 'category', headerName: 'Category', width: 130, flex: .5 },
        { field: 'price', headerName: 'Price', width: 130, flex: .25 },
        { field: 'stock', headerName: 'Stock', width: 130, flex: .25 },
    ]

    if (isLoading) return <Typography variant='h5'><CircularProgress /></Typography>
    if (!data) return <Typography variant='h5'>No products</Typography>
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
                mb: 3,
                width: '90%',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h4'>
                    Products
                </Typography>
                <AddBtn onClick={handleAddProduct} />
            </Box>
            <DataGrid
                rows={data}
                columns={columns}
                onRowClick={(params) => setProductData(params.row)}
                rowSelectionModel={
                    productData
                        ? { type: 'include', ids: new Set([productData.id]) }
                        : { type: 'include', ids: new Set() }
                }
                sx={{
                    width: '90%',
                    maxHeight: '80%',
                    userSelect: 'none',
                    backgroundColor: 'background.paper',
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'secondary.main',
                        color: 'primary.contrastText',
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
        </>
    )
}

export default Products