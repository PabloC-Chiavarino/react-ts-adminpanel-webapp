import { useState, useRef } from 'react'
import type { Product } from '../../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useDynamicQuery } from '../../hooks'
import { DataGrid, type GridRenderCellParams } from '@mui/x-data-grid'
import { Box, Typography, Modal, IconButton } from '@mui/material'
import { AddBtn, ConfirmDialog, ProductForm } from '../../components'
import { Edit, Delete } from '@mui/icons-material'
export const Products = () => {

    const [open, setOpen] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [productData, setProductData] = useState<Product | null>(null)

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
    const { data, isLoading, error } = useDynamicQuery<Product[]>(PRODUCTS_ENDPOINT)
    const { enqueueSnackbar } = useSnackbar()

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
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_ENDPOINT] })
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
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_ENDPOINT] })
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
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_ENDPOINT] })
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
            await mutation.mutate(productData)
            enqueueSnackbar('Created successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleUpdate = async () => {
        if (!productData) return
        try {
            await updateMutation.mutate(productData)
            enqueueSnackbar('Updated successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleDelete = () => {
        try {
            deleteMutation.mutate(productData!.id)
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
            field: 'id', headerName: 'ID', width: 70, flex: .25, renderCell: (params: GridRenderCellParams<Product>) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>{params.row.id}</span>
                    <Box sx={{ display: productData?.id === params.row.id ? 'block' : 'none' }}>
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
        { field: 'name', headerName: 'Product', width: 130, flex: 1 },
        { field: 'category', headerName: 'Category', width: 130, flex: 1 },
        { field: 'price', headerName: 'Price', width: 130, flex: .25 },
        { field: 'stock', headerName: 'Stock', width: 130, flex: .25 },
    ]

    if (isLoading) return <Typography variant='h5'>Loading...</Typography>
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
                mb: 6,
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
                sx={{
                    width: '90%',
                    maxHeight: '80%',
                    justifyContent: 'space-between',
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

export default Products