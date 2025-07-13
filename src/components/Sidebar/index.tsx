import { Link, useLocation } from 'react-router-dom'
import { Toolbar, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Dashboard, People, Inventory2 } from '@mui/icons-material'

export const Sidebar = () => {

    const location = useLocation()

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/' },
        { text: 'Products', icon: <Inventory2 />, path: '/products' },
        { text: 'Clients/Users', icon: <People />, path: '/clients' },
    ]

    const drawerWidth = 240

    return (
        <Drawer variant='permanent'>
            <Toolbar />
            <List component='nav' sx={{ mt: 8, width: `${drawerWidth}px` }}>
                {menuItems.map(({ text, icon, path }) => (
                    <ListItemButton 
                        key={text}
                        component={Link}
                        to={path}
                        selected = {location.pathname === path}
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