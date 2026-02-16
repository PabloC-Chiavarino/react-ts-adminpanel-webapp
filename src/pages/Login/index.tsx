import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Container, Box, TextField, Button, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'

const Login = () => {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()
    const { enqueueSnackbar } = useSnackbar()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const response = await fetch('https://mock-data-api-vntk.onrender.com/login', {
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
        <Container component="main" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '40%',
                }}
            >
                <Typography variant="h4" textAlign="center" mb={3}>
                    Admin Panel
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="user"
                        label="User"
                        name="user"
                        autoFocus
                        autoComplete='new-password'
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete='new-password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 6, mb: 2, height: '50px' }}
                    >
                        Iniciar Sesión
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export default Login