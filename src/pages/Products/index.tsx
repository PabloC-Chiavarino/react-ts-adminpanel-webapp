import { useQuery } from '@tanstack/react-query'
import { DataGrid } from '@mui/x-data-grid'
import { Typography } from '@mui/material'
import type { Product } from '../../types'
export const Products = () => {

    const fetchProducts = async (): Promise<Product[]> => {
        const response = await fetch('https://mock-data-api-vntk.onrender.com/products')
        const data = await response.json()
        return data
    }

    const { data, isLoading, error } = useQuery<Product[], Error>({
        queryKey: ['products'],
        queryFn: fetchProducts
    })

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Product', width: 130 },
        { field: 'category', headerName: 'Category', width: 130 },
        { field: 'price', headerName: 'Price', width: 130 },
        { field: 'stock', headerName: 'Stock', width: 130 },
    ]

    if (isLoading) return <Typography variant='h4'>Loading...</Typography>
    if (error) return <Typography variant='h4'>{error.message}</Typography>

    return (
        <>
            <Typography variant='h4'>Products</Typography>
            <DataGrid rows={data} columns={columns} />
        </>
    )
}

export default Products