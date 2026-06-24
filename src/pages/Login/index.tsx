import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Container, Box, TextField, Button, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { API_BASE_URL } from '../../config'

const Login = () => {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()
    const { enqueueSnackbar } = useSnackbar()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user, password }),
            })

            if (!response.ok) {
                enqueueSnackbar('Usuario o contraseña incorrectos', { variant: 'error' })
                return
            }

            const data = await response.json()
            login(data.user)

        } catch (error) {
            enqueueSnackbar('Error al iniciar sesión', { variant: 'error' })
        }
    }

    return (
        <Container component="main" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '35%',
                    transform: 'translateY(-30%)'
                }}
            >
                <Typography variant="h1" fontSize={34} textAlign="center" mb={5}>
                    Nexo
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        size='small'
                        required
                        fullWidth
                        id="user"
                        label="User"
                        name="user"
                        autoFocus
                        autoComplete='new-password'
                        value={user}
                        placeholder='admin'
                        onChange={(e) => setUser(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        size='small'
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete='new-password'
                        value={password}
                        placeholder='admin'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary', fontSize: '13px' }}>
                        user: admin · password: admin
                    </Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 6, height: '48px', backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'secondary.main' } }}
                    >
                        Iniciar Sesión
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export default Login