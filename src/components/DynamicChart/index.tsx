import { Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
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
        case "invoices":
            return (
                <DynamicComposedChart
                    data={data}
                    barAreaName="Monthly Invoices"
                    lineName="Total Invoices"
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
        default:
            return null;
    }
}

export default DynamicChart