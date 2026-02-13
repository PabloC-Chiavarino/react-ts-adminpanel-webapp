import type { Event } from '../../types'
import { Collapse, IconButton, Paper, Typography, styled } from '@mui/material'
import { Edit, Delete, AddCircle } from '@mui/icons-material'

const DraggableEvent = ({
    event,
    handleEdit,
    handleDelete,
    optionsEventID,
    handleOptionsEventID,
}: {
    event: Event;
    handleEdit?: (EventID: number) => void;
    handleDelete?: (EventID: number) => void;
    optionsEventID?: number | null;
    handleOptionsEventID?: (EventID: number | null) => void,
}) => {
    const DraggableEvent = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
        textAlign: 'center',
        flexShrink: 1,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
        },
    }))
    return (
        <DraggableEvent
            data-event={JSON.stringify({
                id: event.id,
                title: event.title,
                description: event.description,
                category: event.category
            })}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                transition: 'opacity 0.25s ease, background-color 0.25s ease',
                cursor: 'grab',
                '&:hover': {
                    color: 'primary.contrastText'
                },
                '&:hover .MuiIconButton-root': {
                    opacity: 1,
                    backgroundColor: 'transparent',
                    color: 'primary.contrastText'
                },
                boxShadow: '2px 2px 0px 1px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.05)',
            }}
            className='draggableEl'
        >
            <IconButton
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    opacity: 0,
                    transition: 'color 0.25s ease',
                    '&:hover': {
                        color: 'black'
                    }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={optionsEventID !== event.id ? () => { handleOptionsEventID?.(event.id) } : () => { handleOptionsEventID?.(null) }}
            >
                <AddCircle sx={{ fontSize: 22 }} />
            </IconButton>
            <Collapse in={optionsEventID === event.id} timeout={200} unmountOnExit>
                <IconButton
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => { handleEdit?.(event.id) }}
                >
                    <Edit sx={{ fontSize: 27, '&:hover': { color: 'black' } }} />
                </IconButton>
                <IconButton
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => { handleDelete?.(event.id) }}
                >
                    <Delete sx={{
                        fontSize: 27,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            color: 'black'
                        }
                    }}
                    />
                </IconButton>
            </Collapse>
            <Typography variant="h6">{event.title}</Typography>
            <Typography variant="body1">{event.description}</Typography>
        </DraggableEvent>
    )
}

export default DraggableEvent