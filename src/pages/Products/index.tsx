import { useDynamicQuery } from '../../hooks'
import { DataGrid } from '@mui/x-data-grid'
import { Typography } from '@mui/material'
import type { Product } from '../../types'
export const Products = () => {

    const PRODUCTS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/products'

    const { data, isLoading, error } = useDynamicQuery<Product[]>(PRODUCTS_ENDPOINT)

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, flex: .25 },
        { field: 'name', headerName: 'Product', width: 130, flex: 1 },
        { field: 'category', headerName: 'Category', width: 130, flex: 1 },
        { field: 'price', headerName: 'Price', width: 130, flex: .25 },
        { field: 'stock', headerName: 'Stock', width: 130, flex: .25 },
    ]

    if (isLoading) return <Typography variant='h4'>Loading...</Typography>
    if (error) return <Typography variant='h4'>{error.message}</Typography>

    return (
        <>
            <Typography variant='h4' sx={{
                mb: 8,
                width: '90%',
                textAlign: 'start'
            }}
            >
                Products
            </Typography>
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