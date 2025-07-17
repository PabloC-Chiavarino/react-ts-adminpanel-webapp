import { useState } from 'react'
import { useDynamicQuery } from '../../hooks'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Modal } from '@mui/material'
import type { Product } from '../../types'
import { AddBtn, ProductForm } from '../../components'
export const Products = () => {

    const [open, setOpen] = useState(false)

    const PRODUCTS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/products'

    const { data, isLoading, error } = useDynamicQuery<Product[]>(PRODUCTS_ENDPOINT)

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, flex: .25 },
        { field: 'name', headerName: 'Product', width: 130, flex: 1 },
        { field: 'category', headerName: 'Category', width: 130, flex: 1 },
        { field: 'price', headerName: 'Price', width: 130, flex: .25 },
        { field: 'stock', headerName: 'Stock', width: 130, flex: .25 },
    ]

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    if (isLoading) return <Typography variant='h4'>Loading...</Typography>
    if (error) return <Typography variant='h4'>{error.message}</Typography>

    return (
        <>  
            <Modal open={open} onClose={handleClose} >
                <ProductForm/>
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
                <AddBtn onClick={handleOpen}/>
            </Box>
            <DataGrid
                rows={data}
                columns={columns}
                sx={{
                    width: '90%',
                    maxHeight: '80%',
                    justifyContent: 'space-between'
                }}
            />
        </>
    )
}

export default Products