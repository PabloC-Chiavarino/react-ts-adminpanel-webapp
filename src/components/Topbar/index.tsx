import { SearchBox } from '../../components'
import { AppBar, Toolbar, Box, IconButton, Avatar } from '@mui/material'
import { Brightness4, Brightness7, Notifications, Settings } from '@mui/icons-material'
import { useColorMode } from '../../context/ColorModeContext'

const Topbar = () => {
    const { mode, toggleColorMode } = useColorMode()
    const drawerWidth = 240

    return (
        <AppBar
            position='fixed'
            sx={{
                width: `calc(100% - ${drawerWidth}px)`,
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
                <Box>
                    <IconButton onClick={toggleColorMode}>
                        {mode === 'dark' ? <Brightness4 /> : <Brightness7 />}
                    </IconButton>
                    <IconButton>
                        <Notifications />
                    </IconButton>
                    <IconButton>
                        <Settings />
                    </IconButton>
                    <IconButton>
                        <Avatar alt='admin' src='/static/images/avatar/1.jpg' />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar >
    )
}

export default Topbar