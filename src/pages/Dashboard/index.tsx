import { Box, Paper, Typography } from "@mui/material"
export const Dashboard = () => {
    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Box sx={{ width: "90%", mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>Dashboard</Typography>
            </Box >
            <Box
                sx={{
                    height: "100%",
                    width: "90%",
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gridTemplateRows: "1fr 1fr 1fr",
                }}
            >
                <Paper sx={{ gridColumn: "1", gridRow: "1", display: "flex", justifyContent: "center", alignItems: "center" }}>A</Paper>
                <Paper sx={{ gridColumn: "2", gridRow: "1", display: "flex", justifyContent: "center", alignItems: "center" }}>B</Paper>
                <Paper sx={{ gridColumn: "3", gridRow: "1", display: "flex", justifyContent: "center", alignItems: "center" }}>C</Paper>

                <Paper sx={{ gridColumn: "1 / span 2", gridRow: "2 / span 3", display: "flex", justifyContent: "center", alignItems: "center" }}>D</Paper>

                <Box
                    sx={{
                        gridColumn: "3",
                        gridRow: "2 / span 3",
                        display: "grid",
                        gridTemplateRows: "1fr 1fr",
                        gap: 2,
                    }}
                >
                    <Paper sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>E</Paper>
                    <Paper sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>F</Paper>
                </Box>
            </Box>
        </Box>
    )
}

export default Dashboard