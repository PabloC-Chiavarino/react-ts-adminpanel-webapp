import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Collapse, useTheme } from '@mui/material'
import logo from '../../assets/Icons/logo.png'
import {
    DashboardOutlined,
    People,
    Inventory2Outlined,
    DescriptionOutlined,
    TaskOutlined,
    CalendarTodayOutlined,
    ExpandLess,
    ExpandMore,
    AttachMoney,
    Star,
    BarChartOutlined,
    ShoppingBag,
    GroupOutlined,
    ShoppingCartOutlined,

} from '@mui/icons-material'

export const Sidebar = () => {
    const [analyticsOpen, setAnalyticsOpen] = useState(false)
    const location = useLocation()
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardOutlined />, path: '/dashboard' },
        { text: 'Products', icon: <Inventory2Outlined />, path: '/products' },
        { text: 'Clients', icon: <GroupOutlined />, path: '/clients' },
        { text: 'Orders', icon: <ShoppingCartOutlined />, path: '/orders' },
        { text: 'Invoices', icon: <DescriptionOutlined />, path: '/invoices' },
        { text: 'Tasks', icon: <TaskOutlined />, path: '/tasker' },
        { text: 'Calendar', icon: <CalendarTodayOutlined />, path: '/calendar' },
    ]

    const analyticsMenuItems = [
        { text: 'Revenue', icon: <AttachMoney />, path: '/analytics/revenue' },
        { text: 'Invoices', icon: <ShoppingBag />, path: '/analytics/invoices-per-month' },
        { text: 'Clients', icon: <People />, path: '/analytics/clients-per-month' },
        { text: 'Most Sold', icon: <Star />, path: '/analytics/most-sold' },
    ]

    const drawerWidth = 256

    return (
        <Drawer variant='permanent' sx={{
            '& .MuiDrawer-paper': {
                borderRight: 'none',
                width: `${drawerWidth}px`,
                backgroundColor: 'background.default',
                boxShadow: isDark
                    ? '40px 0 60px -15px rgba(178, 161, 255, 0.06)'
                    : '4px 0 24px -4px rgba(0, 0, 0, 0.07)',
                zIndex: 1500,
            },
        }}>
            <Box sx={{
                display: 'flex',
                marginLeft: 4,
                marginTop: 4,
                gap: 1
            }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'tertiary.main',
                    borderRadius: '10px',
                }}>
                    <img src={logo} alt="Logo" style={{
                        width: '22px',
                        height: '22px',
                        fill: 'background.default'
                    }} />
                </Box>
                <Typography
                    variant='h6'
                    sx={{
                        fontSize: 20,
                        fontWeight: '700',
                        color: 'tertiary.main'
                    }}
                >
                    Nexo
                </Typography>
            </Box>
            <List
                component='nav'
                sx={{
                    mt: 6,
                    ml: 1,
                    mr: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                {menuItems.map(({ text, icon, path }) => (
                    <ListItemButton
                        key={text}
                        component={Link}
                        to={path}
                        selected={location.pathname === path}
                        sx={{
                            width: '100%',
                            height: '48px',
                            borderRadius: '12px',
                            transition: 'all .6s ease',
                            '&:hover': {
                                backgroundColor: 'background.paper2',
                                '& .MuiListItemIcon-root': {
                                    color: 'text.primary',
                                },

                                '& .MuiTypography-root': {
                                    color: 'text.primary',
                                },
                            },
                            '&.Mui-selected': {
                                backgroundColor: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'primary.main',
                                },
                                '& .MuiListItemIcon-root': {
                                    color: 'text.primary',
                                },

                                '& .MuiTypography-root': {
                                    color: 'text.primary',
                                },
                            },
                            '&:active': {
                                transform: 'scale(0.98)',
                                backgroundColor: 'primary.main',
                                '& .MuiListItemIcon-root': {
                                    color: 'text.primary',
                                },

                                '& .MuiTypography-root': {
                                    color: 'text.primary',
                                },
                            },
                            px: 2,
                            gap: -.5,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: '40px', color: 'text.secondary' }}>{icon}</ListItemIcon>
                        <ListItemText
                            primary={text}
                            slotProps={{
                                primary: {
                                    sx: {
                                        fontSize: 14,
                                        color: 'text.secondary',
                                        transition: 'all 0.2s ease',
                                        '&:active': {
                                            transform: 'translate(3px, -2px)',
                                        },
                                    },
                                },
                            }}
                        />
                    </ListItemButton>
                ))}

                <ListItemButton
                    onClick={() => setAnalyticsOpen(!analyticsOpen)}
                    sx={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '12px',
                        transition: 'all .6s ease',
                        '&:hover': {
                            backgroundColor: 'background.paper2',
                            '& .MuiListItemIcon-root': {
                                color: 'text.primary',
                            },

                            '& .MuiTypography-root': {
                                color: 'text.primary',
                            },
                        },
                        '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.main',
                            },
                            '& .MuiListItemIcon-root': {
                                color: 'text.primary',
                            },

                            '& .MuiTypography-root': {
                                color: 'text.primary',
                            },
                        },
                        '&:active': {
                            transform: 'scale(0.98)',
                            backgroundColor: 'primary.main',
                            '& .MuiListItemIcon-root': {
                                color: 'text.primary',
                            },

                            '& .MuiTypography-root': {
                                color: 'text.primary',
                            },
                        },
                        px: 2,
                    }}
                >
                    <ListItemIcon sx={{ minWidth: '40px', color: 'text.secondary' }}><BarChartOutlined /></ListItemIcon>
                    <ListItemText primary='Analytics' slotProps={{
                        primary: {
                            sx: {
                                fontSize: 14,
                                color: 'text.secondary',
                            },
                        },
                    }} />
                    {analyticsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={analyticsOpen} timeout="auto" unmountOnExit>
                    <List component="div" sx={{
                        ml: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}>
                        {analyticsMenuItems.map(({ text, icon, path }) => (
                            <ListItemButton
                                key={text}
                                component={Link}
                                to={path}
                                selected={location.pathname === path}
                                sx={{
                                    width: '95%',
                                    height: '48px',
                                    borderRadius: '12px',
                                    transition: 'all .6s ease',
                                    '&:hover': {
                                        backgroundColor: 'background.paper2',
                                        '& .MuiListItemIcon-root': {
                                            color: 'text.primary',
                                        },

                                        '& .MuiTypography-root': {
                                            color: 'text.primary',
                                        },
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'primary.main',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'text.primary',
                                        },

                                        '& .MuiTypography-root': {
                                            color: 'text.primary',
                                        },
                                    },
                                    '&:active': {
                                        transform: 'scale(0.98)',
                                        backgroundColor: 'primary.main',
                                        '& .MuiListItemIcon-root': {
                                            color: 'text.primary',
                                        },

                                        '& .MuiTypography-root': {
                                            color: 'text.primary',
                                        },
                                    },
                                    px: 2,
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: '40px', color: 'text.secondary' }}>{icon}</ListItemIcon>
                                <ListItemText primary={text} slotProps={{
                                    primary: {
                                        sx: {
                                            fontSize: 14,
                                            color: 'text.secondary',
                                        },
                                    },
                                }} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
            </List>
        </Drawer>
    )
}

export default Sidebar