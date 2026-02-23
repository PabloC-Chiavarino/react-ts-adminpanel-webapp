import type { DashCardTypes, ChartTypes, Task } from "../../types";
import { useDynamicQuery } from "../../hooks"
import { Box, Paper, Typography, CircularProgress, List, ListItem, ListItemIcon } from "@mui/material"
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, AreaChart, Area } from "recharts";
import { TrendingDown, TrendingFlat, TrendingUp, Inventory, EmojiEvents, People, Receipt, MonetizationOn, Event, Assignment, FiberManualRecord, CircleOutlined } from "@mui/icons-material";
export const Dashboard = () => {

    const DASHCALCS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/dashCalcs';
    const CHARTS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/charts';
    const TASKS_ENDPOINT = "https://mock-data-api-vntk.onrender.com/tasks";

    const { data: dashData, isLoading: dashLoading, error: dashError } = useDynamicQuery<DashCardTypes>(['calcs'], DASHCALCS_ENDPOINT)
    const { data: chartsData, isLoading: chartsLoading, error: chartsdashError } = useDynamicQuery<ChartTypes>(['charts'], CHARTS_ENDPOINT)
    const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useDynamicQuery<Task[]>(['tasks'], TASKS_ENDPOINT)

    const commonCardStyle = {
        display: "flex",
        flexDirection: "column",
        borderRadius: "8px",
        bgcolor: "background.paper",
        boxShadow: "5px 5px 5px 0 rgba(0, 0, 0, 0.36)",
        border: "1px solid rgba(255, 255, 255, 0.05)"
    };

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
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>Dashboard</Typography>
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
                <Paper sx={{ ...commonCardStyle, gridColumn: "1", gridRow: "1", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", mt: "15px" }}>
                        <Typography variant="h5" sx={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "1px" }}>
                            Total Products
                        </Typography>
                        <Inventory sx={{ fontSize: "30px", color: "#00e5ff" }} />
                    </Box>
                    {chartsLoading || dashLoading ?
                        <CircularProgress sx={{ mt: "40px", alignSelf: "center" }} />
                        : (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    textAlign: "center"
                                }}
                            >
                                {dashData?.productsInfo.total === 0
                                    ? 'No listed products'
                                    : <Typography sx={{ fontSize: "65px" }}>{dashData?.productsInfo.total}</Typography>
                                }
                            </Box>
                        )}
                </Paper>
                <Paper sx={{ ...commonCardStyle, gridColumn: "2", gridRow: "1" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", mt: "15px" }}>
                        <Typography variant="h5" sx={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "1px" }}>
                            TOP 3
                        </Typography>
                        <EmojiEvents sx={{ fontSize: "30px", color: "#ffd700" }} />
                    </Box>
                    {dashLoading ?
                        <CircularProgress sx={{ mt: "40px", alignSelf: "center" }} />
                        : (
                            <Box sx={{ paddingInline: "10px", mt: "10px" }}>
                                <List dense>
                                    {dashData?.productsInfo.total === 0 ? 'No listed products' : dashData?.topProducts.slice(0, 3)
                                        .map((prod, i) => (
                                            <ListItem key={i}>
                                                <ListItemIcon>
                                                    <FiberManualRecord sx={{ color: 'primary.main', fontSize: "15px" }} />
                                                </ListItemIcon>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    width: '100%'
                                                }}>
                                                    <Typography fontSize="18px">
                                                        {prod.product}
                                                    </Typography>
                                                    <Typography fontWeight="bold" fontSize="22px">
                                                        {prod.quantity}
                                                    </Typography>
                                                </Box>
                                            </ListItem>
                                        ))}
                                </List>
                            </Box>
                        )}
                </Paper>
                <Paper sx={{ ...commonCardStyle, gridColumn: "3", gridRow: "1" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", mt: "15px" }}>
                        <Typography variant="h5" sx={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "1px" }}>
                            Clients
                        </Typography>
                        <People sx={{ fontSize: "30px", color: "#d500f9" }} />
                    </Box>
                    {chartsLoading || dashLoading ?
                        <CircularProgress sx={{ mt: "40px", alignSelf: "center" }} />
                        : (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        paddingInline: "20px",
                                    }}
                                >
                                    <Box sx={{ gap: "10px", display: "flex", alignItems: "center" }}>
                                        <FiberManualRecord sx={{ color: 'primary.main', fontSize: "12px" }} />
                                        <Typography fontSize="18px">
                                            New clients
                                        </Typography>
                                    </Box>
                                    <Typography fontSize="65px" paddingInlineEnd="50px">
                                        {dashData?.clientsChange.value === 0
                                            ? "No new clients"
                                            : dashData?.clientsChange.value}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        mt: "auto",
                                        ml: "15px",
                                        width: "45%",
                                        height: "100%",
                                        position: "relative",
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
                                <Box sx={{ alignSelf: "end" }}>
                                    <Typography sx={{ mb: "5px", mr: "10px", alignSelf: "end", display: "flex", alignItems: "center", gap: "5px", fontSize: "15px" }} variant="body1" color={dashData?.clientsChange.direction === "up" ? "green" : dashData?.clientsChange.direction === "down" ? "red" : "grey"}>
                                        {dashData?.clientsChange.percent}% {dashData?.clientsChange.direction === "up" ? <TrendingUp /> : dashData?.clientsChange.direction === "down" ? <TrendingDown /> : <TrendingFlat />} last month
                                    </Typography>
                                </Box>
                            </>
                        )}
                </Paper>
                <Paper sx={{ ...commonCardStyle, gridColumn: "4", gridRow: "1" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", mt: "15px" }}>
                        <Typography variant="h5" sx={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "1px" }}>
                            Invoices
                        </Typography>
                        <Receipt sx={{ fontSize: "30px", color: "#ff9100" }} />
                    </Box>
                    {chartsLoading || dashLoading ?
                        <CircularProgress sx={{ mt: "40px", alignSelf: "center" }} />
                        : (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        paddingInline: "20px",
                                    }}
                                >
                                    <Box sx={{ gap: "10px", display: "flex", alignItems: "center" }}>
                                        <FiberManualRecord sx={{ color: 'primary.main', fontSize: "12px" }} />
                                        <Typography fontSize="18px">
                                            New invoices
                                        </Typography>
                                    </Box>
                                    <Typography fontSize="65px" paddingInlineEnd="50px">
                                        {dashData?.invoicesChange.value === 0
                                            ? "No new invoices"
                                            : dashData?.invoicesChange.value}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        mt: "auto",
                                        ml: "15px",
                                        width: "45%",
                                        height: "100%",
                                        position: "relative",
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
                                <Box sx={{ alignSelf: "end" }}>
                                    <Typography sx={{ mb: "5px", mr: "10px", alignSelf: "end", display: "flex", alignItems: "center", gap: "5px", fontSize: "15px" }} variant="body1" color={dashData?.invoicesChange.direction === "up" ? "green" : dashData?.invoicesChange.direction === "down" ? "red" : "grey"}>
                                        {dashData?.invoicesChange.percent}% {dashData?.invoicesChange.direction === "up" ? <TrendingUp /> : dashData?.invoicesChange.direction === "down" ? <TrendingDown /> : <TrendingFlat />} last month
                                    </Typography>
                                </Box>
                            </>
                        )}
                </Paper>
                <Paper sx={{ ...commonCardStyle, gridColumn: "1 / span 2", gridRow: "2 / span 3" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", mt: "15px" }}>
                        <Typography variant="h5" sx={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "1px" }}>
                            Revenues
                        </Typography>
                        <MonetizationOn sx={{ fontSize: "30px", color: "#00e676" }} />
                    </Box>
                    {chartsLoading || dashLoading ?
                        <CircularProgress sx={{ mt: "150px", alignSelf: "center" }} />
                        : (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        paddingInline: "20px",
                                        mt: "15px",
                                        mb: "15px"
                                    }}
                                >
                                    <Box sx={{ gap: "10px", display: "flex", alignItems: "center" }}>
                                        <FiberManualRecord sx={{ color: 'primary.main', fontSize: "12px" }} />
                                        <Typography fontSize="18px">
                                            Month Revenue
                                        </Typography>
                                    </Box>
                                    <Typography fontSize="65px" paddingInlineEnd="50px">
                                        {dashData?.revenueChange.value === 0
                                            ? "No revenues this month"
                                            : `$${dashData?.revenueChange.value}`}
                                    </Typography>
                                </Box>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartsData?.revenue}>
                                        <XAxis dataKey="month" hide />
                                        <Area type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={1} />
                                        <Tooltip
                                            labelFormatter={(label) => `${label}`}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                                <Box sx={{ alignSelf: "end" }}>
                                    <Typography sx={{ mb: "5px", mr: "10px", alignSelf: "end", display: "flex", alignItems: "center", gap: "5px", fontSize: "15px" }} variant="body1" color={dashData?.revenueChange.direction === "up" ? "green" : dashData?.revenueChange.direction === "down" ? "red" : "grey"}>
                                        {dashData?.revenueChange.percent} % {dashData?.revenueChange.direction === "up" ? <TrendingUp /> : dashData?.revenueChange.direction === "down" ? <TrendingDown /> : <TrendingFlat />} last month
                                    </Typography>
                                </Box>
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
                    <Paper sx={{ ...commonCardStyle }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", mt: "15px" }}>
                            <Typography variant="h5" sx={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "1px" }}>
                                Events
                            </Typography>
                            <Event sx={{ fontSize: "30px", color: "#f50057" }} />
                        </Box>
                        {dashLoading ? (
                            <CircularProgress sx={{ mt: "40px", alignSelf: "center" }} />
                        ) : (
                            dashData?.eventsInfo.upcoming === 0 ? (
                                <Typography variant="h6" >
                                    No upcoming events
                                </Typography>

                            ) : (
                                <>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            paddingInline: "20px",
                                        }}
                                    >
                                        <Box sx={{ gap: "10px", display: "flex", alignItems: "center" }}>
                                            <FiberManualRecord sx={{ color: 'primary.main', fontSize: "12px" }} />
                                            <Typography fontSize="18px">
                                                Upcoming Events
                                            </Typography>
                                        </Box>
                                        <Typography fontSize="65px" paddingInlineEnd="50px">
                                            {dashData?.eventsInfo.upcoming === 0
                                                ? "No upcoming events"
                                                : dashData?.eventsInfo.upcoming}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" sx={{ position: "relative", alignSelf: "center" }}>
                                        Next
                                    </Typography>
                                    <Typography sx={{ fontSize: "16px", alignSelf: "center", textAlign: "center", textTransform: "uppercase" }}>{dashData?.eventsInfo.next}</Typography>
                                </>
                            )
                        )}
                    </Paper>
                    <Paper sx={{ ...commonCardStyle }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", mt: "15px" }}>
                            <Typography variant="h5" sx={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "1px" }}>
                                Tasks
                            </Typography>
                            <Assignment sx={{ fontSize: "30px", color: "#2979ff" }} />
                        </Box>
                        {tasksLoading ?
                            <CircularProgress sx={{ mt: "40px", alignSelf: "center" }} />
                            :
                            tasksData?.length === 0 ? "No pending tasks" : (
                                <>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            paddingInline: "20px",
                                        }}
                                    >
                                        <Box sx={{ gap: "10px", display: "flex", alignItems: "center" }}>
                                            <FiberManualRecord sx={{ color: 'primary.main', fontSize: "12px" }} />
                                            <Typography fontSize="18px">
                                                Pending Tasks
                                            </Typography>
                                        </Box>
                                        <Typography fontSize="65px" paddingInlineEnd="50px">
                                            {tasksData?.filter(t => !t.completed).length}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, maxHeight: "85px", overflowY: "scroll", paddingInline: "20px", bottom: "25px", position: "relative" }}>
                                        {tasksData?.filter((task) => task.completed === false)
                                            .map((task) => (
                                                <Box key={task.id} sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <CircleOutlined sx={{ color: 'text.secondary', fontSize: '10px' }} />
                                                    <Typography>
                                                        {task.title}
                                                    </Typography>
                                                </Box>
                                            ))}
                                    </Box>
                                </>
                            )}
                    </Paper>
                </Box>
            </Box >
        </Box >
    )
}

export default Dashboard