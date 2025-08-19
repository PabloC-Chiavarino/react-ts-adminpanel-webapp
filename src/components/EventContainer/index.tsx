import { Box, Typography, Paper, Grid } from "@mui/material"
import { Event as EventIcon } from "@mui/icons-material"
import { DraggableEvent } from "../../components"
import type { Event } from "../../types"

const EventContainer = ({
    events,
    handleDelete,
    handleEdit,
    optionsEventID,
    handleOptionsEventID,
}: {
    events: Event[],
    handleDelete: (EventID: number) => void,
    handleEdit: (EventID: number) => void,
    optionsEventID: number | null,
    handleOptionsEventID: (EventID: number | null) => void,
}) => {
    return (
        <Box sx={{ height: '100%', flex: 0.3, textAlign: 'center' }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 3 }}>
                    <EventIcon />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.7rem' }}>Events</Typography>
                </Box>
            </Box>
            <Paper
                id="event-container"
                sx={{
                    height: '85%',
                    overflowY: 'auto',
                    display: 'flex',
                    justifyContent: 'center'
                }}
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
                    {events?.map((event) => (
                        <DraggableEvent
                            key={event.id}
                            event={event}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                            optionsEventID={optionsEventID}
                            handleOptionsEventID={handleOptionsEventID}
                        />
                    ))}
                </Grid>
            </Paper>
        </Box>
    )
}

export default EventContainer