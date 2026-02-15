import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Container, Box, TextField, Button, Typography } from '@mui/material'

const Login = () => {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (user === 'admin' && password === 'admin') {
            login({ id: '1', username: user })
        } else {
            alert('Usuario o contraseña incorrectos')
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