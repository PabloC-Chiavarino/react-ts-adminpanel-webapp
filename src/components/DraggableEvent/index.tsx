import { memo, useMemo } from "react"
import type { Event } from '../../types'
import { IconButton, Box, Typography } from '@mui/material'
import { EditOutlined, DeleteOutlined } from '@mui/icons-material'

const DraggableEvent = memo(({
    event,
    handleEdit,
    handleDelete,
    isDragging,
}: {
    event: Event;
    handleEdit?: (EventID: number) => void;
    handleDelete?: (EventID: number) => void;
    isDragging: boolean;
}) => {

    const dataEvent = useMemo(() => JSON.stringify({
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.category
    }), [event.id, event.title, event.description, event.category])

    // console.log('id:', event.id, '| category:', event.category, '| type:', typeof event.category) debug
    return (
        <Box
            className='draggableEl'
            data-event={dataEvent}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                flexShrink: 1,
                px: 2.5,
                pt: 2.7,
                pb: 4,
                border: "1px solid transparent",
                borderRadius: '14px',
                justifyContent: 'space-between',
                backgroundColor: 'background.paper2',
                transition: 'transform, box-shadow, background-color, border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&:hover': !isDragging ? {
                    cursor: 'grab',
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 8px 24px rgba(0,0,0,0.25)',
                    backgroundColor: 'background.alt',
                    border: "1px solid",
                    borderColor: event.category === 'meeting'
                        ? 'categoryStyles.meeting.color'
                        : event.category === 'design'
                            ? 'categoryStyles.design.color'
                            : event.category === 'development'
                                ? 'categoryStyles.development.color'
                                : event.category === 'release'
                                    ? 'categoryStyles.release.color'
                                    : 'categoryStyles.review.color'
                } : {},
                '&:hover .task-actions': !isDragging ? {
                    opacity: 1,
                } : {},
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative', mb: 1 }}>
                <Box sx={{ width: '6px', height: '25px', borderRadius: '9999px', backgroundColor: event.category === 'review' ? 'categoryStyles.review.color' : event.category === 'meeting' ? 'categoryStyles.meeting.color' : event.category === 'design' ? 'categoryStyles.design.color' : event.category === 'development' ? 'categoryStyles.development.color' : 'categoryStyles.release.color' }} />
                <Typography sx={{ fontSize: "10px", fontWeight: 700, color: event.category === 'review' ? 'categoryStyles.review.color' : event.category === 'meeting' ? 'categoryStyles.meeting.color' : event.category === 'design' ? 'categoryStyles.design.color' : event.category === 'development' ? 'categoryStyles.development.color' : 'categoryStyles.release.color' }}>{event.category.toUpperCase()}</Typography>
                <Box className='task-actions' sx={{ display: 'flex', gap: 0, opacity: 0, right: 0, position: 'absolute', transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <IconButton
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => { handleEdit?.(event.id) }}
                        sx={{
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                backgroundColor: 'transparent',
                            }
                        }}
                    >
                        <EditOutlined sx={{
                            width: 22,
                            height: 22,
                            color: 'text.secondary',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'translateY(0px)',
                            '&:hover': {
                                color: 'text.primary',
                                transform: 'translateY(-2px)'
                            }
                        }}
                        />
                    </IconButton>
                    <IconButton
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => { handleDelete?.(event.id) }}
                        sx={{
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                backgroundColor: 'transparent',
                            }
                        }}
                    >
                        <DeleteOutlined sx={{
                            width: 22,
                            height: 22,
                            color: 'text.secondary',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'translateY(0px)',
                            '&:hover': {
                                color: 'text.primary',
                                transform: 'translateY(-2px)'
                            }
                        }}
                        />
                    </IconButton>
                </Box>
            </Box>
            <Typography sx={{ fontSize: "18px", textAlign: 'left', fontWeight: "bold" }}>
                {event.title}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "14px", textAlign: 'left', fontStyle: 'oblique', color: 'text.secondary' }}>{event.description}</Typography>
        </Box>
    )
})

export default DraggableEvent