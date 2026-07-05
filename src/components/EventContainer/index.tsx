import { memo } from "react"
import { Box, Typography, Paper } from "@mui/material"
import { DraggableEvent } from "../../components"
import type { Event } from "../../types"

const EventContainer = memo(({
    events,
    handleDelete,
    handleEdit,
    isDragging,
    isOverThis,
}: {
    events: Event[],
    isOverThis: boolean,
    handleDelete: (EventID: number) => void,
    handleEdit: (EventID: number) => void,
    isDragging: boolean
}) => {
    return (
        <Box sx={{ height: 'auto', flex: { xs: 'none', sm: 0.30, md: 0.25, lg: 0.20 }, textAlign: 'center', minHeight: 'auto', maxHeight: { xs: '35vh', sm: '100%', md: '100%', lg: '40vh' }, minWidth: 0, overflow: 'hidden' }} id="event-container">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <Box
                    sx={{
                        width: '.5rem',
                        height: '.5rem',
                        borderRadius: '50%',
                        ml: 1,
                        backgroundColor: 'priorityStyles.medium.color',
                        boxShadow: '0 0 10px rgba(178,161,255,0.6)',
                    }} />
                <Typography variant="h2" className="dash-section-title" sx={{ fontWeight: '600', fontSize: { xs: '11px', sm: '13px', md: '14px', lg: '16px' }, color: 'text.primary', fontFamily: 'Manrope' }}>Unscheduled</Typography>
            </Box>
            <Paper sx={{
                mt: 1,
                pt: { xs: 1, sm: 1.5, md: 1.8, lg: 2 },
                pb: { xs: 1, sm: 1.5, md: 1.8, lg: 2 },
                px: { xs: 0.8, sm: 1, md: 1.2, lg: 1.5 },
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                position: 'relative',
                scrollbarWidth: 'none',
                borderRadius: '20px',
                backgroundColor: 'transparent',
                transition: 'all 0.25s ease',
                maskImage: `linear-gradient(to bottom, transparent 0%, black 10%, black 85%, transparent 100%)`,
                WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black 10%, black 85%, transparent 100%)`,
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -80,
                    borderRadius: 'inherit',
                    background: 'radial-gradient(circle, rgba(178,161,255,0.08))',
                    filter: 'blur(60px)',
                    zIndex: -1,
                    opacity: isOverThis ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    borderRadius: 'inherit',
                    inset: -150,
                    background: `
                        radial-gradient(
                            circle,
                            rgba(178, 161, 255, 0.15)
                        )
                    `,
                    filter: 'blur(150px)',
                    pointerEvents: 'none',
                    zIndex: -1,
                    opacity: isOverThis ? 1 : 0,
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                },
            }}
            >
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 0.8, sm: 1, md: 1.2, lg: 1.5 },
                }}>
                    {events?.map((event) => (
                        <DraggableEvent
                            key={event.id}
                            event={event}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            isDragging={isDragging}
                        />
                    ))}
                </Box>
            </Paper>
        </Box>
    )
})

export default EventContainer