import { useState, useRef, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Box, Grid, Modal, Typography } from "@mui/material";
import { type SelectChangeEvent, CircularProgress } from '@mui/material';
import type { EventDropArg } from "@fullcalendar/core";
import type { Event } from "../../types";
import { useDynamicQuery } from "../../hooks";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable, type DropArg } from "@fullcalendar/interaction";
import { ConfirmDialog, EventForm, AddBtn, EventContainer } from "../../components";

const Calendar = () => {
    const [optionsEventID, setOptionsEventID] = useState<number | null>(null);
    const [eventData, setEventData] = useState<Event | null>(null);
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const requestAction = useRef<(() => void) | null>(null);

    const EVENTS_ENDPOINT = "https://mock-data-api-vntk.onrender.com/events";
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { data, isLoading, error } = useDynamicQuery<Event[]>(EVENTS_ENDPOINT);

    const emptyEvent: Event = {
        id: 0,
        title: "",
        description: "",
        category: "",
    };

    const events: Event[] = data?.filter(event => event.startDate === undefined) || [];
    const scheuledEvents: Event[] = data?.filter(event => event.startDate !== undefined) || [];

    useEffect(() => {
        const container = document.getElementById("event-container");
        
        if (!container) return;
        const draggable = new Draggable(container, {
                itemSelector: ".draggableEl",
                eventData: (eventEl) => JSON.parse(eventEl.getAttribute("data-event") || "{}"),
            });

        return () => draggable.destroy()
    }, [data]);

    const mutation = useMutation({
        mutationFn: async (event: Event) => {
            const response = await fetch(EVENTS_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(event),
            });
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [EVENTS_ENDPOINT] });
            setEventData(emptyEvent);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (task: Event) => {
            const response = await fetch(`${EVENTS_ENDPOINT}/${task.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task),
            });
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            return response.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData<Event[]>([EVENTS_ENDPOINT], oldCache => {
                if (!oldCache) return [];
                return oldCache.map(task =>
                    task.id === data.id ? data : task
                );
            });
            enqueueSnackbar('Updated successfully', { variant: 'success' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${EVENTS_ENDPOINT}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [EVENTS_ENDPOINT] });
        },
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEventData(emptyEvent);
    };

    const handleOpenDialogPayload = (action: () => void) => {
        requestAction.current = action
        setOpenDialog(true)
    }

    const handleCloseDialog = () => setOpenDialog(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (!eventData) return
        const updated = { ...eventData, [name]: value }
        setEventData(updated)
    }

    const handleSelectChange = (e: SelectChangeEvent<string | string[]>) => {
        const { name, value } = e.target;

        setEventData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: Number(value)
            };
        });
    }


    const handleSubmit = async () => {
        if (!eventData) return
        try {
            await mutation.mutateAsync(eventData)
            enqueueSnackbar('Created successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleUpdate = async () => {
        try {
            if (!eventData) return
            await updateMutation.mutateAsync(eventData)
            enqueueSnackbar('Updated successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleEdit = (eventID: number) => {
        const task = handleEventFind(eventID)
        if (!task) return
        setEventData(task)
        handleOpen()
    }

    const handleDelete = (eventID: number) => {
        try {
            deleteMutation.mutate(eventID)
            enqueueSnackbar('Deleted successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleOptionsEventID = (eventID: number | null) => setOptionsEventID(eventID);

    const handleEventFind = (id: number) => {
        return data?.find(task => task.id === id);
    };

    const handleDrop = (info: EventDropArg | DropArg) => {
        let eventID: number;
        let startDate: string | undefined;
        let endDate: string | undefined;

        if ("event" in info) {
            eventID = Number(info.event.id);
            startDate = info.event.start?.toISOString();
            endDate = info.event.end?.toISOString();
        } else {
            const draggedData = info.draggedEl.getAttribute("data-event");
            if (!draggedData) return;

            const parsedEvent: { id: number; title: string; description: string; category: string } =
                JSON.parse(draggedData);

            eventID = parsedEvent.id;
            startDate = info.date?.toISOString();
            endDate = info.date?.toISOString();
        }

        const previousEvents = queryClient.getQueryData<Event[]>([EVENTS_ENDPOINT]);
        const existingEvent = data?.find(event => event.id === eventID);

        if (!existingEvent) return;

        const updatedEvent: Event = {
            ...existingEvent,
            startDate,
            endDate,
        };

        queryClient.setQueryData<Event[]>([EVENTS_ENDPOINT], oldCache => {
            if (!oldCache) return [];
            return oldCache.map(event =>
                event.id === eventID ? { ...event, startDate, endDate } : event
            );
        });

        updateMutation.mutate(updatedEvent, {
            onError: () => {
                // Solo tiene revert si es EventDropArg
                if ("revert" in info) info.revert();
                enqueueSnackbar('Error', { variant: 'error' });
                queryClient.setQueryData<Event[]>([EVENTS_ENDPOINT], previousEvents);
            }
        });
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
                <EventForm
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    handleSubmit={(e) => {
                        e.preventDefault();
                        handleOpenDialogPayload(handleSubmit)
                    }}
                    formData={eventData ?? emptyEvent}
                    handleUpdate={(e) => {
                        e.preventDefault();
                        handleOpenDialogPayload(handleUpdate)
                    }}
                />
            </Modal>
            <Box sx={{ mb: 6, width: "90%", display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h3">Calendar</Typography>
                <AddBtn onClick={() => { setEventData(emptyEvent); handleOpen(); }} />
            </Box>
            <Grid sx={{ width: "90%", height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <EventContainer
                    events={events}
                    handleDelete={(eventID) => handleOpenDialogPayload(() => handleDelete(eventID))}
                    handleEdit={(eventID) => handleEdit(eventID)}
                    optionsEventID={optionsEventID}
                    handleOptionsEventID={(id) => handleOptionsEventID(id)}
                />
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 0.1,
                    textAlign: "center",
                    color: "grey",
                    opacity: 0.3,
                    fontWeight: "lighter",
                    gap: 4,
                    p: 0,
                    transition: "opacity 1s ease",
                    '&:hover': { opacity: 1 }
                }}>
                    <Typography variant="h6" fontSize={16}>
                        Click the "Add" button to create a new event.
                    </Typography>
                    <Typography variant="h6" fontSize={16}>
                        Drag the selected event onto the calendar to schedule it.
                    </Typography>
                    <Typography variant="h6" fontSize={16}>
                        Drag and drop events to move them between dates.
                    </Typography>
                </Box>
                <Box sx={{ flex: .55, height: "100%" }}>
                    <FullCalendar
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        height={"100%"}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        editable={true}
                        droppable={true}
                        selectable={true}
                        eventDrop={(info) => handleDrop(info)}
                        drop={(info) => handleDrop(info)}
                        events={scheuledEvents?.map(event => ({
                            id: event.id.toString(),
                            title: event.title,
                            start: event.startDate,
                            end: event.endDate,
                            backgroundColor: event.color,
                        }))}
                    />
                </Box>
            </Grid>
        </Box>
    )
}

export default Calendar