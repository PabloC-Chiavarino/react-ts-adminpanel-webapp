import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material'

const ConfirmDialog = ({ open, onConfirm, onCancel }: { open: boolean, onConfirm: () => void, onCancel: () => void }) => {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth='sm' fullWidth PaperProps={{
            sx: { pb: 1.5, borderRadius: '16px' }
        }}>
            <DialogTitle>Are you sure you want to procced?</DialogTitle>
            <DialogActions sx={{ pr: 3 }}>
                <Button variant='contained' onClick={onConfirm}>Yes</Button>
                <Button variant='contained' onClick={onCancel}>No</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog