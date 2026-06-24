import { Box, useTheme } from "@mui/material";
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
    const theme = useTheme();

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            '& .recharts-default-legend': {
                display: 'flex',
                justifyContent: 'center',
                gap: '100px',
                position: 'relative',
                top: '50px',
                fontSize: '18px',
            }
        }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ left: -30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {type === "revenue" ? (
                        <Area dataKey="value" fill={theme.palette.primary.main} name={barAreaName} />
                    ) : (
                        <Bar dataKey="value" barSize={150} fill={theme.palette.secondary.main} name={barAreaName} />
                    )}
                    <Line type="monotone" dataKey="cumulative" stroke={theme.palette.secondary.main} strokeWidth={3} name={lineName} />
                </ComposedChart>
            </ResponsiveContainer>
        </Box >
    );
}

export default DynamicComposedChart