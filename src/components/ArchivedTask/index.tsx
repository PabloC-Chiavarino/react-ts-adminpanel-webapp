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
            pr: 2,
            pl: 3,
            py: 2,
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: .3 }}>
                <Box key={task.id} sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <Typography sx={{ fontSize: "16px", fontWeight: "bold", color: 'text.secondary' }}>
                        {task.title}
                    </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontSize: "14px", fontStyle: 'oblique', color: 'text.secondary' }}>{task.description}</Typography>
            </Box>
            <Box className='task-actions' sx={{ display: 'flex', gap: 0 }}>
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
                        width: 22,
                        height: 22,
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
                        width: 22,
                        height: 22,
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