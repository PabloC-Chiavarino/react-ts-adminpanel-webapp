import { useAuth } from '../../context/AuthContext'
import { SearchBox, UserMenu } from '../../components'
import { AppBar, Toolbar, Box, IconButton, Typography } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useColorMode } from '../../context/ColorModeContext'
import { useState } from 'react'

const Topbar = () => {
    const { mode, toggleColorMode } = useColorMode()
    const drawerWidth = 256

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
                width: `calc(100% - ${drawerWidth}px)`,
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            elevation={0}
        >
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    backgroundColor: 'background.default',
                    transition: 'background-color 0.2s ease',
                    borderBottom: '1px solid rgba(53, 53, 64, 0.4)',
                }}
            >
                <SearchBox />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={toggleColorMode} sx={{
                        width: '32px',
                        height: '32px',
                        p: 2.5,
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