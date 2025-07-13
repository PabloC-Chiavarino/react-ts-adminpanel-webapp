import { AppBar, Toolbar, Typography, Box, IconButton, Avatar } from '@mui/material'
import { Brightness4, Notifications, Settings } from '@mui/icons-material'

const Topbar = () => {
    return(
        <AppBar 
            position='fixed' 
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant='h6' component='div'>
                    AdminAssistant
                </Typography>
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