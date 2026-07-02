import { useState, useMemo } from "react"
import { Search } from "@mui/icons-material"
import { Box, InputBase, IconButton, Typography, Popover, List, ListItemButton, ListItemText, Divider } from "@mui/material"
import { useSnackbar } from "notistack"
import { useDynamicQuery } from "../../hooks"
import type { Product, User } from "../../types"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from '../../config'

const MIN_QUERY_LENGTH = 3

const SearchBox = () => {
    const [query, setQuery] = useState('')
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const navigate = useNavigate()

    const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`
    const USERS_ENDPOINT = `${API_BASE_URL}/users`
    const { data: productsData } = useDynamicQuery<Product[]>(['products'], PRODUCTS_ENDPOINT)
    const { data: usersData } = useDynamicQuery<User[]>(['users'], USERS_ENDPOINT)
    const { enqueueSnackbar } = useSnackbar()

    const results = useMemo(() => {
        if (query.trim().length < MIN_QUERY_LENGTH) return { products: [], users: [] }

        const lowerQuery = query.toLowerCase().trim()
        const products = productsData?.filter(p => p.name.toLowerCase().includes(lowerQuery)) || []
        const users = usersData?.filter(u =>
            u.name.toLowerCase().includes(lowerQuery) ||
            u.lastName.toLowerCase().includes(lowerQuery) ||
            u.email.toLowerCase().includes(lowerQuery)
        ) || []

        return { products, users }
    }, [query, productsData, usersData])

    const hasResults = results.products.length > 0 || results.users.length > 0
    const showPopover = query.trim().length >= MIN_QUERY_LENGTH && anchorEl !== null

    const handleSelectProduct = (product: Product) => {
        setAnchorEl(null)
        setQuery('')
        enqueueSnackbar(`Product: ${product.name}`, { variant: 'success' })
        navigate(`/products/`, { state: { foundProduct: product } })
    }

    const handleSelectUser = (user: User) => {
        setAnchorEl(null)
        setQuery('')
        enqueueSnackbar(`User: ${user.name} ${user.lastName}`, { variant: 'success' })
        navigate(`/clients/`, { state: { foundUser: user } })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (query.trim().length < MIN_QUERY_LENGTH) {
                enqueueSnackbar(`Type at least ${MIN_QUERY_LENGTH} characters to search`, { variant: 'warning' })
                return
            }
            if (!hasResults) {
                enqueueSnackbar('No results found', { variant: 'info' })
            }
        }
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <Box
                tabIndex={0}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: { xs: '50vw', sm: '35vw' },
                    maxWidth: { sm: 320 },
                    height: '40px',
                    padding: '0 12px 0 12px',
                    fontSize: '14px',
                    lineHeight: '22px',
                    fontWeight: 400,
                    backgroundColor: 'background.paper',
                    borderRadius: '9999px',
                    borderWidth: 2,
                    borderColor: 'background.paper',
                    borderStyle: 'solid',
                    '&:focus-within': {
                        borderColor: 'primary.main',
                    },
                }}
            >
                <InputBase
                    placeholder='Search client or product...'
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setAnchorEl(e.target as unknown as HTMLElement)
                    }}
                    onFocus={(e) => setAnchorEl(e.target as unknown as HTMLElement)}
                    onBlur={() => setTimeout(() => setAnchorEl(null), 200)}
                    onKeyDown={handleKeyDown}
                    value={query}
                    sx={{
                        width: '100%',
                        height: '100%',
                        padding: '0 12px 0 12px',
                        color: 'text.primary',
                        fontSize: '14px',
                    }}
                />
                <IconButton sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                    <Search sx={{ color: 'text.secondary' }} />
                </IconButton>
            </Box>

            <Popover
                open={showPopover}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: '90vw', sm: '360px' },
                            maxHeight: '320px',
                            mt: 1,
                            borderRadius: '12px',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                            overflow: 'hidden',
                        }
                    }
                }}
                onClose={() => setAnchorEl(null)}
            >
                {!hasResults ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No results for "{query}"
                        </Typography>
                    </Box>
                ) : (
                    <List dense disablePadding>
                        {results.products.length > 0 && (
                            <>
                                <ListItemButton disabled sx={{ py: 0.5 }}>
                                    <ListItemText
                                        primary="Products"
                                        primaryTypographyProps={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                    />
                                </ListItemButton>
                                {results.products.slice(0, 5).map(product => (
                                    <ListItemButton key={product.id} onClick={() => handleSelectProduct(product)} sx={{ py: 1 }}>
                                        <ListItemText
                                            primary={product.name}
                                            secondary={`${product.category} · $${product.price}`}
                                            primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
                                            secondaryTypographyProps={{ fontSize: '12px' }}
                                        />
                                    </ListItemButton>
                                ))}
                                {results.products.length > 5 && (
                                    <ListItemButton disabled sx={{ py: 0.3 }}>
                                        <Typography variant="caption" color="text.secondary">+{results.products.length - 5} more</Typography>
                                    </ListItemButton>
                                )}
                            </>
                        )}

                        {results.users.length > 0 && results.products.length > 0 && <Divider />}

                        {results.users.length > 0 && (
                            <>
                                <ListItemButton disabled sx={{ py: 0.5 }}>
                                    <ListItemText
                                        primary="Clients"
                                        primaryTypographyProps={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                    />
                                </ListItemButton>
                                {results.users.slice(0, 5).map(user => (
                                    <ListItemButton key={user.id} onClick={() => handleSelectUser(user)} sx={{ py: 1 }}>
                                        <ListItemText
                                            primary={`${user.name} ${user.lastName}`}
                                            secondary={user.email}
                                            primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
                                            secondaryTypographyProps={{ fontSize: '12px' }}
                                        />
                                    </ListItemButton>
                                ))}
                                {results.users.length > 5 && (
                                    <ListItemButton disabled sx={{ py: 0.3 }}>
                                        <Typography variant="caption" color="text.secondary">+{results.users.length - 5} more</Typography>
                                    </ListItemButton>
                                )}
                            </>
                        )}
                    </List>
                )}
            </Popover>
        </Box>
    )
}

export default SearchBox
