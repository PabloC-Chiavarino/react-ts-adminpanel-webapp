import { Link, useLocation } from 'react-router-dom'
import { Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { Dashboard, People, Inventory2, ManageAccountsOutlined, Receipt, Assignment , CalendarMonth } from '@mui/icons-material'

export const Sidebar = () => {

    const location = useLocation()

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/' },
        { text: 'Products', icon: <Inventory2 />, path: '/products' },
        { text: 'Clients/Users', icon: <People />, path: '/clients' },
        { text: 'Invoices', icon: <Receipt />, path: '/invoices' },
        { text: 'Tasks', icon: <Assignment />, path: '/tasker' },
        { text: 'Calendar', icon: <CalendarMonth />, path: '/calendar' },
    ]

    const drawerWidth = 240

    return (
        <Drawer variant='permanent'>
            <Box sx={{
                display: 'flex',
                alignItems: 'end',
                px: 2,
                mt: 2,
                gap: 1
            }}
            >
                <ManageAccountsOutlined sx={{ fontSize: 35 }} />
                <Typography 
                    variant='h6'
                    sx={{
                        fontSize: 18,
                        fontWeight: 'bold'
                    }}
                    >
                    AdminAssistant
                </Typography>
            </Box>
            <List 
                component='nav'
                sx={{
                     mt: 8,
                     width: `${drawerWidth}px`
                    }}
                    >
                {menuItems.map(({ text, icon, path }) => (
                    <ListItemButton
                        key={text}
                        component={Link}
                        to={path}
                        selected={location.pathname === path}
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: '#1976d2',
                                color: '#fff'
                            },
                            '&.Mui-selected:hover': {
                                backgroundColor: '#1976d2',
                                color: '#fff'
                            },
                            pt: 2,
                            pb: 2
                        }}
                    >

                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    )
}

export default Sidebar