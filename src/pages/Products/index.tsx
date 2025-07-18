import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDynamicQuery } from '../../hooks'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Modal } from '@mui/material'
import type { Product } from '../../types'
import { AddBtn, ProductForm } from '../../components'
export const Products = () => {

    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState<Product>({
        id: 0,
        name: '',
        category: '',
        price: 0,
        stock: 0
    })

    const PRODUCTS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/products'

    const queryClient = useQueryClient()

    const { data, isLoading, error } = useDynamicQuery<Product[]>(PRODUCTS_ENDPOINT)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const updated = { ...formData, [name]: name === 'price' || name === 'stock' ? Number(value) : value }

        setFormData(updated)

        // console.log(updated) // debug
    }

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
            setFormData({
                id: 0,
                name: '',
                category: '',
                price: 0,
                stock: 0
            });
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutation.mutate(formData)
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, flex: .25 },
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
            <Modal
                open={open}
                onClose={handleClose} >
                <ProductForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
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
                <AddBtn onClick={handleOpen} />
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