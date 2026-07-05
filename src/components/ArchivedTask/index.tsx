import { Box, Typography, IconButton } from "@mui/material";
import { UnarchiveOutlined, DeleteOutlined } from "@mui/icons-material";
import type { Task } from "../../types";

const ArchivedTask = ({
    task,
    handleRestoreFromArchive,
    handleDelete,
}: {
    task: Task;
    handleRestoreFromArchive: (taskID: number) => void;
    handleDelete: (taskID: number) => void;
}) => {
    return (
        <Box key={task.id} sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            flexShrink: 1,
            minWidth: 0,
            overflow: 'hidden',
            pr: { xs: 0.8, sm: 1, md: 1.2, lg: 1.5 },
            pl: { xs: 1.2, sm: 1.8, md: 2, lg: 2.5 },
            py: { xs: 0.8, sm: 1, md: 1.2, lg: 1.5 },
            border: "1px solid transparent",
            borderRadius: '16px',
            justifyContent: 'space-between',
            backgroundColor: 'background.paper2',
            position: 'relative',
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                boxShadow: '0px 8px 24px rgba(0,0,0,0.25)',
                border: "1px solid",
                borderColor: 'priorityStyles.low.bg'
            }
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: .3, minWidth: 0, overflow: 'hidden' }}>
                <Box key={task.id} sx={{ display: 'flex', gap: { xs: 1.5, sm: 4 }, alignItems: 'center', minWidth: 0 }}>
                    <Typography className="dash-item-title" sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px', lg: '14px' }, fontWeight: "bold", color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.title}
                    </Typography>
                </Box>
                <Typography variant="body1" className="dash-item-desc" sx={{ fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '13px' }, fontStyle: 'oblique', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.description}</Typography>
            </Box>
            <Box className='task-actions' sx={{ display: 'flex', gap: 0, flexShrink: 0 }}>
                <IconButton
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => { handleRestoreFromArchive(task.id) }}
                    sx={{
                        transition: 'background-color 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'transparent',
                        }
                    }}
                >
                    <UnarchiveOutlined sx={{
                        width: { xs: 18, sm: 22 },
                        height: { xs: 18, sm: 22 },
                        color: 'text.secondary',
                        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: 'scale(1)',
                        '&:hover': {
                            color: 'text.primary',
                            transform: 'scale(1.15)'
                        }
                    }}
                    />
                </IconButton>
                <IconButton
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => { handleDelete(task.id) }}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'transparent',
                        }
                    }}
                >
                    <DeleteOutlined sx={{
                        width: { xs: 18, sm: 22 },
                        height: { xs: 18, sm: 22 },
                        color: 'text.secondary',
                        transform: 'scale(1)',
                        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            color: 'text.primary',
                            transform: 'scale(1.15)'
                        }
                    }}
                    />
                </IconButton>
            </Box>
        </Box>
    )
}

export default ArchivedTask