import { Outlet, useLocation } from 'react-router-dom'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { Sidebar, Topbar } from '../../components'
import { useSidebar } from '../../context/SidebarContext'
import '../../index.css'

const DRAWER_WIDTH = 256
const COLLAPSED_WIDTH = 72
const TOPBAR_HEIGHT = 64

const Layout = () => {
    const { pathname } = useLocation()
    const theme = useTheme()
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
    const { collapsed } = useSidebar()
    const isCollapsed = !isMdDown && collapsed

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
                    height: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
                    width: `calc(100% - ${sidebarWidth}px)`,
                    ml: `${sidebarWidth}px`,
                    mt: `${TOPBAR_HEIGHT}px`,
                    px: { xs: 2, sm: 3, md: 5 },
                    pt: { xs: 2, sm: 4, md: 6 },
                    pb: 'calc(8px + env(safe-area-inset-bottom))',
                    overflowY: 'auto',
                    transition: 'width 0.3s ease, margin-left 0.3s ease',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}

export default Layout
