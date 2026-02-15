import {
    Menu,
    MenuItem,
    ListItemIcon,
    Typography,
    Divider,
    Box,
} from '@mui/material'
import {
    Person,
    Settings,
    Logout,
} from '@mui/icons-material'

const UserMenu = ({
    anchorEl,
    open,
    onClose,
}: {
    anchorEl: HTMLElement | null
    open: boolean
    onClose: () => void
}) => {
    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={onClose}
            onClick={onClose}
            slotProps={{
                paper: {
                    elevation: 10,
                    sx: {
                        mt: 3,
                        width: 220,
                        overflow: 'visible',
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.default',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            borderTop: '1px solid',
                            borderLeft: '1px solid',
                            borderColor: 'divider',
                        },
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    Admin User
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    admin@example.com
                </Typography>
            </Box>

            <Divider />

            <MenuItem onClick={onClose}>
                <ListItemIcon>
                    <Person fontSize="small" />
                </ListItemIcon>
                Mi Perfil
            </MenuItem>

            <MenuItem onClick={onClose}>
                <ListItemIcon>
                    <Settings fontSize="small" />
                </ListItemIcon>
                Ajustes
            </MenuItem>

            <Divider />

            <MenuItem
                onClick={() => {
                    console.log('Logout clicked')
                    onClose()
                }}
                sx={{ color: 'error.main' }}
            >
                <ListItemIcon>
                    <Logout fontSize="small" color="error" />
                </ListItemIcon>
                Cerrar sesión
            </MenuItem>
        </Menu>
    )
}

export default UserMenu
