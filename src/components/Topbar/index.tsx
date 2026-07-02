import { useAuth } from '../../context/AuthContext'
import { SearchBox, UserMenu } from '../../components'
import { AppBar, Toolbar, Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Brightness4, Brightness7, Menu } from '@mui/icons-material'
import { useColorMode } from '../../context/ColorModeContext'
import { useSidebar } from '../../context/SidebarContext'
import { useState } from 'react'

const DRAWER_WIDTH = 256
const COLLAPSED_WIDTH = 72

const Topbar = () => {
    const { mode, toggleColorMode } = useColorMode()
    const theme = useTheme()
    const isMdDown = useMediaQuery(theme.breakpoints.down('lg'))
    const { collapsed, toggleMobile, toggleCollapsed } = useSidebar()
    const isCollapsed = !isMdDown && collapsed
    const sidebarWidth = isMdDown ? 0 : (isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const { user } = useAuth()

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <AppBar
            position='fixed'
            sx={{
                width: `calc(100% - ${sidebarWidth}px)`,
                zIndex: (theme) => theme.zIndex.drawer + 1,
                transition: 'width 0.3s ease',
            }}
            elevation={0}
        >
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    backgroundColor: 'background.default',
                    transition: 'background-color 0.2s ease',
                    borderBottom: '1px solid',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    {(isMdDown || isCollapsed) && (
                        <IconButton
                            onClick={isMdDown ? toggleMobile : toggleCollapsed}
                            sx={{
                                color: 'text.secondary',
                                '&:hover': { backgroundColor: 'background.paper2' },
                            }}
                        >
                            <Menu />
                        </IconButton>
                    )}
                    <Box sx={{ flex: 1, maxWidth: { sm: 280, md: 320, lg: 360 } }}>
                        <SearchBox />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                    <IconButton onClick={toggleColorMode} sx={{
                        width: { xs: '36px', sm: '32px' },
                        height: { xs: '36px', sm: '32px' },
                        p: { xs: 1, sm: 2.5 },
                        color: 'text.secondary',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: 'background.paper2',
                            transform: 'scale(1.05)',
                        },
                    }} >
                        {mode === 'dark' ? <Brightness4 /> : <Brightness7 />}
                    </IconButton>
                    <IconButton
                        onClick={handleClick}
                        sx={{
                            ml: 1,
                            p: 0.5,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'background.default',
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        <Box sx={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Typography sx={{ color: 'text.primary' }}>
                                {user?.username.slice(0, 1).toUpperCase()}
                            </Typography>
                        </Box>
                    </IconButton>
                    <UserMenu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    />
                </Box>
            </Toolbar>
        </AppBar >
    )
}

export default Topbar
