import { useDraggable } from '@dnd-kit/core'
import type { Task } from '../../types'
import { Collapse, IconButton, Paper, Typography, styled } from '@mui/material'
import { Edit, Delete, AddCircle } from '@mui/icons-material'

const DraggableTask = ({
    task,
    handleEdit,
    handleDelete,
    optionsTaskID,
    handleOptionsTaskID
}: {
    task: Task;
    handleEdit?: (taskID: number) => void;
    handleDelete?: (taskID: number) => void;
    optionsTaskID?: number | null;
    handleOptionsTaskID?: (taskID: number | null) => void
}) => {

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.id
    })

    const TaskItem = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
        textAlign: 'center',
        flexShrink: 1,
        boxShadow: '2px 2px 0px 1px rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.05)',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            cursor: 'grab',
        },
    }))

    return (
        <TaskItem
            sx={{
                opacity: isDragging ? 0.5 : 1,
                position: 'relative',
                transition: 'opacity 0.25s ease, background-color 0.25s ease',
                '&:hover': {
                    color: 'primary.contrastText'
                },
                '&:hover .MuiIconButton-root': {
                    opacity: 1,
                    backgroundColor: 'transparent',
                    color: 'primary.contrastText'
                }
            }}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            <IconButton
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    opacity: 0,
                    transition: 'color 0.3s ease',
                    '&:hover': {
                        color: 'black'
                    }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={optionsTaskID !== task.id ? () => { handleOptionsTaskID?.(task.id) } : () => { handleOptionsTaskID?.(null) }}
            >
                <AddCircle sx={{ fontSize: 22 }} />
            </IconButton>
            <Collapse in={optionsTaskID === task.id} timeout={200} unmountOnExit>
                <IconButton
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => { handleEdit?.(task.id) }}
                >
                    <Edit sx={{ fontSize: 27, '&:hover': { color: 'black' } }} />
                </IconButton>
                <IconButton
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => { handleDelete?.(task.id) }}
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
            <Typography variant="h6">{task.title}</Typography>
            <Typography variant="body1">{task.description}</Typography>
        </TaskItem>
    )
}

export default DraggableTask