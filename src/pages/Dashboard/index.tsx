import type { DashCardTypes, ChartTypes, Task } from "../../types";
import { useNavigate } from "react-router-dom";
import { useDynamicQuery } from "../../hooks"
import { Box, Paper, Typography, CircularProgress, List, ListItem, useTheme, useMediaQuery } from "@mui/material"
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
import { API_BASE_URL } from '../../config';

export const Dashboard = () => {

    const DASHCALCS_ENDPOINT = `${API_BASE_URL}/dashCalcs`;
    const CHARTS_ENDPOINT = `${API_BASE_URL}/charts`;
    const TASKS_ENDPOINT = `${API_BASE_URL}/tasks`;

    const { data: dashData, isLoading: dashLoading, error: dashError } = useDynamicQuery<DashCardTypes>(['calcs'], DASHCALCS_ENDPOINT)
    const { data: chartsData, isLoading: chartsLoading, error: chartsdashError } = useDynamicQuery<ChartTypes>(['charts'], CHARTS_ENDPOINT)
    const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useDynamicQuery<Task[]>(['tasks'], TASKS_ENDPOINT)

    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));

    const gridCols = isXs ? 1 : isSm ? 4 : isMd ? 6 : 8;

    const commonCardStyle = {
        display: "flex",
        flexDirection: "column",
        borderRadius: { xs: '12px', sm: '14px', md: '16px' },
        bgcolor: "background.paper",
        boxShadow: isDark ? "1px 1px 1px 0 rgba(0, 0, 0, 0.3)" : "0 1px 4px rgba(0, 0, 0, 0.06)",
        border: isDark ? "1px solid rgba(255, 255, 255, 0.02)" : "1px solid rgba(0, 0, 0, 0.04)",
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
            <Typography variant="h1" className="dash-page-title" sx={{ mb: 5, fontSize: { lg: '2.2rem', xl: '2.5rem' } }}>
                Dashboard
            </Typography>
            <Box
                className="dashboard-grid"
                sx={{
                    width: "100%",
                    height: { xl: "100%", lg: "auto" },
                    display: "grid",
                    gap: { xs: 1.5, sm: 2 },
                    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                    gridAutoRows: isXs ? 'auto' : undefined,
                    gridTemplateRows: isXs ? undefined : { sm: "auto auto auto", md: "minmax(150px, auto) minmax(170px, auto) minmax(170px, auto)", lg: "minmax(180px, auto) minmax(225px, auto) minmax(200px, auto)", xl: "1fr 1.5fr 1.5fr" },
                }}>
                <Paper onClick={() => navigate("/invoices")} sx={{ ...commonCardStyle, gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 3', lg: 'span 2' }, gridRow: "1", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: { xs: '12px', sm: '16px', md: '18px', lg: '18px', xl: '20px' }, width: "100%", position: "absolute", top: { xs: '10px', sm: '12px', md: '15px' } }}>
                        <Typography variant="h2" className="dash-card-title" sx={{ fontSize: { xs: '15px', sm: '17px', md: '18px', lg: '18px', xl: '20px' }, fontWeight: "bold" }}>
                            Invoices
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            height: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <ReceiptOutlined sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '18px', xl: '20px' }, color: 'text.secondary' }} />
                        </Box>
                    </Box>
                    {chartsLoading ?
                        <CircularProgress size={40} sx={{ m: "auto" }} />
                        : chartsdashError ? (
                            <Typography variant="h1">{chartsdashError.message}</Typography>
                        ) : (
                            <>
                                <Box
                                    className="dash-stat-row"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "fit-content",
                                        paddingInline: { xs: '12px', sm: '16px', md: '18px', lg: '18px', xl: '20px' },
                                        gap: { xs: '8px', sm: '16px', md: '22px', lg: '22px', xl: '30px' },
                                        position: "absolute",
                                        bottom: { xs: '8px', sm: '10px', md: '12px' },
                                    }}
                                >
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Typography fontSize={{ xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' }} color="text.secondary">
                                            Total
                                        </Typography>
                                        <Typography fontSize={{ xs: '20px', sm: '26px', md: '30px', lg: '26px', xl: '35px' }} fontWeight="bold" color="tertiary.main">
                                            {dashData?.invoices.total === 0
                                                ? "No invoices"
                                                : dashData?.invoices.total}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Typography fontSize={{ xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' }} color="text.secondary">
                                            New
                                        </Typography>
                                        <Typography fontSize={{ xs: '20px', sm: '26px', md: '30px', lg: '26px', xl: '35px' }} fontWeight="bold" color="primary.main">
                                            {dashData?.invoices.change.value === 0
                                                ? "No new invoices"
                                                : dashData?.invoices.change.value}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    className="dash-stat-chart"
                                    sx={{
                                        width: { xs: '35%', sm: '38%', md: '40%', lg: '40%', xl: '45%' },
                                        height: { xs: '35%', sm: '38%', md: '40%', lg: '40%', xl: '45%' },
                                        position: "absolute",
                                        right: { xs: '12px', sm: '15px', md: '18px', lg: '18px', xl: '20px' },
                                        top: "50%",
                                        transform: "translateY(-35%)",
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartsData?.invoices}>
                                            <XAxis dataKey="month" hide />
                                            <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} strokeWidth={2.5} />
                                            <Tooltip labelFormatter={(label) => `${label}`} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Box sx={{ position: "absolute", bottom: { xs: '6px', sm: '8px', md: '10px' }, right: { xs: '6px', sm: '8px', md: '10px' } }}>
                                    <Typography sx={{ mr: "5px", display: "flex", alignItems: "center", gap: "3px", fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '12px', xl: '14px' } }} variant="body1" color={dashData?.invoices.change.direction === "up" ? "success.main" : dashData?.invoices.change.direction === "down" ? "error.main" : "text.secondary"}>
                                         {dashData?.invoices.change.percent}% {dashData?.invoices.change.direction === "up" ? <TrendingUp sx={{ fontSize: { xs: '12px', sm: '14px' } }} /> : dashData?.invoices.change.direction === "down" ? <TrendingDown sx={{ fontSize: { xs: '12px', sm: '14px' } }} /> : <TrendingFlat sx={{ fontSize: { xs: '12px', sm: '14px' } }} />} <span className="hide-last-month">last month</span>
                                    </Typography>
                                </Box>
                            </>
                        )}
                </Paper>
                <Paper onClick={() => navigate("/clients")} sx={{ ...commonCardStyle, gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 3', lg: 'span 2' }, gridRow: "1", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: { xs: '12px', sm: '16px', md: '18px', lg: '18px', xl: '20px' }, width: "100%", position: "absolute", top: { xs: '10px', sm: '12px', md: '15px' } }}>
                        <Typography variant="h2" className="dash-card-title" sx={{ fontSize: { xs: '15px', sm: '17px', md: '18px', lg: '18px', xl: '20px' }, fontWeight: "bold" }}>
                            Clients
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            height: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <PeopleOutlined sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '18px', xl: '20px' }, color: 'text.secondary' }} />
                        </Box>
                    </Box>
                    {chartsLoading ?
                        <CircularProgress size={40} sx={{ m: "auto" }} />
                        : chartsdashError ? (
                            <Typography variant="h1">{chartsdashError.message}</Typography>
                        ) : (
                            <>
                                <Box
                                    className="dash-stat-row"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "fit-content",
                                        paddingInline: { xs: '12px', sm: '16px', md: '18px', lg: '18px', xl: '20px' },
                                        gap: { xs: '8px', sm: '16px', md: '22px', lg: '22px', xl: '30px' },
                                        position: "absolute",
                                        bottom: { xs: '8px', sm: '10px', md: '12px' },
                                    }}
                                >
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Typography fontSize={{ xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' }} color="text.secondary">
                                            Total
                                        </Typography>
                                        <Typography fontSize={{ xs: '20px', sm: '26px', md: '30px', lg: '26px', xl: '35px' }} fontWeight="bold" color="tertiary.main">
                                            {dashData?.clients.total === 0
                                                ? "No clients"
                                                : dashData?.clients.total}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Typography fontSize={{ xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' }} color="text.secondary">
                                            New
                                        </Typography>
                                        <Typography fontSize={{ xs: '20px', sm: '26px', md: '30px', lg: '26px', xl: '35px' }} fontWeight="bold" color="primary.main">
                                            {dashData?.clients.change.value === 0
                                                ? "No new clients"
                                                : dashData?.clients.change.value}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    className="dash-stat-chart"
                                    sx={{
                                        width: { xs: '35%', sm: '38%', md: '40%', lg: '40%', xl: '45%' },
                                        height: { xs: '35%', sm: '38%', md: '40%', lg: '40%', xl: '45%' },
                                        position: "absolute",
                                        right: { xs: '12px', sm: '15px', md: '18px', lg: '18px', xl: '20px' },
                                        top: "50%",
                                        transform: "translateY(-35%)",
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartsData?.clients}>
                                            <XAxis dataKey="month" hide />
                                            <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} strokeWidth={2.5} />
                                            <Tooltip labelFormatter={(label) => `${label}`} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Box sx={{ position: "absolute", bottom: { xs: '6px', sm: '8px', md: '10px' }, right: { xs: '6px', sm: '8px', md: '10px' } }}>
                                    <Typography sx={{ mr: "5px", display: "flex", alignItems: "center", gap: "3px", fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '12px', xl: '14px' } }} variant="body1" color={dashData?.clients.change.direction === "up" ? "success.main" : dashData?.clients.change.direction === "down" ? "error.main" : "text.secondary"}>
                                         {dashData?.clients.change.percent}% {dashData?.clients.change.direction === "up" ? <TrendingUp sx={{ fontSize: { xs: '12px', sm: '14px' } }} /> : dashData?.clients.change.direction === "down" ? <TrendingDown sx={{ fontSize: { xs: '12px', sm: '14px' } }} /> : <TrendingFlat sx={{ fontSize: { xs: '12px', sm: '14px' } }} />} <span className="hide-last-month">last month</span>
                                    </Typography>
                                </Box>
                            </>
                        )}
                </Paper>
                <Paper onClick={() => navigate("/orders")} sx={{ ...commonCardStyle, gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 3', lg: 'span 2' }, gridRow: "1", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: { xs: '12px', sm: '16px', md: '18px', lg: '18px', xl: '20px' }, width: "100%", position: "absolute", top: { xs: '10px', sm: '12px', md: '15px' } }}>
                        <Typography variant="h2" className="dash-card-title" sx={{ fontSize: { xs: '15px', sm: '17px', md: '18px', lg: '18px', xl: '20px' }, fontWeight: "bold" }}>
                            Pending Orders
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            height: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <ShoppingCartOutlined sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '18px', xl: '20px' }, color: "text.secondary" }} />
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
                                    mt: { xs: '50px', sm: '60px', md: '70px', lg: '65px', xl: '80px' }
                                }}
                            >
                                <Typography fontSize={{ xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' }} color="text.secondary">
                                    Total
                                </Typography>
                                {dashData?.pendingOrders.total === 0
                                    ? 'No pending orders'
                                    : <Typography sx={{ fontSize: { xs: '26px', sm: '32px', md: '38px', lg: '34px', xl: '45px' }, fontWeight: "bold", color: "primary.main" }}>{dashData?.pendingOrders.total}</Typography>
                                }
                            </Box>
                        )}
                </Paper>
                <Paper onClick={() => navigate("/products")} sx={{ ...commonCardStyle, gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 3', lg: 'span 2' }, gridRow: "1", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: { xs: '12px', sm: '16px', md: '18px', lg: '18px', xl: '20px' }, width: "100%", position: "absolute", top: { xs: '10px', sm: '12px', md: '15px' } }}>
                        <Typography variant="h2" className="dash-card-title" sx={{ fontSize: { xs: '15px', sm: '17px', md: '18px', lg: '18px', xl: '20px' }, fontWeight: "bold" }}>
                            Products
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            height: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <Inventory2Outlined sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '18px', xl: '20px' }, color: 'text.secondary' }} />
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
                                    mt: { xs: '50px', sm: '60px', md: '70px', lg: '65px', xl: '80px' }
                                }}
                            >
                                <Typography fontSize={{ xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' }} color="text.secondary">
                                    Total
                                </Typography>
                                {dashData?.products.total === 0
                                    ? 'No listed products'
                                    : <Typography sx={{ fontSize: { xs: '26px', sm: '32px', md: '38px', lg: '34px', xl: '45px' }, fontWeight: "bold", color: "primary.main" }}>{dashData?.products.total}</Typography>
                                }
                            </Box>
                        )}
                </Paper>
                <Paper onClick={() => navigate("/invoices")} sx={{ ...commonCardStyle, gridColumn: { xs: 'span 1', sm: 'span 4', md: 'span 4', lg: 'span 5' }, gridRow: { xs: 'auto', lg: '2' }, position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: { xs: '12px', sm: '16px', md: '18px', lg: '18px', xl: '20px' }, width: "100%", position: "absolute", top: { xs: '10px', sm: '12px', md: '15px' } }}>
                        <Box>
                            <Typography variant="h2" className="dash-card-title" sx={{ fontSize: { xs: '15px', sm: '17px', md: '18px', lg: '18px', xl: '20px' }, fontWeight: "bold" }}>
                                Revenues Insights
                            </Typography>
                            <Typography variant="h3" sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' }, color: "text.secondary" }}>
                                Total and monthly revenues
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            height: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <MonetizationOnOutlined sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '18px', xl: '20px' }, color: "text.secondary" }} />
                        </Box>
                    </Box>
                    {chartsLoading ?
                        <CircularProgress size={40} sx={{ m: "auto" }} />
                        : chartsdashError ? (
                            <Typography variant="h1">{chartsdashError.message}</Typography>
                        ) : (
                            <>
                                <Box
                                    className="dash-revenue-stat-row"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "fit-content",
                                        paddingInline: { xs: '12px', sm: '16px', md: '18px', lg: '18px', xl: '20px' },
                                        gap: { xs: '16px', sm: '28px', md: '36px', lg: '36px', xl: '50px' },
                                        position: "absolute",
                                        bottom: { xs: '8px', sm: '10px', md: '12px' },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography fontSize={{ xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' }} color="text.secondary">
                                            Total
                                        </Typography>
                                        <Typography fontSize={{ xs: '20px', sm: '28px', md: '34px', lg: '28px', xl: '42px' }} fontWeight="bold" color="tertiary.main">
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
                                        <Typography fontSize={{ xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' }} color="text.secondary">
                                            Monthly
                                        </Typography>
                                        <Typography fontSize={{ xs: '20px', sm: '28px', md: '34px', lg: '28px', xl: '42px' }} fontWeight="bold" color="primary.main">
                                            {dashData?.revenue.change.value === 0
                                                ? "No revenues this month"
                                                : `$${dashData?.revenue.change.value}`}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    className="dash-stat-chart dash-revenue-chart"
                                    sx={{
                                        width: { xs: '45%', sm: '50%', md: '55%', lg: '50%', xl: '60%' },
                                        height: { xs: '40%', sm: '42%', md: '45%', lg: '45%', xl: '50%' },
                                        position: "absolute",
                                        right: { xs: '12px', sm: '15px', md: '18px', lg: '18px', xl: '20px' },
                                        top: "50%",
                                        transform: "translateY(-35%)",
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartsData?.revenue}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.60} />
                                                    <stop offset="50%" stopColor={theme.palette.primary.main} stopOpacity={0.30} />
                                                    <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" hide />
                                            <Area type="monotone" dataKey="value" stroke={theme.palette.primary.main} strokeWidth={2.5} fill="url(#colorRevenue)" />
                                            <Tooltip
                                                labelFormatter={(label) => `${label}`}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Box sx={{ position: "absolute", bottom: { xs: '6px', sm: '8px', md: '10px' }, right: { xs: '6px', sm: '8px', md: '10px' } }}>
                                    <Typography sx={{ mb: "3px", mr: "5px", alignSelf: "end", display: "flex", alignItems: "center", gap: "3px", fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '12px', xl: '14px' } }} variant="body1" color={dashData?.revenue.change.direction === "up" ? "success.main" : dashData?.revenue.change.direction === "down" ? "error.main" : "text.secondary"}>
                                         {dashData?.revenue.change.percent} % {dashData?.revenue.change.direction === "up" ? <TrendingUp sx={{ fontSize: { xs: '12px', sm: '14px' } }} /> : dashData?.revenue.change.direction === "down" ? <TrendingDown sx={{ fontSize: { xs: '12px', sm: '14px' } }} /> : <TrendingFlat sx={{ fontSize: { xs: '12px', sm: '14px' } }} />} <span className="hide-last-month">last month</span>
                                    </Typography>
                                </Box>
                            </>
                        )}
                </Paper>
                <Paper onClick={() => navigate("/clients")} sx={{ ...commonCardStyle, gridColumn: { xs: 'span 1', sm: 'span 4', md: 'span 2', lg: 'span 3' }, gridRow: { xs: 'auto', lg: '2' }, position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: { xs: '12px', sm: '16px', md: '18px', lg: '18px', xl: '20px' }, width: "100%", position: "absolute", top: { xs: '10px', sm: '12px', md: '15px' } }}>
                        <Box>
                            <Typography variant="h2" className="dash-card-title" sx={{ fontSize: { xs: '15px', sm: '17px', md: '18px', lg: '18px', xl: '20px' }, fontWeight: "bold" }}>
                                Top Performers
                            </Typography>
                            <Typography variant="h3" sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' }, color: "text.secondary" }}>
                                Highest sales volume this month
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            height: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <EmojiEventsOutlined sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '18px', xl: '20px' }, color: "text.secondary" }} />
                        </Box>
                    </Box>
                    {dashLoading ?
                        <CircularProgress size={40} sx={{ m: "auto" }} />
                        : (
                            <Box sx={{
                                paddingInline: { xs: '8px', sm: '10px' },
                                position: "absolute",
                                top: { xs: '55px', sm: '60px', md: '65px', lg: '62px', xl: '70px' },
                                width: "100%",
                                maxHeight: { md: '160px', lg: '275px', xl: '260px' },
                                overflowY: "auto",
                                scrollbarWidth: "none",
                                "&::-webkit-scrollbar": {
                                    display: "none",
                                },
                                maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 85%, transparent 100%)",
                                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 85%, transparent 100%)",
                            }}>
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
                                                        gap: { xs: '8px', sm: '14px', md: '18px', lg: '18px', xl: '24px' },
                                                        width: '100%'
                                                    }}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                                                            height: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                                                            backgroundColor: 'background.alt',
                                                            borderRadius: '10px',
                                                            color: 'primary.main',
                                                            fontWeight: 'bold',
                                                            fontSize: { xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' },
                                                        }}>
                                                            {i + 1}
                                                        </Box>
                                                        <Typography className="dash-performer-name" fontSize={{ xs: '13px', sm: '15px', md: '16px', lg: '15px', xl: '18px' }} sx={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {prod.product}
                                                        </Typography>
                                                    </Box>
                                                    <Typography fontWeight="bold" fontSize={{ xs: '22px', sm: '26px', md: '30px', lg: '26px', xl: '35px' }} color="primary.main">
                                                        {prod.quantity}
                                                    </Typography>
                                                </Box>
                                            </ListItem>
                                        ))}
                                </List>
                            </Box>
                        )}
                </Paper>
                <Paper onClick={() => navigate("/calendar")} sx={{ ...commonCardStyle, gridColumn: { xs: 'span 1', sm: 'span 4', md: 'span 3', lg: 'span 4' }, gridRow: { xs: 'auto', lg: '3' }, position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: { xs: '12px', sm: '16px', md: '18px', lg: '18px', xl: '20px' }, width: "100%", position: "absolute", top: { xs: '10px', sm: '12px', md: '15px' } }}>
                        <Box>
                            <Typography variant="h2" className="dash-card-title" sx={{ fontSize: { xs: '15px', sm: '17px', md: '18px', lg: '18px', xl: '20px' }, fontWeight: "bold" }}>
                                Upcoming Events
                            </Typography>
                            <Typography variant="h3" sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' }, color: "text.secondary" }}>
                                Your most closely approaching events
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            height: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            borderRadius: '10px',
                            backgroundColor: 'background.alt',
                        }}>
                            <EventOutlined sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '18px', xl: '20px' }, color: "text.primary" }} />
                        </Box>
                    </Box>
                    {dashLoading ? (
                        <CircularProgress size={40} sx={{ m: "auto" }} />
                    ) : (
                        dashData?.events.total === 0 ? (
                            <Typography variant="h6" sx={{ fontWeight: "bold", alignSelf: "center", mt: { xs: '40px', sm: '50px', md: '60px' } }} >
                                No upcoming events
                            </Typography>
                        ) : (
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                maxHeight: { xs: '110px', sm: '130px', md: '160px', lg: '180px', xl: '180px' },
                                paddingInline: { xs: '10px', sm: '14px', md: '16px', lg: '18px', xl: '20px' },
                                mt: { xs: '48px', sm: '56px', md: '64px', lg: '65px', xl: '80px' },
                                pb: "30px",
                                gap: { xs: 0.4, sm: 0.5 },
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
                                        <Box key={event.id} className="dash-event-item" sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: { xs: 2, sm: 3, md: 4, lg: 4, xl: 5 },
                                            mt: { xs: '5px', sm: '7px', md: '8px', lg: '8px', xl: '10px' },
                                            py: { xs: '6px', sm: '8px', md: '10px' },
                                            px: { xs: '8px', sm: '10px' },
                                            backgroundColor: "background.paper2",
                                            borderRadius: { xs: '10px', sm: '12px', lg: '12px', xl: '14px' },
                                            width: "100%",
                                            position: "relative"
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: "column",
                                                width: { xs: '36px', sm: '40px', md: '44px', lg: '42px', xl: '48px' },
                                                height: { xs: '36px', sm: '40px', md: '44px', lg: '42px', xl: '48px' },
                                                backgroundColor: 'background.alt',
                                                borderRadius: '10px',
                                                color: 'primary.main',
                                                fontWeight: 'bold',
                                                flexShrink: 0,
                                            }}>
                                                <Typography sx={{ fontSize: { xs: '9px', sm: '10px', md: '11px', lg: '11px', xl: '12px' }, color: "text.primary", textAlign: "center", mt: { xs: '6px', sm: '7px', md: '8px', lg: '8px', xl: '10px' }, lineHeight: ".5" }}>{month}</Typography>
                                                <Typography sx={{ fontSize: { xs: '14px', sm: '16px', md: '18px', lg: '18px', xl: '20px' }, fontWeight: "bold", color: "primary.main", textAlign: "center" }}>{day}</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: '4px', sm: '6px', lg: '8px', xl: '10px' }, backgroundColor: "background.paper2", overflow: "hidden" }}>
                                                <Typography className="dash-event-title" sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px', lg: '14px', xl: '16px' }, fontWeight: "bold", color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                    <NotesOutlined sx={{ fontSize: { xs: '12px', sm: '14px', lg: '14px', xl: '16px' }, color: "text.secondary" }} />
                                                    <Typography sx={{ fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '12px', xl: '14px' }, color: "text.secondary", alignSelf: "center", textAlign: "center" }}>{event.qNote ? "Quick Note: " : ""}</Typography>
                                                    <Typography sx={{ fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '12px', xl: '14px' }, color: "tertiary.main", alignSelf: "center", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.qNote}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: "6px", position: "absolute", right: { xs: '8px', sm: '20px', md: '30px', lg: '30px', xl: '40px' }, flexShrink: 0 }}>
                                                <ScheduleOutlined sx={{ fontSize: { xs: '12px', sm: '14px', lg: '14px', xl: '16px' }, color: "text.secondary" }} />
                                                <Typography sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' }, color: "text.primary", fontWeight: 600, alignSelf: "center", textAlign: "center" }}>{hour}</Typography>
                                            </Box>
                                        </Box>
                                    )
                                })}
                            </Box>
                        )
                    )}
                </Paper>
                <Paper onClick={() => navigate("/tasker")} sx={{ ...commonCardStyle, gridColumn: { xs: 'span 1', sm: 'span 4', md: 'span 3', lg: 'span 4' }, gridRow: { xs: 'auto', lg: '3' }, position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: { xs: '12px', sm: '16px', md: '18px', lg: '18px', xl: '20px' }, width: "100%", position: "absolute", top: { xs: '10px', sm: '12px', md: '15px' } }}>
                        <Box>
                            <Typography variant="h2" className="dash-card-title" sx={{ fontSize: { xs: '15px', sm: '17px', md: '18px', lg: '18px', xl: '20px' }, fontWeight: "bold" }}>
                                Operational Tasks
                            </Typography>
                            <Typography variant="h3" sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px', lg: '12px', xl: '14px' }, color: "text.secondary" }}>
                                Items requiring your immediate attention
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            height: { xs: '26px', sm: '28px', md: '30px', lg: '30px', xl: '34px' },
                            backgroundColor: 'background.alt',
                            borderRadius: '10px',
                        }}>
                            <TaskOutlined sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '18px', xl: '20px' }, color: "text.secondary" }} />
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
                                            paddingInline: { xs: '10px', sm: '14px', md: '16px', lg: '18px', xl: '20px' },
                                            mt: { xs: '48px', sm: '56px', md: '64px', lg: '65px', xl: '80px' }
                                        }}
                                    >
                                        <Box sx={{
                                            flex: 1, maxHeight: { xs: '110px', sm: '130px', md: '160px', lg: '180px', xl: '180px' }, display: "flex", flexDirection: "column", gap: { xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }, paddingTop: "10px", paddingBottom: "30px", overflowY: "auto", scrollbarWidth: "none",
                                            "&::-webkit-scrollbar": {
                                                display: "none",
                                            },
                                            maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 75%, transparent 100%)",
                                            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 75%, transparent 100%)",
                                        }}>
                                            {tasksData?.filter((task) => task.completed === false)
                                                .map((task) => (
                                                        <Box key={task.id} sx={{ display: 'flex', gap: { xs: 1.5, sm: 2, md: 3, lg: 3, xl: 4 }, alignItems: 'center' }}>
                                                        <Box sx={{
                                                            py: .3,
                                                            px: { xs: 0.8, sm: 1, md: 1.2 },
                                                            textAlign: 'center',
                                                            backgroundColor: `priorityStyles.${task.priority}.bg`,
                                                            color: `priorityStyles.${task.priority}.color`,
                                                            borderRadius: "9999px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
                                                        }}>
                                                            <Typography sx={{ fontSize: { xs: '8px', sm: '9px', md: '10px' }, fontWeight: 700 }}>{task.priority.toUpperCase()}</Typography>
                                                        </Box>
                                                        <Typography className="dash-task-title" sx={{ fontSize: { xs: '13px', sm: '15px', md: '16px', lg: '15px', xl: '18px' }, fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {task.title}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                        </Box>
                                        <Box sx={{
                                            minWidth: { xs: '70px', sm: '85px', md: '100px', lg: '100px', xl: '110px' },
                                            height: "fit-content",
                                            py: { xs: 0.4, sm: 0.5, md: 0.6, lg: 0.6, xl: 0.7 },
                                            textAlign: 'center',
                                            mt: { xs: 1.5, sm: 2, md: 2.5 },
                                            background: 'background.paper2',
                                            borderRadius: "16px",
                                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)"
                                        }}>
                                            <Typography sx={{ fontSize: { xs: '9px', sm: '10px', md: '11px', lg: '11px', xl: '12px' }, color: "tertiary.main", fontWeight: "600" }}>{tasksData?.filter(t => !t.completed).length === 0
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