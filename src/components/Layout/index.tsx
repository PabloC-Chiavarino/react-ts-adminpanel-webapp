import { Outlet, useLocation } from 'react-router-dom'
import { Box, Toolbar } from '@mui/material'
import { Sidebar, Topbar } from '../../components'
import '../../index.css'

const Layout = () => {

    const { pathname } = useLocation()

    const drawerWidth = 240
    const topBarHeight = 35

    return (
        <Box className='fade-in' sx={{ display: 'flex' }}>
            <Topbar />
            <Sidebar />
            <Box
                key={pathname}
                className='fade-in'
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: `calc(100% - ${drawerWidth}px)`,
                    height: `calc(100dvh - ${topBarHeight}px)`,
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