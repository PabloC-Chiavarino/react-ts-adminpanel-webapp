import { useDraggable } from '@dnd-kit/core'
import type { Task } from '../../types'
import { IconButton, Typography, Box } from '@mui/material'
import { EditOutlined, DeleteOutlined } from '@mui/icons-material'

const DraggableTask = ({
    task,
    handleEdit,
    handleDelete,
}: {
    task: Task;
    handleEdit?: (taskID: number) => void;
    handleDelete?: (taskID: number) => void;
}) => {

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.id
    })

    return (
        <Box
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
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative', mb: 1 }}>
                <Box sx={{ width: '6px', height: '25px', borderRadius: '9999px', backgroundColor: task.completed ? 'text.disabled' : task.priority === 'high' ? 'priorityStyles.high.color' : task.priority === 'medium' ? 'priorityStyles.medium.color' : 'priorityStyles.low.color' }} />
                <Typography sx={{ fontSize: "10px", fontWeight: 700, color: task.completed ? 'text.disabled' : task.priority === 'high' ? 'priorityStyles.high.color' : task.priority === 'medium' ? 'priorityStyles.medium.color' : 'priorityStyles.low.color' }}>{task.priority.toUpperCase()} PRIORITY</Typography>
                <Box className='task-actions' sx={{ display: 'flex', gap: 0, opacity: 0, right: 0, position: 'absolute', transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
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
            <Typography sx={{ fontSize: "18px", textAlign: 'left', fontWeight: "bold", textDecoration: task.completed ? "line-through" : "none" }}>
                {task.title}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "14px", textAlign: 'left', fontStyle: 'oblique', color: 'text.secondary' }}>{task.description}</Typography>
        </Box>
    )
}

export default DraggableTask