import { Outlet } from 'react-router-dom'
import { Box, Toolbar } from '@mui/material'
import { Sidebar, Topbar } from '../../components'

const Layout = () => {

    const drawerWidth = 240
    const topBarHeight = 64

    return (
        <Box sx={{ display: 'flex' }}>
            <Topbar />
            <Sidebar />
            <Box 
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: `calc(100% - ${drawerWidth}px)`,
                    height: `calc(100vh - ${topBarHeight}px)`,
                    marginLeft: `${drawerWidth}px`,
                    paddingTop: `${topBarHeight}px`,
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    )
}

export default Layout