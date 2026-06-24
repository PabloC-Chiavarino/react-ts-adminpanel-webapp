import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Collapse, useTheme, useMediaQuery } from '@mui/material'
import logo from '../../assets/Icons/logo.png'
import { useSidebar } from '../../context/SidebarContext'
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

const DRAWER_WIDTH = 256
const COLLAPSED_WIDTH = 72

export const Sidebar = () => {
    const [analyticsOpen, setAnalyticsOpen] = useState(false)
    const location = useLocation()
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
    const { mobileOpen, collapsed, setMobileOpen } = useSidebar()

    const isCollapsed = !isMdDown && collapsed

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

    const drawerContent = (
        <Box sx={{ height: '100%', overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                marginLeft: isCollapsed ? 0 : 4,
                marginTop: 4,
                gap: 1,
                px: isCollapsed ? 0 : undefined,
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
                    flexShrink: 0,
                }}>
                    <img src={logo} alt="Logo" style={{
                        width: '22px',
                        height: '22px',
                        fill: 'background.default'
                    }} />
                </Box>
                {!isCollapsed && (
                    <Typography
                        variant='h6'
                        sx={{
                            fontSize: 20,
                            fontWeight: '700',
                            color: 'tertiary.main',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Nexo
                    </Typography>
                )}
            </Box>
            <List
                component='nav'
                sx={{
                    mt: 6,
                    ml: isCollapsed ? 0.5 : 1,
                    mr: isCollapsed ? 0.5 : 1,
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
                        onClick={() => isMdDown && setMobileOpen(false)}
                        sx={{
                            width: '100%',
                            height: '48px',
                            borderRadius: '12px',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
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
                            px: isCollapsed ? 0 : 2,
                            gap: -.5,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: '40px', color: 'text.secondary', justifyContent: 'center' }}>{icon}</ListItemIcon>
                        {!isCollapsed && (
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
                        )}
                    </ListItemButton>
                ))}

                <ListItemButton
                    onClick={() => setAnalyticsOpen(!analyticsOpen)}
                    sx={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '12px',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
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
                        px: isCollapsed ? 0 : 2,
                    }}
                >
                    <ListItemIcon sx={{ minWidth: '40px', color: 'text.secondary', justifyContent: 'center' }}><BarChartOutlined /></ListItemIcon>
                    {!isCollapsed && (
                        <>
                            <ListItemText primary='Analytics' slotProps={{
                                primary: {
                                    sx: {
                                        fontSize: 14,
                                        color: 'text.secondary',
                                    },
                                },
                            }} />
                            {analyticsOpen ? <ExpandLess /> : <ExpandMore />}
                        </>
                    )}
                </ListItemButton>
                {!isCollapsed && (
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
                                    onClick={() => isMdDown && setMobileOpen(false)}
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
                )}
            </List>
        </Box>
    )

    if (isMdDown) {
        return (
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        borderRight: 'none',
                        width: DRAWER_WIDTH,
                        backgroundColor: 'background.default',
                        boxShadow: isDark
                            ? '40px 0 60px -15px rgba(178, 161, 255, 0.06)'
                            : '4px 0 24px -4px rgba(0, 0, 0, 0.07)',
                        zIndex: 1500,
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        )
    }

    return (
        <Drawer variant='permanent' className="dash-sidebar" sx={{
            '& .MuiDrawer-paper': {
                borderRight: 'none',
                width: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
                transition: 'width 0.3s ease',
                backgroundColor: 'background.default',
                boxShadow: isDark
                    ? '40px 0 60px -15px rgba(178, 161, 255, 0.06)'
                    : '4px 0 24px -4px rgba(0, 0, 0, 0.07)',
                zIndex: 1500,
                overflowX: 'hidden',
            },
        }}>
            {drawerContent}
        </Drawer>
    )
}

export default Sidebar
