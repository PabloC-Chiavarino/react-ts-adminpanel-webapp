import { useState } from "react"
import { Search } from "@mui/icons-material"
import { Box, InputBase, IconButton, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import { useDynamicQuery } from "../../hooks"
import type { Product, User } from "../../types"
import { useNavigate } from "react-router-dom"

const SearchBox = () => {

    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    const PRODUCTS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/products'
    const USERS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/users'
    const { data: productsData, isLoading: productsIsLoading, error: productsError } = useDynamicQuery<Product[]>(['products'], PRODUCTS_ENDPOINT)
    const { data: usersData, isLoading: usersIsLoading, error: usersError } = useDynamicQuery<User[]>(['users'], USERS_ENDPOINT)
    const { enqueueSnackbar } = useSnackbar()

    const handleSearch = () => {
        if (!query.trim()) {
            enqueueSnackbar('Please enter a search query', { variant: 'warning' })
            return
        }

        const lowerQuery = query.toLowerCase()

        const product = productsData?.find(product => product.name.toLowerCase().includes(lowerQuery))
        const user = usersData?.find(user => user.name.toLowerCase().includes(lowerQuery) || user.lastName.toLowerCase().includes(lowerQuery))

        if (!product && !user) {
            enqueueSnackbar('No results found', { variant: 'info' })
            return
        }

        if (product) {
            if (productsIsLoading) return <Typography variant='h6'>Loading...</Typography>
            if (productsError) return <Typography variant='h6'>{productsError.message}</Typography>
            enqueueSnackbar(`Product: ${product.name}`, { variant: 'success' })
            navigate(`/products/`, { state: { foundProduct: product } })
        } else if (user) {
            if (usersIsLoading) return <Typography variant='h6'>Loading...</Typography>
            if (usersError) return <Typography variant='h6'>{usersError.message}</Typography>
            enqueueSnackbar(`User: ${user.name} ${user.lastName}`, { variant: 'success' })
            navigate(`/clients/`, { state: { foundUser: user } })
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '5px',
                width: '275px',
                height: '35px',
                backgroundColor: 'background.paper',
                paddingInlineStart: '16px',
                paddingInlineEnd: '8px',
            }}
        >
            <InputBase
                placeholder='Search client or product...'
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                value={query}
            />
            <IconButton onClick={() => handleSearch()}>
                <Search />
            </IconButton>
        </Box>
    )
}

export default SearchBox