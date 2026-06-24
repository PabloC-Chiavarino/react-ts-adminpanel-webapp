import { Box, useTheme } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

const COLORS = ['#7858f5', '#613affbb', '#b2a1ff', '#5c6bc0', '#7388faff', '#6177f8ff'];

const MostSoldBarChart = ({ data }: { data: Array<{ product: string; quantity: number }> }) => {
    const theme = useTheme();

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            '& .recharts-default-tooltip': {
                borderRadius: '12px !important',
                border: 'none !important',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12) !important',
            }
        }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ left: 20, right: 30, top: 10, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" dataKey="quantity" tick={{ fontSize: 13, fill: theme.palette.text.secondary }} />
                    <YAxis
                        type="category"
                        dataKey="product"
                        width={120}
                        tick={{ fontSize: 13, fill: theme.palette.text.primary }}
                    />
                    <Tooltip
                        formatter={(value?: ValueType, _name?: NameType) => [`${value} units`, 'Quantity']}
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                        }}
                    />
                    <Bar dataKey="quantity" radius={[0, 8, 8, 0]} barSize={40} name="Units Sold">
                        {data.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default MostSoldBarChart
