import { DynamicComposedChart, MostSoldBarChart } from '../../components'
import type { ChartTypes } from '../../types'

type DynamicChartProps =
    | { type: "revenue"; data: ChartTypes['revenue'] }
    | { type: "invoices"; data: ChartTypes['invoices'] }
    | { type: "clients"; data: ChartTypes['clients'] }
    | { type: "mostSold"; data: ChartTypes['mostSold'] }

const DynamicChart = ({
    data,
    type,
}: DynamicChartProps) => {
    switch (type) {
        case "revenue":
            return (
                <DynamicComposedChart
                    data={data.map(d => ({ month: d.month, value: d.revenue, cumulative: d.cumulative }))}
                    barAreaName="Monthly Revenue"
                    lineName="Total Revenue"
                    type={type}
                />
            );
        case "invoices":
            return (
                <DynamicComposedChart
                    data={data.map(d => ({ month: d.month, value: d.orders, cumulative: (d as Record<string, unknown>).cumulative as number ?? 0 }))}
                    barAreaName="Monthly Invoices"
                    lineName="Total Invoices"
                    type={type}
                />
            );
        case "clients":
            return (
                <DynamicComposedChart
                    data={data.map(d => ({ month: d.month, value: d.clients, cumulative: (d as Record<string, unknown>).cumulative as number ?? 0 }))}
                    barAreaName="Monthly Clients"
                    lineName="Total Clients"
                    type={type}
                />
            );
        case "mostSold":
            return (
                <MostSoldBarChart data={data} />
            );
        default:
            return null;
    }
}

export default DynamicChart
