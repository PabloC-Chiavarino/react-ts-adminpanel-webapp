import { useState, useRef, useEffect, useCallback } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Box, Grid, Modal, Typography, useTheme } from "@mui/material";
import { type SelectChangeEvent, CircularProgress } from '@mui/material';
import type { EventDropArg } from "@fullcalendar/core";
import type { Event } from "../../types";
import { useDynamicQuery } from "../../hooks";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable, type DropArg } from "@fullcalendar/interaction";
import { ConfirmDialog, EventForm, AddBtn, EventContainer } from "../../components";
import { API_BASE_URL } from '../../config';

const Calendar = () => {
    const [eventData, setEventData] = useState<Event | null>(null);
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const requestAction = useRef<(() => void) | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isOverContainer, setIsOverContainer] = useState(false);
    const dragListenerRef = useRef<((e: MouseEvent) => void) | null>(null);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const EVENTS_ENDPOINT = `${API_BASE_URL}/events`;
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { data, isLoading, error } = useDynamicQuery<Event[]>(['events'], EVENTS_ENDPOINT);
    const emptyEvent: Event = {
        id: 0,
        title: "",
        description: "",
        category: "",
    };

    const events: Event[] = data?.filter(event => event.startDate === undefined) || [];
    const scheduledEvents: Event[] = data?.filter(event => event.startDate !== undefined) || [];

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
            queryClient.invalidateQueries({ queryKey: ['events'] });
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
            queryClient.setQueryData<Event[]>(['events'], oldCache => {
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
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setEventData(emptyEvent);
    };

    const handleOpenDialogPayload = useCallback((action: () => void) => {
        requestAction.current = action
        setOpenDialog(true)
    }, [])

    const handleSubmit = async () => {
        if (!eventData) return
        try {
            await mutation.mutateAsync(eventData)
            enqueueSnackbar('Created successfully', { variant: 'success' })
        } catch {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleUpdate = async () => {
        try {
            if (!eventData) return
            await updateMutation.mutateAsync(eventData)
            enqueueSnackbar('Updated successfully', { variant: 'success' })
        } catch {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }

    const handleEventFind = useCallback((id: number) => {
        return data?.find(task => task.id === id);
    }, [data]);

    const handleEdit = useCallback((eventID: number) => {
        const task = handleEventFind(eventID)
        if (!task) return
        setEventData(task)
        handleOpen()
    }, [handleEventFind])

    const handleDelete = useCallback((eventID: number) => {
        try {
            deleteMutation.mutate(eventID)
            enqueueSnackbar('Deleted successfully', { variant: 'success' })
        } catch {
            enqueueSnackbar('Error', { variant: 'error' })
        }
    }, [deleteMutation, enqueueSnackbar])

    const handleDeleteWithDialog = useCallback((eventID: number) => {
        handleOpenDialogPayload(() => handleDelete(eventID))
    }, [handleDelete, handleOpenDialogPayload])

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

            const parsedEvent: { id: number; title: string; description: string; category: string } = JSON.parse(draggedData);

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

        queryClient.setQueryData<Event[]>(['events'], oldCache => {
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
                queryClient.setQueryData<Event[]>(['events'], previousEvents);
            }
        });
    };

    if (isLoading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><CircularProgress size={60} /></Box>;
    if (error) return <Typography variant='h2' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontWeight: "bold", fontSize: "24px", mb: 15 }}>{(error as Error).message}</Typography>;

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column"
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
            <Box sx={{ mb: 5, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h1" className="dash-page-title" sx={{ fontSize: { sm: '1.6rem', md: '1.9rem', lg: '2.2rem', xl: '2.5rem' } }}>Calendar</Typography>
                <AddBtn onClick={() => { setEventData(emptyEvent); handleOpen(); }} text="Event" />
            </Box>
            {data && (
                <Box sx={{ display: "flex", alignItems: "center", mt: -3.5 }}>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                        <Typography variant='h2' sx={{ fontWeight: "bold", fontSize: "25px", color: 'priorityStyles.high.color' }}>{data?.filter(event => event.startDate).length} </Typography>
                        <Typography variant='h2' sx={{ fontWeight: "bold", fontSize: "12px", color: 'text.secondary', letterSpacing: '1px' }}>UPCOMING</Typography>
                    </Box>
                    <Box sx={{ width: '1px', height: '16px', backgroundColor: 'rgb(240 237 241 / 0.25)', mx: 2 }} />
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                        <Typography variant='h2' sx={{ fontWeight: "bold", fontSize: "25px", color: 'priorityStyles.medium.color' }}>{data?.filter(event => !event.startDate).length} </Typography>
                        <Typography variant='h2' sx={{ fontWeight: "bold", fontSize: "12px", color: 'text.secondary', letterSpacing: '1px' }}>UNSCHEDULED</Typography>
                    </Box>
                </Box>
            )}
            <Grid sx={{ width: "100%", height: { xs: "auto", sm: "80%", md: "75%", lg: "70%" }, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center", md: "center" }, mt: { xs: 3, md: 7 }, gap: { xs: 3, sm: 4, md: 5, lg: 2 } }}>
                {!data ? (
                    <Typography variant='h2' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontWeight: "bold", fontSize: "24px", mb: 15 }}>No events data</Typography>
                ) : (
                    <EventContainer
                        events={events}
                        handleDelete={handleDeleteWithDialog}
                        handleEdit={handleEdit}
                        isDragging={isDragging}
                        isOverThis={isOverContainer}
                    />
                )}
                <Box sx={{
                    flex: { xs: 1, md: .75 },
                    height: { xs: 400, sm: 500, md: "120%", lg: "100%" },
                    mt: 0,
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)',
                    border: isDark ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(0,0,0,0.06)',

                    // grilla
                    '& .fc-scrollgrid': { border: 'none' },
                    '& .fc-scrollgrid td, & .fc-scrollgrid th': { border: '1px solid rgba(0,0,0,0.12)', },

                    // cabecera días
                    '& .fc-col-header-cell': {
                        border: 'none',
                        padding: '8px 0',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        color: 'text.secondary',
                        backgroundColor: 'background.paper',
                    },
                    '& .fc-col-header-cell a': { color: 'inherit', textDecoration: 'none' },

                    '& .fc-daygrid-day-frame': {
                        minHeight: { xs: '80px', md: '140px', lg: '120px' },
                        minWidth: { xs: '0px', md: '120px' },
                        backgroundColor: 'background.paper',
                    },

                    // números de día
                    '& .fc-daygrid-day-number': {
                        fontSize: '13px',
                        color: 'text.secondary',
                        padding: '6px 10px',
                    },

                    // hoy
                    '& .fc-day-today': { backgroundColor: 'transparent !important' },
                    '& .fc-day-today .fc-daygrid-day-number': {
                        color: 'common.white',
                        fontWeight: 600,
                    },

                    // toolbar
                    '& .fc .fc-toolbar.fc-header-toolbar': {
                        padding: { xs: '10px', md: '20px 20px' },
                        backgroundColor: 'background.paper',
                        mb: 0,
                        flexWrap: 'wrap',
                    },

                    // título toolbar
                    '& .fc-toolbar-title': { fontSize: { xs: '13px', md: '15px' }, fontWeight: 600, margin: 0, padding: 0 },

                    // botones prev/next/today/vistas
                    '& .fc-button': {
                        background: 'transparent !important',
                        border: '1px solid rgba(0,0,0,0.12) !important',
                        borderRadius: 2,
                        boxShadow: 'none !important',
                        fontSize: { xs: '10px', md: '12px' },
                        padding: { xs: '3px 6px', md: '4px 10px' },
                        color: 'text.secondary !important',
                        textTransform: 'capitalize',
                    },
                    '& .fc-button:hover': { background: 'background.paper2 !important' },
                    '& .fc-button-active': {
                        borderColor: 'primary.main !important',
                        backgroundColor: 'primary.main !important',
                        color: 'common.white !important',
                    },

                    // eventos
                    '& .fc-event': {
                        border: '1px solid',
                        borderRadius: '4px',
                        fontSize: '12px',
                        padding: '3px 6px',
                        cursor: 'pointer',
                    },

                    // categorías
                    '& .fc-event.event-review': {
                        borderColor: 'rgba(98, 184, 245, 0.5) !important',
                        backgroundColor: 'rgba(98, 184, 245, 0.1) !important'
                    },
                    '& .fc-event.event-meeting': {
                        borderColor: 'rgba(93, 214, 181, 0.5) !important',
                        backgroundColor: 'rgba(93, 214, 181, 0.1) !important'
                    },
                    '& .fc-event.event-design': {
                        borderColor: 'rgba(240, 160, 90, 0.5) !important',
                        backgroundColor: 'rgba(240, 160, 90, 0.1) !important'
                    },
                    '& .fc-event.event-development': {
                        borderColor: 'rgba(178, 161, 255, 0.5) !important',
                        backgroundColor: 'rgba(178, 161, 255, 0.1) !important'
                    },
                    '& .fc-event.event-release': {
                        borderColor: 'rgba(225, 98, 118, 0.5) !important',
                        backgroundColor: 'rgba(225, 98, 118, 0.1) !important'
                    },

                    // puntitos (more events)
                    '& .fc-daygrid-event-dot': { display: 'none' },
                    '& .fc-daygrid-more-link': { fontSize: '11px', color: 'text.secondary' },
                }}>
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
                        events={scheduledEvents?.map(event => ({
                            id: event.id.toString(),
                            title: event.title,
                            start: event.startDate,
                            end: event.endDate,
                            category: event.category,
                        }))}
                        eventClassNames={(info) => {
                            switch (info.event.extendedProps.category) {
                                case 'meeting': return ['event-meeting'];
                                case 'design': return ['event-design'];
                                case 'development': return ['event-development'];
                                case 'release': return ['event-release'];
                                default: return ['event-review'];
                            }
                        }}
                        eventDragStart={() => {
                            setIsDragging(true);
                            dragListenerRef.current = (e: MouseEvent) => {
                                const containerEl = document.getElementById('event-container');
                                if (!containerEl) return;

                                const rect = containerEl.getBoundingClientRect();

                                const isInside =
                                    e.clientX >= rect.left &&
                                    e.clientX <= rect.right &&
                                    e.clientY >= rect.top &&
                                    e.clientY <= rect.bottom;

                                setIsOverContainer(isInside);
                            };

                            document.addEventListener('mousemove', dragListenerRef.current);
                        }}
                        eventDragStop={(info) => {
                            setIsDragging(false);
                            if (dragListenerRef.current) {
                                document.removeEventListener('mousemove', dragListenerRef.current);
                            }

                            setIsOverContainer(false);

                            const containerEl = document.getElementById('event-container');
                            if (!containerEl) return;

                            const rect = containerEl.getBoundingClientRect();
                            const { clientX, clientY } = info.jsEvent;

                            const isOverContainer =
                                clientX >= rect.left &&
                                clientX <= rect.right &&
                                clientY >= rect.top &&
                                clientY <= rect.bottom;

                            if (isOverContainer) {
                                const eventID = Number(info.event.id);

                                const existingEvent = data?.find(e => e.id === eventID);
                                if (!existingEvent) return;

                                const updatedEvent = {
                                    ...existingEvent,
                                    startDate: undefined,
                                    endDate: undefined,
                                };

                                queryClient.setQueryData<Event[]>(['events'], old =>
                                    old?.map(e =>
                                        e.id === eventID
                                            ? { ...e, startDate: undefined, endDate: undefined }
                                            : e
                                    ) || []
                                );

                                updateMutation.mutate(updatedEvent, {
                                    onError: () => {
                                        enqueueSnackbar('Error', { variant: 'error' });
                                    }
                                });
                            }
                        }}
                    />
                </Box>
            </Grid>
        </Box>
    )
}

export default Calendar