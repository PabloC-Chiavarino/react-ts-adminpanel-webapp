import { type DragStartEvent, type DragEndEvent, DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { Typography, Box, Grid, Modal, Paper, CircularProgress, Collapse, Button } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useState, useRef } from "react";
import { ConfirmDialog, AddBtn, TaskContainer, DraggableTask, TaskForm, ArchivedTask } from "../../components";
import { useDynamicQuery } from "../../hooks";
import type { Task } from "../../types";
import { API_BASE_URL } from '../../config';

const Tasker = () => {
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [taskData, setTaskData] = useState<Task | null>(null);
    const [activeTaskID, setActiveTaskID] = useState<string | null>(null);
    const requestAction = useRef<(() => void) | null>(null);

    const TASKS_ENDPOINT = `${API_BASE_URL}/tasks`;
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { data, isLoading, error } = useDynamicQuery<Task[]>(['tasks'], TASKS_ENDPOINT);

    const emptyTask: Task = {
        id: 0,
        title: "",
        description: "",
        completed: false,
        archived: false,
        priority: "low",
    };

    const todo = data?.filter(task => !task.completed && !task.archived) || [];
    const done = data?.filter(task => task.completed && !task.archived) || [];
    const archived = data?.filter(task => task.archived) || [];

    const mutation = useMutation({
        mutationFn: async (task: Task) => {
            const response = await fetch(TASKS_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task),
            });
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            return response.json();
        },
        onSuccess: () => {
            setTaskData(emptyTask);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (task: Task) => {
            const response = await fetch(`${TASKS_ENDPOINT}/${task.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task),
            });
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            return response.json();
        },

        onMutate: async (updatedTask) => {

            await queryClient.cancelQueries({ queryKey: ['tasks'] });

            const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

            queryClient.setQueryData<Task[]>(['tasks'], old =>
                old?.map(task =>
                    task.id === updatedTask.id ? updatedTask : task
                )
            );

            return { previousTasks };
        },
        onError: (_err, _updatedTask, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks'], context.previousTasks);
            }
            enqueueSnackbar("Error updating task", { variant: "error" });
        },

        onSuccess: () => {
            enqueueSnackbar("Task updated successfully", { variant: "success" });
        }
    });


    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${TASKS_ENDPOINT}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            return response.json();
        }
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setTaskData(emptyTask);
    };

    const handleOpenDialogPayload = (action: () => void) => {
        requestAction.current = action
        setOpenDialog(true)
    }

    const handleCloseDialog = () => setOpenDialog(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (!taskData) return
        const updated = { ...taskData, [name]: value }
        setTaskData(updated)
    }

    const handleEdit = (taskID: number) => {
        const task = handleTaskFind(taskID)
        if (!task) return
        setTaskData(task)
        handleOpen()
    }

    const handleSubmit = async () => {
        if (!taskData) return
        try {
            await mutation.mutateAsync(taskData)

            queryClient.invalidateQueries({ queryKey: ['tasks'] });

            enqueueSnackbar('Task created successfully', { variant: 'success' })
        } catch {
            enqueueSnackbar('Error creating task', { variant: 'error' })
        }
    }

    const handleUpdate = async () => {
        try {
            if (!taskData) return
            await updateMutation.mutateAsync(taskData)

            queryClient.invalidateQueries({ queryKey: ['tasks'] });

            enqueueSnackbar('Task updated successfully', { variant: 'success' })
        } catch {
            enqueueSnackbar('Error updating task', { variant: 'error' })
        }
    }

    const handleDelete = async (taskID: number) => {
        try {
            await deleteMutation.mutateAsync(taskID)

            queryClient.invalidateQueries({ queryKey: ['tasks'] });

            enqueueSnackbar('Task deleted successfully', { variant: 'success' })
        } catch {
            enqueueSnackbar('Error deleting task', { variant: 'error' })
        }
    }


    const handleCompleteAll = async () => {
        try {
            await Promise.all(
                todo.map(async task => {
                    const res = await fetch(`${TASKS_ENDPOINT}/${task.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...task, completed: true }),
                    })
                    if (!res.ok) throw new Error('Error updating task');
                    const data = await res.json();
                    return data;
                })
            );

            queryClient.invalidateQueries({ queryKey: ['tasks'] });

            enqueueSnackbar("All tasks completed successfully", { variant: "success" });
        } catch {
            enqueueSnackbar("Error completing tasks", { variant: "error" });
        }
    };

    const handleArchiveAll = async () => {
        try {
            await Promise.all(
                done.map(async task => {
                    const res = await fetch(`${TASKS_ENDPOINT}/${task.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...task, archived: true }),
                    })
                    if (!res.ok) throw new Error('Error actualizando tarea');
                    const data = await res.json();
                    return data;
                })
            );

            queryClient.invalidateQueries({ queryKey: ['tasks'] });

            enqueueSnackbar("All archived tasks completed successfully", { variant: "success" });
        } catch {
            enqueueSnackbar("Error archiving tasks", { variant: "error" });
        }
    };

    const handleDeleteArchive = async () => {
        try {
            await Promise.all(archived.map(task => deleteMutation.mutateAsync(task.id)));

            queryClient.invalidateQueries({ queryKey: ['tasks'] });

            enqueueSnackbar('All archived tasks deleted successfully', { variant: 'success' });
        } catch {
            enqueueSnackbar('Error deleting archived tasks', { variant: 'error' });
        }
    };

    const handleRestoreFromArchive = async (taskID: number) => {
        try {
            const res = await fetch(`${TASKS_ENDPOINT}/${taskID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data?.find(task => task.id === taskID), completed: false, archived: false }),
            })

            if (!res.ok) throw new Error('Error restoring task');

            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            enqueueSnackbar('Task restored successfully', { variant: 'success' });
        } catch {
            enqueueSnackbar('Error restoring task', { variant: 'error' });
        }
    };

    const handleDragStart = (e: DragStartEvent) => {
        const { active } = e;
        setActiveTaskID(String(active.id));
    };

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;

        setActiveTaskID(null);

        if (!over) return;

        const newCompletedState = over.id === "done";
        const movedTask = data?.find(t => t.id === Number(active.id));

        if (!movedTask) return;

        if (movedTask.completed === newCompletedState) return

        queryClient.setQueryData<Task[]>(['tasks'], oldCache => {
            if (!oldCache) return [];
            return oldCache.map(task =>
                task.id === movedTask.id ? { ...task, completed: newCompletedState } : task
            );
        });

        updateMutation.mutate({
            ...movedTask,
            completed: newCompletedState,
        });
    };

    const handleTaskFind = (id: number) => {
        return data?.find(task => task.id === id);
    };

    if (isLoading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><CircularProgress size={60} /></Box>
    if (error) return <Typography variant='h1' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>{(error as Error).message}</Typography>

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
        }}
        >
            <ConfirmDialog
                open={openDialog}
                onConfirm={() => {
                    requestAction.current?.();
                    handleCloseDialog();
                }}
                onCancel={() => setOpenDialog(false)}
            />
            <Modal open={open} onClose={handleClose} >
                <TaskForm
                    handleInputChange={handleInputChange}
                    handleSubmit={(e) => {
                        e.preventDefault();
                        handleOpenDialogPayload(handleSubmit)
                    }}
                    formData={taskData ?? emptyTask}
                    handleUpdate={(e) => {
                        e.preventDefault();
                        handleOpenDialogPayload(handleUpdate)
                    }}
                />
            </Modal>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                <Box sx={{ mb: 5, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h1" className="dash-page-title" sx={{ color: 'text.primary', fontSize: { sm: '1.6rem', md: '1.9rem', lg: '2.2rem', xl: '2.5rem' } }}>Tasker</Typography>
                    <AddBtn onClick={() => { setTaskData(emptyTask); handleOpen(); }} text="Task" />
                </Box>
                {!data ? (
                    <Typography variant='h3' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontWeight: "bold", fontSize: "24px", mb: 15 }}>No Tasks</Typography>
                ) : (
                    <>
                        <Box sx={{ display: "flex", alignItems: "center", mt: -3.5 }}>
                            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                                <Typography variant='h2' sx={{ fontWeight: "bold", fontSize: "25px", color: 'priorityStyles.high.color' }}>{todo?.length} </Typography>
                                <Typography variant='h2' sx={{ fontWeight: "bold", fontSize: "12px", color: 'text.secondary', letterSpacing: '1px' }}>PENDING</Typography>
                            </Box>
                            <Box sx={{ width: '1px', height: '16px', backgroundColor: 'rgb(240 237 241 / 0.25)', mx: 2 }} />
                            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                                <Typography variant='h2' sx={{ fontWeight: "bold", fontSize: "25px", color: 'priorityStyles.medium.color' }}>{done?.length + archived?.length} </Typography>
                                <Typography variant='h2' sx={{ fontWeight: "bold", fontSize: "12px", color: 'text.secondary', letterSpacing: '1px' }}>COMPLETED</Typography>
                            </Box>
                        </Box>
                        <Grid container className="tasker-grid" sx={{ width: "100%", height: { xs: "auto", sm: "60%", md: "50%", lg: "45%" }, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", gap: { xs: 2, sm: 3, md: 5 }, alignItems: "center", mt: 7 }}>
                            <TaskContainer
                                id="todo"
                                title="To Do"
                                tasks={todo}
                                actionLabel="complete all"
                                action={() => handleOpenDialogPayload(handleCompleteAll)}
                                handleDelete={(id) => handleOpenDialogPayload(() => handleDelete(id))}
                                handleEdit={(taskID) => handleEdit(taskID)}
                            />
                            <TaskContainer
                                id="done"
                                title="Completed"
                                tasks={done}
                                actionLabel="archive all"
                                action={() => handleOpenDialogPayload(handleArchiveAll)}
                                handleDelete={(taskID) => handleOpenDialogPayload(() => handleDelete(taskID))}
                                handleEdit={(taskID) => handleEdit(taskID)}
                            />
                        </Grid>
                    </>
                )}
                <DragOverlay>
                    <Paper sx={{ cursor: "grabbing", opacity: 0.7 }}>
                        {activeTaskID && <DraggableTask task={handleTaskFind(Number(activeTaskID))!} />}
                    </Paper>
                </DragOverlay>
            </DndContext>
            <Box sx={{
                width: "100%",
                borderRadius: "14px",
                backgroundColor: "background.paper",
                display: "flex",
                flexDirection: "column",
                mt: { xs: 10, sm: 8, lg: 10 },
                p: { lg: 2.5 }
            }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Box onClick={() => setShowArchived(!showArchived)} sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        '&:hover .MuiSvgIcon-root': {
                            color: 'text.primary',
                        },
                        '&:hover .MuiTypography-root': {
                            color: 'text.primary',
                        }
                    }}>
                        {showArchived ? <ExpandLess sx={{ color: 'text.secondary', transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)' }} /> : <ExpandMore sx={{ color: 'text.secondary', transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)' }} />}
                        <Typography variant="h2" className="dash-section-title" sx={{ fontWeight: '600', fontSize: { lg: '16px' }, color: 'text.primary', transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)' }}>Archived Tasks</Typography>
                    </Box>
                    <Button
                        onClick={() => handleOpenDialogPayload(handleDeleteArchive)}
                        variant="text"
                        disableRipple
                        sx={{
                            fontSize: { lg: '10px' },
                            px: { lg: 2 },
                            py: { lg: 0.8 },
                            borderRadius: '10px',
                            backgroundColor: 'background.alt',
                            fontWeight: 700,
                            color: 'text.secondary',
                            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                color: 'priorityStyles.high.color',
                                backgroundColor: 'background.paper2',
                            },
                        }}
                    >
                        EMPTY ARCHIVE
                    </Button>
                </Box>
                <Collapse in={showArchived} sx={{
                    width: "100%",
                    overflowY: "auto",
                    maxHeight: "60vh",
                    scrollbarWidth: "none",
                    maskImage: `linear-gradient(
                    to bottom,
                    transparent 0%,
                    black 10%,
                    black 90%,
                    transparent 100%
                )`,
                    WebkitMaskImage: `linear-gradient(
                    to bottom,
                    transparent 0%,
                    black 10%,
                    black 90%,
                    transparent 100%
                )`,
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: { lg: 1.5 }, pt: 3.5, pb: 3.5 }}>
                        {archived.map((task) => (
                            <ArchivedTask key={task.id} task={task} handleRestoreFromArchive={() => handleOpenDialogPayload(() => handleRestoreFromArchive(task.id))} handleDelete={() => handleOpenDialogPayload(() => handleDelete(task.id))} />
                        ))}
                    </Box>
                </Collapse>
            </Box>
        </Box >
    );
};


export default Tasker