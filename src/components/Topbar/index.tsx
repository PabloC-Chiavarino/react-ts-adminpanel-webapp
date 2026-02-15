import { SearchBox, UserMenu } from '../../components'
import { AppBar, Toolbar, Box, IconButton, Avatar } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useColorMode } from '../../context/ColorModeContext'
import { useState } from 'react'

const Topbar = () => {
    const { mode, toggleColorMode } = useColorMode()
    const drawerWidth = 240

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

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
        >
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    backgroundColor: 'background.default',
                    transition: 'background-color 0.25s ease',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <SearchBox />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={toggleColorMode} >
                        {mode === 'dark' ? <Brightness4 /> : <Brightness7 />}
                    </IconButton>
                    <IconButton
                        onClick={handleClick}
                        size='small'
                        sx={{ ml: 1 }}
                    >
                        <Avatar
                            sx={{ width: 32, height: 32 }}
                            alt='admin'
                            src='/static/images/avatar/1.jpg'
                        />
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