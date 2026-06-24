import { Box, Typography, CircularProgress } from "@mui/material"
import { useDynamicQuery } from "../../hooks"
import type { ChartTypes } from "../../types"
import { DynamicChart } from "../../components"
import { API_BASE_URL } from '../../config'

const ClientsChart = () => {
    const CHARTS_ENDPOINT = `${API_BASE_URL}/charts`
    const { data, isLoading, error } = useDynamicQuery<ChartTypes>(['charts'], CHARTS_ENDPOINT)

    const chartData = { type: "clients", title: "Clients", data: data?.clients }

    if (isLoading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><CircularProgress size={60} /></Box>
    if (error) return <Typography variant='h2' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontWeight: "bold", fontSize: "24px", mb: 15 }}>{error.message}</Typography>

    return (
        <Box sx={{
            width: "100%",
            height: "90%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Box sx={{ mb: 6, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h1">{chartData.title}</Typography>
            </Box>
            {!data ? (
                <Typography variant='h2' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontWeight: "bold", fontSize: "24px", mb: 15 }}>No clients data</Typography>
            ) : (
                <Box sx={{ width: "100%", height: "100%" }}>
                    <DynamicChart data={chartData.data} type={chartData.type} />
                </Box>
            )}
        </Box>
    )
}

export default ClientsChart