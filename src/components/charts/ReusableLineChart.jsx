import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

/**
 * data format:
 * [
 *   { label: "Week 3", value: 4 },
 *   { label: "Week 4", value: 1 }
 * ]
 */
export default function ReusableLineChart({
    data,
    stroke = "#3b82f6",
}) {
    return (
        <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={stroke}
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
