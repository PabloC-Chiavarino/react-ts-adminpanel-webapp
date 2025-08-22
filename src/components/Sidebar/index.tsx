import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Collapse } from '@mui/material'
import {
    Dashboard,
    People,
    Inventory2,
    ManageAccountsOutlined,
    Receipt,
    Assignment,
    CalendarMonth,
    ExpandLess,
    ExpandMore,
    AttachMoney,
    Star,
    BarChart,
    PendingActions,
    ShoppingBag,
    Badge
} from '@mui/icons-material'

export const Sidebar = () => {
    const [analyticsOpen, setAnalyticsOpen] = useState(false)
    const location = useLocation()

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/' },
        { text: 'Products', icon: <Inventory2 />, path: '/products' },
        { text: 'Clients/Users', icon: <Badge />, path: '/clients' },
        { text: 'Invoices', icon: <Receipt />, path: '/invoices' },
        { text: 'Tasks', icon: <Assignment />, path: '/tasker' },
        { text: 'Calendar', icon: <CalendarMonth />, path: '/calendar' },
    ]

    const analyticsMenuItems = [
        { text: 'Revenue', icon: <AttachMoney />, path: '/analytics/revenue' },
        { text: 'Orders', icon: <ShoppingBag />, path: '/analytics/orders-per-month' },
        { text: 'Clients', icon: <People />, path: '/analytics/clients-per-month' },
        { text: 'Most Sold', icon: <Star />, path: '/analytics/most-sold' },
        { text: 'Pending Tasks', icon: <PendingActions />, path: '/analytics/pending-tasks' },
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

                <ListItemButton onClick={() => setAnalyticsOpen(!analyticsOpen)}>
                    <ListItemIcon><BarChart /></ListItemIcon>
                    <ListItemText primary='Analytics' />
                    {analyticsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={analyticsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {analyticsMenuItems.map(({ text, icon, path }) => (
                            <ListItemButton
                                key={text}
                                component={Link}
                                to={path}
                                selected={location.pathname === path}
                                sx={{
                                    pl: 4,
                                    pt: 2,
                                    pb: 2
                                }}
                            >
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
            </List>
        </Drawer>
    )
}

export default Sidebar