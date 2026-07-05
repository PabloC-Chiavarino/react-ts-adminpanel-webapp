import { Add } from "@mui/icons-material"
import { Button, Typography } from "@mui/material"

const AddBtn = ({ onClick, text }: { onClick: () => void, text: string }) => {
    return (
        <Button
            onClick={onClick}
            startIcon={<Add />}
            sx={{
                borderRadius: { xs: '6px', sm: '8px', md: '10px', lg: '10px', xl: '12px' },
                backgroundColor: 'tertiary.main',
                color: 'background.paper2',
                display: 'flex',
                gap: 1,
                py: { xs: '0.3rem', sm: '0.4rem', md: '0.5rem', lg: '0.55rem', xl: '0.75rem' },
                px: { xs: '0.7rem', sm: '0.9rem', md: '1rem', lg: '1.1rem', xl: '1.5rem' },
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&.MuiButton-startIcon': {
                    marginRight: '0.5rem',
                },
                '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'common.white',
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
                className="dash-btn-label"
                sx={{
                    fontWeight: 500,
                    fontFamily: '"Inter", sans-serif',
                    fontSize: { xs: '11px', sm: '12px', md: '13px', lg: '13px', xl: '15px' },
                    whiteSpace: 'nowrap',
                }}
            >
                Create New {text}
            </Typography>
        </Button>
    )
}

export default AddBtn