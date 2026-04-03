import type { DashCardTypes, ChartTypes, Task } from "../../types";
import { useNavigate } from "react-router-dom";
import { useDynamicQuery } from "../../hooks"
import { Box, Paper, Typography, CircularProgress, List, ListItem } from "@mui/material"
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, AreaChart, Area } from "recharts";
import {
    TrendingDown,
    TrendingFlat,
    TrendingUp,
    Inventory2Outlined,
    EmojiEventsOutlined,
    PeopleOutlined,
    ShoppingCartOutlined,
    ReceiptOutlined,
    MonetizationOnOutlined,
    EventOutlined,
    ScheduleOutlined,
    TaskOutlined,
    NotesOutlined
} from "@mui/icons-material";

export const Dashboard = () => {

    const DASHCALCS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/dashCalcs';
    const CHARTS_ENDPOINT = 'https://mock-data-api-vntk.onrender.com/charts';
    const TASKS_ENDPOINT = "https://mock-data-api-vntk.onrender.com/tasks";

    const { data: dashData, isLoading: dashLoading, error: dashError } = useDynamicQuery<DashCardTypes>(['calcs'], DASHCALCS_ENDPOINT)
    const { data: chartsData, isLoading: chartsLoading, error: chartsdashError } = useDynamicQuery<ChartTypes>(['charts'], CHARTS_ENDPOINT)
    const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useDynamicQuery<Task[]>(['tasks'], TASKS_ENDPOINT)

    const navigate = useNavigate();

    const commonCardStyle = {
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        bgcolor: "background.paper",
        boxShadow: "1px 1px 1px 0 rgba(0, 0, 0, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.02)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",

        '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `
                radial-gradient(
                    circle at 120% -20%,
                    rgba(136, 123, 255, 0.18) 0%,
                    rgba(136, 123, 255, 0.10) 25%,
                    rgba(136, 123, 255, 0.05) 45%,
                    rgba(136, 123, 255, 0.02) 60%,
                    transparent 80%
                )
                `,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
        },

        '&:hover::before': {
            opacity: 1,
        },
    };

    const formatEventDate = (startDate: string) => {
        if (!startDate) return { day: "", month: "", hour: "" };

        const [date, time] = startDate.split("T");
        const [year, month, day] = date.split("-");

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedYear = parseInt(year, 10);
        const formattedMonth = months[parseInt(month, 10) - 1];
        const formattedDay = parseInt(day, 10);
        const formattedHour = time ? time.substring(0, 5) : "";

        return { year: formattedYear, month: formattedMonth, day: formattedDay, hour: formattedHour };
    };

    if (dashLoading) return <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}><CircularProgress size={60} /></Box>
    if (dashError) return <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}><Typography variant="h1">{dashError.message}</Typography></Box>

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
        }}>
            <Typography variant="h1" sx={{ mb: 5 }}>
                Dashboard
            </Typography>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: "repeat(8, 1fr)",
                    gridTemplateRows: "1fr 1.5fr 1.5fr",
                }}>
                <Paper onClick={() => navigate("/invoices")} sx={{ ...commonCardStyle, gridColumn: "span 2", gridRow: "1", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", width: "100%", position: "absolute", top: "15px" }}>
                        <Typography variant="h2" sx={{ fontSize: "20px", fontWeight: "bold" }}>
                            Invoices
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <ReceiptOutlined sx={{ fontSize: "20px", color: 'text.secondary' }} />
                        </Box>
                    </Box>
                    {chartsLoading ?
                        <CircularProgress size={40} sx={{ m: "auto" }} />
                        : chartsdashError ? (
                            <Typography variant="h1">{chartsdashError.message}</Typography>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "fit-content",
                                        paddingInline: "20px",
                                        gap: "30px",
                                        position: "absolute",
                                        bottom: "12px",
                                    }}
                                >
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Typography fontSize="14px" color="text.secondary">
                                            Total
                                        </Typography>
                                        <Typography fontSize="35px" fontWeight="bold" color="tertiary.main">
                                            {dashData?.invoices.total === 0
                                                ? "No invoices"
                                                : dashData?.invoices.total}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Typography fontSize="14px" color="text.secondary">
                                            New
                                        </Typography>
                                        <Typography fontSize="35px" fontWeight="bold" color="primary.main">
                                            {dashData?.invoices.change.value === 0
                                                ? "No new invoices"
                                                : dashData?.invoices.change.value}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        width: "45%",
                                        height: "45%",
                                        position: "absolute",
                                        right: "20px",
                                        top: "50%",
                                        transform: "translateY(-35%)",
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartsData?.invoices}>
                                            <XAxis dataKey="month" hide />
                                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                                            <Tooltip labelFormatter={(label) => `${label}`} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Box sx={{ position: "absolute", bottom: "10px", right: "10px" }}>
                                    <Typography sx={{ mr: "10px", display: "flex", alignItems: "center", gap: "5px", fontSize: "14px" }} variant="body1" color={dashData?.invoices.change.direction === "up" ? "green" : dashData?.invoices.change.direction === "down" ? "#ff0000b9" : "grey"}>
                                        {dashData?.invoices.change.percent}% {dashData?.invoices.change.direction === "up" ? <TrendingUp /> : dashData?.invoices.change.direction === "down" ? <TrendingDown /> : <TrendingFlat />} last month
                                    </Typography>
                                </Box>
                            </>
                        )}
                </Paper>
                <Paper onClick={() => navigate("/clients")} sx={{ ...commonCardStyle, gridColumn: "span 2", gridRow: "1", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", width: "100%", position: "absolute", top: "15px" }}>
                        <Typography variant="h2" sx={{ fontSize: "20px", fontWeight: "bold" }}>
                            Clients
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <PeopleOutlined sx={{ fontSize: "20px", color: 'text.secondary' }} />
                        </Box>
                    </Box>
                    {chartsLoading ?
                        <CircularProgress size={40} sx={{ m: "auto" }} />
                        : chartsdashError ? (
                            <Typography variant="h1">{chartsdashError.message}</Typography>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "fit-content",
                                        paddingInline: "20px",
                                        gap: "30px",
                                        position: "absolute",
                                        bottom: "12px",
                                    }}
                                >
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Typography fontSize="14px" color="text.secondary">
                                            Total
                                        </Typography>
                                        <Typography fontSize="35px" fontWeight="bold" color="tertiary.main">
                                            {dashData?.clients.total === 0
                                                ? "No clients"
                                                : dashData?.clients.total}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Typography fontSize="14px" color="text.secondary">
                                            New
                                        </Typography>
                                        <Typography fontSize="35px" fontWeight="bold" color="primary.main">
                                            {dashData?.clients.change.value === 0
                                                ? "No new clients"
                                                : dashData?.clients.change.value}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        width: "45%",
                                        height: "45%",
                                        position: "absolute",
                                        right: "20px",
                                        top: "50%",
                                        transform: "translateY(-35%)",
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
                                <Box sx={{ position: "absolute", bottom: "10px", right: "10px" }}>
                                    <Typography sx={{ mr: "10px", display: "flex", alignItems: "center", gap: "5px", fontSize: "14px" }} variant="body1" color={dashData?.clients.change.direction === "up" ? "green" : dashData?.clients.change.direction === "down" ? "#ff0000b9" : "grey"}>
                                        {dashData?.clients.change.percent}% {dashData?.clients.change.direction === "up" ? <TrendingUp /> : dashData?.clients.change.direction === "down" ? <TrendingDown /> : <TrendingFlat />} last month
                                    </Typography>
                                </Box>
                            </>
                        )}
                </Paper>
                <Paper onClick={() => navigate("/orders")} sx={{ ...commonCardStyle, gridColumn: "span 2", gridRow: "1", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", width: "100%", position: "absolute", top: "15px" }}>
                        <Typography variant="h2" sx={{ fontSize: "20px", fontWeight: "bold" }}>
                            Pending Orders
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <ShoppingCartOutlined sx={{ fontSize: "20px", color: "text.secondary" }} />
                        </Box>
                    </Box>
                    {chartsLoading ?
                        <CircularProgress size={40} sx={{ m: "auto" }} />
                        : chartsdashError ? (
                            <Typography variant="h1">{chartsdashError.message}</Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    mt: "80px"
                                }}
                            >
                                <Typography fontSize="14px" color="text.secondary">
                                    Total
                                </Typography>
                                {dashData?.pendingOrders.total === 0
                                    ? 'No pending orders'
                                    : <Typography sx={{ fontSize: "45px", fontWeight: "bold", color: "primary.main" }}>{dashData?.pendingOrders.total}</Typography>
                                }
                            </Box>
                        )}
                </Paper>
                <Paper onClick={() => navigate("/products")} sx={{ ...commonCardStyle, gridColumn: "span 2", gridRow: "1", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", width: "100%", position: "absolute", top: "15px" }}>
                        <Typography variant="h2" sx={{ fontSize: "20px", fontWeight: "bold" }}>
                            Products
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <Inventory2Outlined sx={{ fontSize: "20px", color: "text.secondary" }} />
                        </Box>
                    </Box>
                    {chartsLoading ?
                        <CircularProgress size={40} sx={{ m: "auto" }} />
                        : chartsdashError ? (
                            <Typography variant="h1">{chartsdashError.message}</Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    mt: "80px"
                                }}
                            >
                                <Typography fontSize="14px" color="text.secondary">
                                    Total
                                </Typography>
                                {dashData?.products.total === 0
                                    ? 'No listed products'
                                    : <Typography sx={{ fontSize: "45px", fontWeight: "bold", color: "primary.main" }}>{dashData?.products.total}</Typography>
                                }
                            </Box>
                        )}
                </Paper>
                <Paper onClick={() => navigate("/invoices")} sx={{ ...commonCardStyle, gridColumn: "span 5", gridRow: "2", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", width: "100%", position: "absolute", top: "15px" }}>
                        <Box>
                            <Typography variant="h2" sx={{ fontSize: "20px", fontWeight: "bold" }}>
                                Revenues Insights
                            </Typography>
                            <Typography variant="h3" sx={{ fontSize: "14px", color: "text.secondary" }}>
                                Total and monthly revenues
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <MonetizationOnOutlined sx={{ fontSize: "20px", color: "text.secondary" }} />
                        </Box>
                    </Box>
                    {chartsLoading ?
                        <CircularProgress size={40} sx={{ m: "auto" }} />
                        : chartsdashError ? (
                            <Typography variant="h1">{chartsdashError.message}</Typography>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "fit-content",
                                        paddingInline: "20px",
                                        gap: "60px",
                                        position: "absolute",
                                        bottom: "12px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography fontSize="14px" color="text.secondary">
                                            Total
                                        </Typography>
                                        <Typography fontSize="42px" fontWeight="bold" color="tertiary.main">
                                            {dashData?.revenue.total === 0
                                                ? "No revenues this month"
                                                : `$${dashData?.revenue.total}`}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography fontSize="14px" color="text.secondary">
                                            Monthly
                                        </Typography>
                                        <Typography fontSize="42px" fontWeight="bold" color="primary.main">
                                            {dashData?.revenue.change.value === 0
                                                ? "No revenues this month"
                                                : `$${dashData?.revenue.change.value}`}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        width: "60%",
                                        height: "50%",
                                        position: "absolute",
                                        right: "20px",
                                        top: "50%",
                                        transform: "translateY(-35%)",
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartsData?.revenue}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#998AFFFF" stopOpacity={0.35} />
                                                    <stop offset="50%" stopColor="#998AFFFF" stopOpacity={0.12} />
                                                    <stop offset="100%" stopColor="#998AFFFF" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" hide />
                                            <Area type="monotone" dataKey="value" stroke="#998AFFFF" strokeWidth={1.8} fill="url(#colorRevenue)" />
                                            <Tooltip
                                                labelFormatter={(label) => `${label}`}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Box sx={{ position: "absolute", bottom: "10px", right: "10px" }}>
                                    <Typography sx={{ mb: "5px", mr: "10px", alignSelf: "end", display: "flex", alignItems: "center", gap: "5px", fontSize: "14px" }} variant="body1" color={dashData?.revenue.change.direction === "up" ? "green" : dashData?.revenue.change.direction === "down" ? "#ff0000b9" : "grey"}>
                                        {dashData?.revenue.change.percent} % {dashData?.revenue.change.direction === "up" ? <TrendingUp /> : dashData?.revenue.change.direction === "down" ? <TrendingDown /> : <TrendingFlat />} last month
                                    </Typography>
                                </Box>
                            </>
                        )}
                </Paper>
                <Paper onClick={() => navigate("/users")} sx={{ ...commonCardStyle, gridColumn: "span 3", gridRow: "2", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", width: "100%", position: "absolute", top: "15px" }}>
                        <Box>
                            <Typography variant="h2" sx={{ fontSize: "20px", fontWeight: "bold" }}>
                                Top Performers
                            </Typography>
                            <Typography variant="h3" sx={{ fontSize: "14px", color: "text.secondary" }}>
                                Highest sales volume this month
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <EmojiEventsOutlined sx={{ fontSize: "20px", color: "text.secondary" }} />
                        </Box>
                    </Box>
                    {dashLoading ?
                        <CircularProgress size={40} sx={{ m: "auto" }} />
                        : (
                            <Box sx={{ paddingInline: "10px", position: "absolute", top: "70px", width: "100%" }}>
                                <List dense>
                                    {dashData?.products.total === 0 ? 'No listed products' : dashData?.topProducts.slice(0, 3)
                                        .map((prod, i) => (
                                            <ListItem key={i}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    width: '100%'
                                                }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '30px',
                                                        width: '100%'
                                                    }}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '34px',
                                                            height: '34px',
                                                            backgroundColor: 'background.alt',
                                                            borderRadius: '10px',
                                                            color: 'primary.main',
                                                            fontWeight: 'bold',
                                                            fontSize: "14px",
                                                        }}>
                                                            {i + 1}
                                                        </Box>
                                                        <Typography fontSize="18px" sx={{ fontWeight: "bold" }}>
                                                            {prod.product}
                                                        </Typography>
                                                    </Box>
                                                    <Typography fontWeight="bold" fontSize="35px" color="primary.main">
                                                        {prod.quantity}
                                                    </Typography>
                                                </Box>
                                            </ListItem>
                                        ))}
                                </List>
                            </Box>
                        )}
                </Paper>
                <Paper onClick={() => navigate("/calendar")} sx={{ ...commonCardStyle, gridColumn: "span 4", gridRow: "3", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", width: "100%", position: "absolute", top: "15px" }}>
                        <Box>
                            <Typography variant="h2" sx={{ fontSize: "20px", fontWeight: "bold" }}>
                                Upcoming Events
                            </Typography>
                            <Typography variant="h3" sx={{ fontSize: "14px", color: "text.secondary" }}>
                                Your most closely approaching events
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            borderRadius: '10px',
                            backgroundColor: 'background.alt',
                        }}>
                            <EventOutlined sx={{ fontSize: "20px", color: "text.primary" }} />
                        </Box>
                    </Box>
                    {dashLoading ? (
                        <CircularProgress size={40} sx={{ m: "auto" }} />
                    ) : (
                        dashData?.events.total === 0 ? (
                            <Typography variant="h6" sx={{ fontWeight: "bold", alignSelf: "center", mt: "40px" }} >
                                No upcoming events
                            </Typography>
                        ) : (
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                maxHeight: "180px",
                                paddingInline: "20px",
                                mt: "80px",
                                pb: "30px",
                                gap: .5,
                                overflowY: "auto",
                                scrollbarWidth: "none",
                                "&::-webkit-scrollbar": {
                                    display: "none",
                                },
                                maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 75%, transparent 100%)",
                                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 75%, transparent 100%)",
                            }}>
                                {dashData?.events.upcoming.map((event) => {
                                    const title = event?.title ?? ""
                                    const { day, month, hour } = formatEventDate(event.startDate ?? "");
                                    return (
                                        <Box key={event.id} sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 5,
                                            mt: "10px",
                                            py: "10px",
                                            px: "10px",
                                            backgroundColor: "background.paper2",
                                            borderRadius: "14px",
                                            width: "100%",
                                            position: "relative"
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: "column",
                                                width: '48px',
                                                height: '48px',
                                                backgroundColor: 'background.alt',
                                                borderRadius: '10px',
                                                color: 'primary.main',
                                                fontWeight: 'bold',
                                                fontSize: "14px",
                                            }}>
                                                <Typography sx={{ fontSize: "12px", color: "text.primary", textAlign: "center", mt: "10px", lineHeight: ".5" }}>{month}</Typography>
                                                <Typography sx={{ fontSize: "20px", fontWeight: "bold", color: "primary.main", textAlign: "center" }}>{day}</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "background.paper2" }}>
                                                <Typography sx={{ fontSize: "16px", fontWeight: "bold", color: "text.primary" }}>{title}</Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <NotesOutlined sx={{ fontSize: "16px", color: "text.secondary" }} />
                                                    <Typography sx={{ fontSize: "14px", color: "text.secondary", alignSelf: "center", textAlign: "center" }}>{event.qNote ? "Quick Note: " : ""}</Typography>
                                                    <Typography sx={{ fontSize: "14px", color: "tertiary.main", alignSelf: "center", textAlign: "center" }}>{event.qNote}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", position: "absolute", right: "40px" }}>
                                                <ScheduleOutlined sx={{ fontSize: "16px", color: "text.secondary" }} />
                                                <Typography sx={{ fontSize: "14px", color: "text.primary", fontWeight: 600, alignSelf: "center", textAlign: "center" }}>{hour}</Typography>
                                            </Box>
                                        </Box>
                                    )
                                })}
                            </Box>
                        )
                    )}
                </Paper>
                <Paper onClick={() => navigate("/tasker")} sx={{ ...commonCardStyle, gridColumn: "span 4", gridRow: "3", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "20px", width: "100%", position: "absolute", top: "15px" }}>
                        <Box>
                            <Typography variant="h2" sx={{ fontSize: "20px", fontWeight: "bold" }}>
                                Operational Tasks
                            </Typography>
                            <Typography variant="h3" sx={{ fontSize: "14px", color: "text.secondary" }}>
                                Items requiring your immediate attention
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <TaskOutlined sx={{ fontSize: "20px", color: "text.secondary" }} />
                        </Box>
                    </Box>
                    {tasksLoading ?
                        <CircularProgress size={40} sx={{ m: "auto" }} />
                        : tasksError ? (
                            <Typography variant="h1">{tasksError.message}</Typography>
                        )
                            : tasksData?.length === 0 ? "No pending tasks" : (
                                <>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            paddingInline: "20px",
                                            mt: "80px"
                                        }}
                                    >
                                        <Box sx={{
                                            width: "70%", maxHeight: "180px", display: "flex", flexDirection: "column", gap: 4, paddingTop: "10px", paddingBottom: "30px", overflowY: "auto", scrollbarWidth: "none",
                                            "&::-webkit-scrollbar": {
                                                display: "none",
                                            },
                                            maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 75%, transparent 100%)",
                                            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 75%, transparent 100%)",
                                        }}>
                                            {tasksData?.filter((task) => task.completed === false)
                                                .map((task) => (
                                                    <Box key={task.id} sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                                        <Box sx={{
                                                            py: .3,
                                                            px: 1.2,
                                                            textAlign: 'center',
                                                            backgroundColor: `priorityStyles.${task.priority}.bg`,
                                                            color: `priorityStyles.${task.priority}.color`,
                                                            borderRadius: "9999px",
                                                            boxShadow: "0px 2px 4px #00000014, 0px 0px 0px #171a1f00"
                                                        }}>
                                                            <Typography sx={{ fontSize: "10px", fontWeight: 700 }}>{task.priority.toUpperCase()}</Typography>
                                                        </Box>
                                                        <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
                                                            {task.title}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                        </Box>
                                        <Box sx={{
                                            minWidth: '110px',
                                            height: "fit-content",
                                            py: .7,
                                            textAlign: 'center',
                                            mt: 2.5,
                                            background: '#2b2945',
                                            borderRadius: "16px",
                                            boxShadow: "0px 2px 4px #00000014, 0px 0px 0px #171a1f00"
                                        }}>
                                            <Typography sx={{ fontSize: "12px", color: "tertiary.main", fontWeight: "600" }}>{tasksData?.filter(t => !t.completed).length === 0
                                                ? "No tasks"
                                                : tasksData?.filter(t => !t.completed).length} PENDING</Typography>
                                        </Box>
                                    </Box>
                                </>
                            )}
                </Paper>
            </Box>
        </Box >
    )
}

export default Dashboard