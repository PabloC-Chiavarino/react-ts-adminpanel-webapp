import { Menu, MenuItem, ListItemIcon, Typography, Divider, Box } from '@mui/material'
import { Logout, PersonOutlined } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ anchorEl, open, onClose, }: { anchorEl: HTMLElement | null; open: boolean; onClose: () => void }) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

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
                        borderRadius: 4,
                        mt: 3,
                        width: '15vw',
                        overflow: 'visible',
                        bgcolor: 'background.paper2',
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
                            bgcolor: 'background.paper2',
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
            <Box sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Typography sx={{ color: 'text.primary', fontSize: '2rem' }}>
                        {user?.username.slice(0, 1).toUpperCase()}
                    </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {user?.username
                        ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
                        : ""}
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
                    navigate('/profile')
                    onClose()
                }}
                sx={{ color: 'text.primary', py: 2.25 }}
            >
                <ListItemIcon>
                    <PersonOutlined fontSize="small" sx={{ color: 'text.primary' }} />
                </ListItemIcon>
                Mi cuenta
            </MenuItem>

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
