import { Outlet, useLocation } from 'react-router-dom'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { Sidebar, Topbar } from '../../components'
import { useSidebar } from '../../context/SidebarContext'
import '../../index.css'

const DRAWER_WIDTH = 256
const COLLAPSED_WIDTH = 72

const Layout = () => {
    const { pathname } = useLocation()
    const theme = useTheme()
    const isMdDown = useMediaQuery(theme.breakpoints.down('lg'))
    const isXsDown = useMediaQuery(theme.breakpoints.down('sm'))
    const { collapsed } = useSidebar()
    const isCollapsed = !isMdDown && collapsed
    const topbarHeight = isXsDown ? 52 : 64

    const sidebarWidth = isMdDown ? 0 : (isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH)

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
                className='fade-in dash-main-content'
                component="main"
                sx={{
                    flexDirection: 'column',
                    display: 'flex',
                    flexGrow: 1,
                    height: `calc(100vh - ${topbarHeight}px)`,
                    width: `calc(100% - ${sidebarWidth}px)`,
                    ml: `${sidebarWidth}px`,
                    mt: `${topbarHeight}px`,
                    px: { xs: 1.5, sm: 3, md: 5 },
                    pt: { xs: 2, sm: 4, md: 6 },
                    pb: 'calc(8px + env(safe-area-inset-bottom))',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    minWidth: 0,
                    transition: 'width 0.3s ease, margin-left 0.3s ease',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}

export default Layout
