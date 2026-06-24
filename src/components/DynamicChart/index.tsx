import { DynamicComposedChart, MostSoldBarChart } from '../../components'

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
                <MostSoldBarChart data={data} />
            );
        default:
            return null;
    }
}

export default DynamicChart
