import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: { xs: 1.5, sm: 2 },
        }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '60px', sm: '80px' }, fontWeight: 800, color: 'primary.main' }}>
                404
            </Typography>
            <Typography sx={{ fontSize: { xs: '16px', sm: '18px' }, color: 'text.secondary', mb: 2 }}>
                Page not found
            </Typography>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
            </Button>
        </Box>
    )
}

export default NotFound
