import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material'

const ConfirmDialog = ({ open, onConfirm, onCancel }: { open: boolean, onConfirm: () => void, onCancel: () => void }) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Are you sure you want to procced?</DialogTitle>
            <DialogActions>
                <Button variant='contained' onClick={onConfirm}>Yes</Button>
                <Button variant='contained' onClick={onCancel}>No</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog