import { AppBar, Toolbar, Box, IconButton, Avatar, InputBase } from '@mui/material'
import { Brightness4, Notifications, Settings, Search } from '@mui/icons-material'

const Topbar = () => {

    const drawerWidth = 240

    return(
        <AppBar 
            position='fixed'
            sx={{
                width: `calc(100% - ${drawerWidth}px)`,
            }}
            >
            <Toolbar 
                sx={{ 
                    justifyContent: 'space-between',
                    backgroundColor: '',
                }}
                >
                <Box 
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        width: '215px',
                        height: '35px',
                        backgroundColor: '#fff',
                        padding: '0px 8px 0px 16px',
                    }}
                    >
                    <InputBase placeholder='Search...' />
                    <IconButton>
                        <Search />
                    </IconButton>
                </Box>
                <Box>
                    <IconButton>
                        <Brightness4 />
                    </IconButton>
                    <IconButton>
                        <Notifications />
                    </IconButton>
                    <IconButton>
                        <Settings />
                    </IconButton>
                    <IconButton>
                        <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Topbar