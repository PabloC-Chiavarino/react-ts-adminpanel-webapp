import { Outlet, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import { Sidebar, Topbar } from '../../components'
import '../../index.css'

const Layout = () => {

    const { pathname } = useLocation()

    const drawerWidth = 256
    const topBarHeight = 64

    return (
        <Box
            className='fade-in'
            sx={{
                display: 'flex',
                position: 'relative',
            }}
        >
            <Topbar />
            <Sidebar />
            <Box
                key={pathname}
                className='fade-in'
                component="main"
                sx={{
                    flexDirection: 'column',
                    display: 'flex',
                    flexGrow: 1,
                    height: `calc(100vh - ${topBarHeight}px)`,
                    width: `calc(100vw - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    mt: `${topBarHeight}px`,
                    px: 5,
                    pt: 6,
                    pb: 2,
                    alignItems: 'center',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}

export default Layout