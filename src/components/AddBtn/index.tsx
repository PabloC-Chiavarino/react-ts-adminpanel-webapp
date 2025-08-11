import { IconButton } from '@mui/material'
import { AddRounded } from '@mui/icons-material'

const AddBtn = ({ onClick }: { onClick: () => void }) => {
    return (
        <IconButton onClick={onClick} sx={{ '&:hover': { color: 'var(--primary)'} }}>
            <AddRounded sx={{ fontSize: 50 }} />
        </IconButton>
    )
}

export default AddBtn