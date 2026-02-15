import { type DragStartEvent, type DragEndEvent, DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { TaskAltSharp, ForwardSharp, FormatListBulleted, DeleteSweep } from "@mui/icons-material";
import { Typography, Box, Grid, Modal, Paper, CircularProgress } from "@mui/material";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useState, useRef } from "react";
import { ConfirmDialog, AddBtn, TaskContainer, DraggableTask, TaskForm } from "../../components";
import { useDynamicQuery } from "../../hooks";
import type { Task } from "../../types";

const Tasker = () => {
    const [open, setOpen] = useState(false);
    const [optionsTaskID, setOptionsTaskID] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [taskData, setTaskData] = useState<Task | null>(null);
    const [activeTaskID, setActiveTaskID] = useState<string | null>(null);
    const requestAction = useRef<(() => void) | null>(null);

    const TASKS_ENDPOINT = "https://mock-data-api-vntk.onrender.com/tasks";
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { data, isLoading, error } = useDynamicQuery<Task[]>(['tasks'], TASKS_ENDPOINT);

    const emptyTask: Task = {
        id: 0,
        title: "",
        description: "",
        completed: false,
    };

    const todo = data?.filter(task => !task.completed) || [];
    const done = data?.filter(task => task.completed) || [];

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
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
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
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });


    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${TASKS_ENDPOINT}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setTaskData(emptyTask);
    };

    const handleOptionsTaskID = (taskID: number | null) => setOptionsTaskID(taskID);

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
            enqueueSnackbar('Created successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleUpdate = async () => {
        try {
            if (!taskData) return
            await updateMutation.mutateAsync(taskData)
            enqueueSnackbar('Updated successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleDelete = async (taskID: number) => {
        try {
            await deleteMutation.mutateAsync(taskID)
            enqueueSnackbar('Deleted successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }


    const handleCompleteAll = async () => {
        try {
            await Promise.all(
                todo.map(task =>
                    fetch(`${TASKS_ENDPOINT}/${task.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...task, completed: true }),
                    }).then(res => {
                        if (!res.ok) throw new Error('Error actualizando tarea');
                        return res.json();
                    })
                )
            );
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            enqueueSnackbar("Todas las tareas completadas", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("Error completando tareas", { variant: "error" });
        }
    };


    const handleDeleteCompleted = async () => {
        try {
            await Promise.all(done.map(task => deleteMutation.mutateAsync(task.id)));
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            enqueueSnackbar('Tareas completadas eliminadas', { variant: 'success' });
        } catch {
            enqueueSnackbar('Error eliminando tareas', { variant: 'error' });
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

    if (isLoading) return <Typography variant="h5"><CircularProgress /></Typography>;
    if (error) return <Typography variant="h5">{(error as Error).message}</Typography>;

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
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
                <Box sx={{ mb: 6, width: "90%", display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h3">Tasker</Typography>
                    <AddBtn onClick={() => { setTaskData(emptyTask); handleOpen(); }} />
                </Box>
                <Grid container sx={{ width: "90%", height: "100%", justifyContent: "space-between", alignItems: "center" }}>
                    <TaskContainer
                        id="todo"
                        title="To Do"
                        icon={<TaskAltSharp sx={{ fontSize: 30 }} />}
                        tasks={todo}
                        button={<ForwardSharp sx={{ fontSize: 50, cursor: "pointer" }} />}
                        action={() => handleOpenDialogPayload(handleCompleteAll)}
                        handleDelete={(id) => handleOpenDialogPayload(() => handleDelete(id))}
                        handleEdit={(taskID) => handleEdit(taskID)}
                        optionsTaskID={optionsTaskID}
                        handleOptionsTaskID={(id) => handleOptionsTaskID(id)}
                    />
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 0.25,
                        textAlign: "center",
                        color: "grey",
                        opacity: 0.3,
                        fontWeight: "lighter",
                        gap: 4,
                        p: 10,
                        transition: "opacity 1s ease",
                        '&:hover': { opacity: 1 }
                    }}>
                        <Typography variant="h6" fontSize={16}>
                            Drag and drop tasks to move them between the completed or to do section
                        </Typography>
                        <Typography variant="h6" fontSize={16}>
                            Press the <ForwardSharp sx={{ fontSize: 25, verticalAlign: 'bottom' }} /> button to complete all tasks
                        </Typography>
                        <Typography variant="h6" fontSize={16}>
                            Press the <DeleteSweep sx={{ fontSize: 25, verticalAlign: 'bottom' }} /> button to delete all completed tasks
                        </Typography>
                    </Box>
                    <TaskContainer
                        id="done"
                        title="Completed"
                        icon={<FormatListBulleted sx={{ fontSize: 30 }} />}
                        tasks={done}
                        button={<DeleteSweep sx={{ fontSize: 50, cursor: "pointer" }} />}
                        action={() => handleOpenDialogPayload(handleDeleteCompleted)}
                        handleDelete={(taskID) => handleOpenDialogPayload(() => handleDelete(taskID))}
                        handleEdit={(taskID) => handleEdit(taskID)}
                        optionsTaskID={optionsTaskID}
                        handleOptionsTaskID={(id) => handleOptionsTaskID(id)}
                    />
                </Grid>

                <DragOverlay>
                    <Paper sx={{ cursor: "grabbing", opacity: 0.5 }}>
                        {activeTaskID && <DraggableTask task={handleTaskFind(Number(activeTaskID))!} />}
                    </Paper>
                </DragOverlay>
            </DndContext>
        </Box>
    );
};


export default Tasker