import { Box, Typography } from "@mui/material"
import { useDynamicQuery } from "../../hooks"
import type { ChartTypes } from "../../types"
import { DynamicChart } from "../../components"

const PendingTasks = () => {
    const CHARTS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/charts'
    const { data, isLoading, error } = useDynamicQuery<ChartTypes>(CHARTS_ENDPOINT)

    const chartData = { type: "pendingTasks", title: "Pending Tasks", data: data?.pendingTasks }

    if (isLoading) return <Typography variant='h5'>Loading...</Typography>
    if (!data) return <Typography variant='h5'>No products data</Typography>
    if (error) return <Typography variant='h5'>{error.message}</Typography>

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Box sx={{ mb: 15, width: "90%" }}>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>{chartData.title}</Typography>
            </Box>
            <Box sx={{ width: "90%", height: "100%"}}>
                <DynamicChart data={chartData.data} type={chartData.type} />
            </Box>
        </Box>
    )
}

export default PendingTasks