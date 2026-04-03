import type { Task } from '../../types'
import { useDroppable } from '@dnd-kit/core'
import DraggableTask from '../DraggableTask'
import { Box, Typography, Paper, Button } from '@mui/material'
const TaskContainer = ({
    id,
    title,
    tasks,
    actionLabel,
    action,
    handleDelete,
    handleEdit
}: {
    id: string,
    title: string,
    tasks: Task[]
    actionLabel: string,
    action: () => void,
    handleDelete: (taskID: number) => void,
    handleEdit: (taskID: number) => void
}) => {
    const { setNodeRef } = useDroppable({ id: id })

    return (
        <Box sx={{ height: '100%', flex: 0.5, textAlign: 'center' }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%',
                justifyContent: 'space-between',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                        sx={{
                            width: '.5rem',
                            height: '.5rem',
                            borderRadius: '50%',
                            ml: 1,
                            backgroundColor: title === 'To Do' ? 'priorityStyles.high.color' : 'priorityStyles.medium.color',
                            boxShadow: title === 'To Do' ? '0 0 10px rgba(225, 98, 118, 0.6)' : '0 0 10px rgba(178,161,255,0.6)',
                        }} />
                    <Typography variant="h2" sx={{ fontWeight: '600', fontSize: '18px', color: 'text.primary', fontFamily: 'Manrope' }}>{title}</Typography>
                </Box>
                <Button
                    onClick={action}
                    variant="text"
                    disableRipple
                    sx={{
                        p: 0,
                        minWidth: 'auto',
                        textTransform: 'none',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'text.secondary',
                        transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            color: title === 'To Do' ? 'priorityStyles.medium.color' : 'priorityStyles.high.color',
                            backgroundColor: 'transparent',
                        },
                    }}
                >
                    {actionLabel.toUpperCase()}
                </Button>
            </Box>
            <Paper sx={{
                mt: 0,
                pt: 3.5,
                pb: 3.5,
                height: '100%',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                maskImage: `linear-gradient(
                    to bottom,
                    transparent 0%,
                    black 10%,
                    black 85%,
                    transparent 100%
                )`,
                WebkitMaskImage: `linear-gradient(
                    to bottom,
                    transparent 0%,
                    black 10%,
                    black 85%,
                    transparent 100%
                )`,

                '&::-webkit-scrollbar': {
                    display: 'none',
                },
            }}
                ref={setNodeRef}
            >
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}>
                    {tasks.map((task) => (
                        <DraggableTask
                            key={task.id}
                            task={task}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    ))}
                </Box>
            </Paper>
        </Box>
    )
}

export default TaskContainer