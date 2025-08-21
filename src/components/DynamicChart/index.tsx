import { Box } from "@mui/material";
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DynamicComposedChart } from '../../components'

const DynamicChart = ({
    data,
    type,
}: {
    data: any,
    type: string,
}) => {
    switch (type) {
        case "revenue":
            return (
                <DynamicComposedChart
                    data={data}
                    barAreaName="Monthly Revenue"
                    lineName="Total Revenue"
                    type={type}
                />
            );
        case "orders":
            return (
                <DynamicComposedChart
                    data={data}
                    barAreaName="Monthly Orders"
                    lineName="Total Orders"
                    type={type}
                />
            );
        case "clients":
            return (
                <DynamicComposedChart
                    data={data}
                    barAreaName="Monthly Clients"
                    lineName="Total Clients"
                    type={type}
                />
            );
        case "mostSold":
            return (
                <Box sx={{ width: '100%', height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical">
                            <XAxis type="number" dataKey="quantity" />
                            <YAxis type="category" dataKey="product" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="quantity" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            );
        case "pendingTasks":
            return (
                <Box sx={{ width: '100%', height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie dataKey="count" data={data} nameKey="task" cx="50%" cy="50%" outerRadius={280} fill="#d6c251ff" label />
                            <Tooltip />
                            <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ lineHeight: '50px', right: 150, top: 125, fontSize: '18px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            );
        default:
            return null;
    }
}

export default DynamicChart