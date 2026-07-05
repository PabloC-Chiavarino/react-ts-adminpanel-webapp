import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import type { Task } from '../../types'
import { IconButton, Typography, Box } from '@mui/material'
import { EditOutlined, DeleteOutlined } from '@mui/icons-material'
import { useMediaQuery, useTheme } from '@mui/material'

const DraggableTask = ({
    task,
    handleEdit,
    handleDelete,
}: {
    task: Task;
    handleEdit?: (taskID: number) => void;
    handleDelete?: (taskID: number) => void;
}) => {

    const theme = useTheme()
    const isTouchDevice = useMediaQuery(theme.breakpoints.down('lg'))
    const [expanded, setExpanded] = useState(false)

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.id
    })

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 0.4, sm: 0.6, md: 0.7, lg: 0.9 },
                flexShrink: 1,
                width: '100%',
                px: { xs: 1, sm: 1.6, md: 1.8, lg: 2.2 },
                pt: { xs: 1, sm: 1.6, md: 1.8, lg: 2.2 },
                pb: { xs: 1.8, sm: 2.5, md: 3, lg: 3.5 },
                border: "1px solid transparent",
                borderRadius: '14px',
                justifyContent: 'space-between',
                opacity: isDragging ? 0.5 : 1,
                backgroundColor: task.completed === false ? 'background.paper2' : 'background.paper',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&:hover': {
                    cursor: 'grab',
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 8px 24px rgba(0,0,0,0.25)',
                    backgroundColor: 'background.alt',
                    border: "1px solid",
                    borderColor: task.priority === 'high' ? 'priorityStyles.high.bg' : task.priority === 'medium' ? 'priorityStyles.medium.bg' : 'priorityStyles.low.bg'
                },
                '&:hover .task-actions': {
                    opacity: 1,
                }
            }}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            onDoubleClick={() => setExpanded(!expanded)}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative', mb: 1, overflow: 'hidden' }}>
                <Box sx={{ width: '6px', height: { xs: '14px', sm: '16px', md: '18px', lg: '22px' }, borderRadius: '9999px', backgroundColor: task.completed ? 'text.disabled' : task.priority === 'high' ? 'priorityStyles.high.color' : task.priority === 'medium' ? 'priorityStyles.medium.color' : 'priorityStyles.low.color', flexShrink: 0 }} />
                <Typography sx={{ fontSize: { xs: '8px', sm: '9px', md: '10px', lg: '10px' }, fontWeight: 700, color: task.completed ? 'text.disabled' : task.priority === 'high' ? 'priorityStyles.high.color' : task.priority === 'medium' ? 'priorityStyles.medium.color' : 'priorityStyles.low.color', whiteSpace: 'nowrap' }}>{task.priority.toUpperCase()} PRIORITY</Typography>
                <Box className='task-actions' sx={{ display: 'flex', gap: 0, opacity: isTouchDevice ? 1 : 0, right: 0, position: 'absolute', transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    {!task.completed && <IconButton
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => { handleEdit?.(task.id) }}
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
                    </IconButton>}
                    <IconButton
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => { handleDelete?.(task.id) }}
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
                            transform: 'translateY(0px)',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                color: 'text.primary',
                                transform: 'translateY(-2px)'
                            }
                        }}
                        />
                    </IconButton>
                </Box>
            </Box>
            <Typography className="dash-item-title" sx={{ fontSize: { xs: '13px', sm: '14px', md: '15px', lg: '17px' }, textAlign: 'left', fontWeight: "bold", textDecoration: task.completed ? "line-through" : "none", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {task.title}
            </Typography>
            <Typography variant="body1" className="dash-item-desc" sx={{ fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '13.5px' }, textAlign: 'left', fontStyle: 'oblique', color: 'text.secondary', whiteSpace: expanded ? 'normal' : { xs: 'nowrap', sm: 'normal' }, wordBreak: expanded ? 'break-word' : 'normal', overflow: expanded ? 'visible' : 'hidden', textOverflow: expanded ? 'clip' : 'ellipsis' }}>{task.description}</Typography>
        </Box>
    )
}

export default DraggableTask