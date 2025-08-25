import type { DashCardTypes, ChartTypes, Task } from "../../types";
import { useDynamicQuery } from "../../hooks"
import { Box, Paper, Typography, CircularProgress } from "@mui/material"
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, AreaChart, Area } from "recharts";
export const Dashboard = () => {

    const DASHCALCS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/dashCalcs';
    const CHARTS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/charts';
    const TASKS_ENDPOINT = "https://mock-data-api-vntk.onrender.com/tasks";

    const { data: dashData, isLoading: dashLoading, error: dashError } = useDynamicQuery<DashCardTypes>(DASHCALCS_ENDPOINT)
    const { data: chartsData, isLoading: chartsLoading, error: chartsdashError } = useDynamicQuery<ChartTypes>(CHARTS_ENDPOINT)
    const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useDynamicQuery<Task[]>(TASKS_ENDPOINT)

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
                {dashError && <Typography variant="h5">{dashError.message}</Typography>}
                {chartsdashError && <Typography variant="h5">{chartsdashError.message}</Typography>}
                {tasksError && <Typography variant="h5">{tasksError.message}</Typography>}
            </Box >
            <Box
                sx={{
                    height: "100%",
                    width: "90%",
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gridTemplateRows: "1fr 1fr 1fr",
                }}>
                <Paper sx={{ gridColumn: "1", gridRow: "1", display: "flex", flexDirection: "column" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mt: "15px", alignSelf: "center" }}>Total Products</Typography>
                    {chartsLoading || dashLoading ?
                        <CircularProgress sx={{ mt: "40px", alignSelf: "center" }} />
                        : (
                            <Typography variant="h6" sx={{ mt: "0px", ml: "15px", alignSelf: "center" }}>
                                {dashData?.productsInfo.total === 0 ? 'No listed products' : <Typography sx={{ fontWeight: "bold", fontSize: "80px" }}>{dashData?.productsInfo.total}</Typography>}
                            </Typography>
                        )}
                </Paper>
                <Paper sx={{ gridColumn: "2", gridRow: "1", display: "flex", flexDirection: "column" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mt: "15px", alignSelf: "center" }}>TOP 3</Typography>
                    {dashLoading ?
                        <CircularProgress sx={{ mt: "40px", alignSelf: "center" }} />
                        : (
                            <Box sx={{ mt: "20px", ml: "15px", position: "relative" }}>
                                {dashData?.productsInfo.total === 0 ? 'No listed products' : dashData?.topProducts.slice(0, 3)
                                    .map((prod, i) => (
                                        <Typography key={i} variant="h6" sx={{ position: "relative" }}>
                                            {prod.product}: <Typography sx={{ fontWeight: "bold", fontSize: "28px", position: "absolute", right: "50px", top: "-8px" }}>{prod.quantity}</Typography>
                                        </Typography>
                                    ))}
                            </Box>
                        )}
                </Paper>
                <Paper sx={{ gridColumn: "3", gridRow: "1", display: "flex", flexDirection: "column" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mt: "15px", alignSelf: "center" }}>Clients</Typography>
                    {chartsLoading || dashLoading ?
                        <CircularProgress sx={{ mt: "40px", alignSelf: "center" }} />
                        : (
                            <>
                                <Typography variant="h6" sx={{ mt: "20px", ml: "15px", position: "relative" }}>
                                    New clients: {dashData?.clientsChange.value === 0 ? 'No new clients' : <Typography sx={{ fontWeight: "bold", fontSize: "80px", position: "absolute", right: "50px", top: "-25px" }}>{dashData?.clientsChange.value}</Typography>}
                                </Typography>
                                <Box
                                    sx={{
                                        mt: "auto",
                                        ml: "15px",
                                        width: "45%",
                                        height: "100%",
                                        position: "relative",
                                        top: "16px",
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartsData?.clients}>
                                            <XAxis dataKey="month" hide />
                                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                                            <Tooltip labelFormatter={(label) => `${label}`} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Typography sx={{ mt: "auto", mb: "5px", mr: "10px", alignSelf: "end" }} variant="body1" color={dashData?.clientsChange.direction === "up" ? "green" : dashData?.clientsChange.direction === "down" ? "red" : "grey"}>
                                    {dashData?.clientsChange.percent}% {dashData?.clientsChange.direction === "up" ? "⬆️" : dashData?.clientsChange.direction === "down" ? "⬇️" : "➡️"} last month
                                </Typography>
                            </>
                        )}
                </Paper>
                <Paper sx={{ gridColumn: "4", gridRow: "1", display: "flex", flexDirection: "column" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mt: "15px", alignSelf: "center" }}>Invoices</Typography>
                    {chartsLoading || dashLoading ?
                        <CircularProgress sx={{ mt: "40px", alignSelf: "center" }} />
                        : (
                            <>
                                <Typography variant="h6" sx={{ mt: "20px", ml: "15px", position: "relative" }}>
                                    New invoices: {dashData?.invoicesChange.value === 0 ? 'No new invoices' : <Typography sx={{ fontWeight: "bold", fontSize: "80px", position: "absolute", right: "50px", top: "-25px" }}>{dashData?.invoicesChange.value}</Typography>}
                                </Typography>
                                <Box
                                    sx={{
                                        mt: "auto",
                                        ml: "15px",
                                        width: "45%",
                                        height: "100%",
                                        position: "relative",
                                        top: "16px",
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartsData?.invoices}>
                                            <XAxis dataKey="month" hide />
                                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                                            <Tooltip
                                                labelFormatter={(label) => `${label}`}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Typography sx={{ mt: "auto", mb: "5px", mr: "10px", alignSelf: "end" }} variant="body1" color={dashData?.invoicesChange.direction === "up" ? "green" : dashData?.invoicesChange.direction === "down" ? "red" : "grey"}>
                                    {dashData?.invoicesChange.percent}% {dashData?.invoicesChange.direction === "up" ? "⬆️" : dashData?.invoicesChange.direction === "down" ? "⬇️" : "➡️"} last month
                                </Typography>
                            </>
                        )}
                </Paper>
                <Paper sx={{ gridColumn: "1 / span 2", gridRow: "2 / span 3", display: "flex", flexDirection: "column" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mt: "15px", alignSelf: "center" }}>Revenues</Typography>
                    {chartsLoading || dashLoading ?
                        <CircularProgress sx={{ mt: "150px", alignSelf: "center" }} />
                        : (
                            <>
                                <Typography variant="h5" sx={{ mt: "50px", ml: "30px", mb: "55px", position: "relative" }}>
                                    Month Revenue: {dashData?.revenueChange.value === 0 ? 'No revenues this month' : <Typography sx={{ fontWeight: "bold", fontSize: "80px", position: "absolute", right: "50px", top: "-30px" }}>{dashData?.revenueChange.value}</Typography>}
                                </Typography>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartsData?.revenue}>
                                        <XAxis dataKey="month" hide />
                                        <Area type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={1} />
                                        <Tooltip
                                            labelFormatter={(label) => `${label}`}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                                <Typography sx={{ mt: "auto", mb: "5px", mr: "10px", alignSelf: "end" }} variant="body1" color={dashData?.revenueChange.direction === "up" ? "green" : dashData?.revenueChange.direction === "down" ? "red" : "grey"}>
                                    {dashData?.revenueChange.percent} % {dashData?.revenueChange.direction === "up" ? "⬆️" : dashData?.revenueChange.direction === "down" ? "⬇️" : "➡️"} last month
                                </Typography>
                            </>
                        )}
                </Paper>
                <Box
                    sx={{
                        gridColumn: "3 / span 2",
                        gridRow: "2 / span 3",
                        display: "grid",
                        gridTemplateRows: "1fr 1fr",
                        gap: 2,
                    }}>
                    <Paper sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="h4" sx={{ fontWeight: "bold", mt: "15px", alignSelf: "center" }}>Events</Typography>
                        {dashLoading ? (
                            <CircularProgress sx={{ mt: "40px", alignSelf: "center" }} />
                        ) : (
                            dashData?.eventsInfo.upcoming === 0 ? (
                                <Typography variant="h5" >
                                    No upcoming events
                                </Typography>

                            ) : (
                                <>
                                    <Typography variant="h5" sx={{ mt: "15px", ml: "30px", position: "relative" }}>
                                        Upcoming Events: {dashData?.eventsInfo.upcoming === 0 ? 'No upcoming events' : <Typography sx={{ fontWeight: "bold", fontSize: "80px", position: "absolute", right: "50px", top: "-30px" }}>{dashData?.eventsInfo.upcoming}</Typography>}
                                    </Typography>
                                    <Typography variant="h5" sx={{ mt: "15px", ml: "30px", position: "relative" }}>
                                        Next:
                                    </Typography>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "18px", alignSelf: "center", textAlign: "center", textTransform: "uppercase" }}>{dashData?.eventsInfo.next}</Typography>
                                </>
                            )
                        )}
                    </Paper>
                    <Paper sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="h4" sx={{ fontWeight: "bold", mt: "15px", alignSelf: "center" }}>Tasks</Typography>
                        {tasksLoading ?
                            <CircularProgress sx={{ mt: "40px", alignSelf: "center" }} />
                            :
                            tasksData?.length === 0 ? "No pending tasks" : (
                                <>
                                    <Typography variant="h5" sx={{ mt: "15px", ml: "30px", position: "relative" }} >
                                        Pending Tasks:
                                    </Typography>
                                    <Box sx={{ width: "fit-content", display: "flex", flexDirection: "column", gap: 0, overflowY: "scroll", maxHeight: "85px", alignSelf: "center" }}>
                                        {tasksData?.filter((task) => task.completed === false)
                                            .map((task) => (
                                                <Typography key={task.id} sx={{ fontWeight: "bold", fontSize: "18px", paddingInline: 4, textAlign: "center", textTransform: "uppercase" }}>
                                                    {task.title}
                                                </Typography>
                                            ))}
                                    </Box>
                                </>
                            )}
                    </Paper>
                </Box>
            </Box>
        </Box>
    )
}

export default Dashboard