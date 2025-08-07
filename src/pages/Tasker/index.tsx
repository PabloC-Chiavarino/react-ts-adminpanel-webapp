import type { Task } from "../../types"
import { Grid, styled, Paper, Typography, Box } from "@mui/material";
import { ForwardSharp, TaskAltSharp, FormatListBulleted } from "@mui/icons-material";

const Tasker = () => {

    const TaskItem = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.grey[100],
        padding: theme.spacing(1),
        textAlign: 'center',
        flexShrink: .8,
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: theme.palette.grey[300]
        },
    }))


    const TaskList: Task[] = [
        {
            id: 1,
            title: 'TaskItem 1',
            description: 'Description 1',
            completed: false
        },
        {
            id: 2,
            title: 'TaskItem 2',
            description: 'Description 2',
            completed: false
        },
        {
            id: 3,
            title: 'TaskItem 3',
            description: 'Description 3',
            completed: true
        },
        {
            id: 4,
            title: 'TaskItem 4',
            description: 'Description 4',
            completed: false
        },
        {
            id: 5,
            title: 'TaskItem 5',
            description: 'Description 5',
            completed: false
        }
    ]

    const todo = TaskList.filter(task => !task.completed)
    const done = TaskList.filter(task => task.completed)

    return (
        <>
            <Typography variant="h4">Tasker</Typography>
            <Grid container sx={{
                width: '100%',
                height: '100%',
                justifyContent: 'space-evenly',
                alignItems: 'center'
            }}>
                <Box sx={{ height: '80%', flex: 0.25, textAlign: 'center' }}>
                    <Box sx={{
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 1
                        }}>
                        <FormatListBulleted sx={{ fontSize: 40 }} />
                        <Typography variant="h5">TO DO</Typography>
                    </Box>
                    <Paper sx={{
                        height: '100%',
                        pt: 4,
                        pb: 4,
                        px: 0,
                        mt: 4,
                        overflowY: 'scroll',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Grid size={9} sx={{
                            flex: .85,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            {todo.map((task, index) => (
                                <TaskItem>
                                    <Typography key={index} variant="h6">{task.title}</Typography>
                                    <Typography key={index} variant="body1">{task.description}</Typography>
                                </TaskItem>
                            ))}
                        </Grid>
                    </Paper>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    height: '100%',
                    justifyContent: 'center',
                }}>
                    <ForwardSharp sx={{fontSize: 70}} />
                    <ForwardSharp sx={{transform: 'rotate(180deg)', fontSize: 70}} />
                </Box>
                <Box sx={{ 
                    height: '80%', 
                    flex: 0.25, 
                    textAlign: 'center' 
                }}>
                    <Box sx={{
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 1
                        }}>
                        <TaskAltSharp sx={{ fontSize: 40 }} />
                        <Typography variant="h5">COMPLETED</Typography>
                    </Box>
                    <Paper sx={{
                        height: '100%',
                        pt: 4,
                        pb: 4,
                        px: 0,
                        mt: 4,
                        overflowY: 'scroll',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Grid size={9} sx={{
                            flex: .85,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            {done.map((task, index) => (
                                <TaskItem>
                                    <Typography key={index} variant="h6">{task.title}</Typography>
                                    <Typography key={index} variant="body1">{task.description}</Typography>
                                </TaskItem>
                            ))}
                        </Grid>
                    </Paper>
                </Box>
            </Grid>
        </>
    );
};

export default Tasker;