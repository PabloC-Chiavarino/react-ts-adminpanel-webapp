import { Menu, MenuItem, ListItemIcon, Typography, Divider, Box } from '@mui/material'
import { Logout } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext';

const UserMenu = ({ anchorEl, open, onClose, }: { anchorEl: HTMLElement | null; open: boolean; onClose: () => void }) => {
    const { user, logout } = useAuth()

    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={onClose}
            onClick={onClose}
            slotProps={{
                list: {
                    sx: {
                        py: 0,
                    },
                },
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
                    {user?.username}
                </Typography>
            </Box>

            <Divider
                sx={{
                    marginTop: '0px !important',
                    marginBottom: '0px !important',
                }}
            />

            <MenuItem
                onClick={() => {
                    logout()
                    onClose()
                }}
                sx={{ color: 'error.main', py: 2.25 }}
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
