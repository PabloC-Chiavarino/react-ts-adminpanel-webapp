import { Add } from "@mui/icons-material"
import { Button, Typography } from "@mui/material"

const AddBtn = ({ onClick, text }: { onClick: () => void, text: string }) => {
    return (
        <Button
            onClick={onClick}
            startIcon={<Add />}
            sx={{
                borderRadius: '12px',
                backgroundColor: 'tertiary.main',
                color: 'background.paper2',
                display: 'flex',
                gap: 1,
                py: '0.75rem',
                px: '1.5rem',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&.MuiButton-startIcon': {
                    marginRight: '0.5rem',
                },
                '&:hover': {
                    backgroundColor: 'primary.main',
                    color: '#ffffff',
                },
                '&:active': {
                    transform: 'scale(0.97)',
                },
                '&:hover svg': {
                    transform: 'rotate(90deg)',
                },
            }}
        >
            <Typography
                sx={{
                    fontWeight: 500,
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '15px',
                    whiteSpace: 'nowrap',
                }}
            >
                Create New {text}
            </Typography>
        </Button>
    )
}

export default AddBtn