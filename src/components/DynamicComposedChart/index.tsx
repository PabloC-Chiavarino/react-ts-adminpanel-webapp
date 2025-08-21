import { Box } from "@mui/material";
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, Area } from "recharts";

const DynamicComposedChart = ({
    data,
    barAreaName,
    lineName,
    type
}: {
    data: Array<{ month: string, value: number, cumulative: number }>,
    barAreaName: string,
    lineName: string,
    type: string
}
) => {
    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            '& .recharts-default-legend': {
                display: 'flex',
                justifyContent: 'center',
                gap: '50px',
                position: 'relative',
                top: '16px',
                fontSize: '18px',
            }
        }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {type === "revenue" ? (
                        <Area dataKey="value" fill="#8884d8" name={barAreaName} />
                    ) : (
                        <Bar dataKey="value" barSize={150} fill="#82ca9d" name={barAreaName} />
                    )}
                    <Line type="monotone" dataKey="cumulative" stroke="#82ca9d" strokeWidth={3} name={lineName} />
                </ComposedChart>
            </ResponsiveContainer>
        </Box >
    );
}

export default DynamicComposedChart