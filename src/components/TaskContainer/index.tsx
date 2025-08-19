import type { Task } from '../../types'
import { useDroppable } from '@dnd-kit/core'
import DraggableTask from '../DraggableTask'
import { Box, Typography, Paper, Grid, IconButton } from '@mui/material'
const TaskContainer = ({
    id,
    title,
    icon,
    tasks,
    button,
    action,
    handleDelete,
    handleEdit,
    optionsTaskID,
    handleOptionsTaskID
}: {
    id: string,
    title: string,
    icon: React.ReactNode,
    tasks: Task[]
    button: React.ReactNode,
    action: () => void,
    handleDelete: (taskID: number) => void,
    handleEdit: (taskID: number) => void,
    optionsTaskID: number | null,
    handleOptionsTaskID: (taskID: number | null) => void
}) => {
    const { setNodeRef } = useDroppable({ id: id })

    return (
        <Box sx={{ height: '100%', flex: 0.4, textAlign: 'center'}}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {icon}
                    <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.7rem' }}>{title}</Typography>
                </Box>
                <IconButton onClick={action} sx={{ transition: 'all .25s ease-in-out', '&:hover': { color: 'var(--primary)', backgroundColor: 'transparent' } }}>
                    {button}
                </IconButton>
            </Box>
            <Paper sx={{
                height: '85%',
                overflowY: 'auto',
                display: 'flex',
                justifyContent: 'center'
            }}
                ref={setNodeRef}
            >
                <Grid size={9} sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    padding: 2,
                    height: '100%',
                    overflowX: 'hidden'
                }}>
                    {tasks.map((task) => (
                        <DraggableTask
                            key={task.id}
                            task={task}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            optionsTaskID={optionsTaskID}
                            handleOptionsTaskID={handleOptionsTaskID}
                        />
                    ))}
                </Grid>
            </Paper>
        </Box>
    )
}

export default TaskContainer