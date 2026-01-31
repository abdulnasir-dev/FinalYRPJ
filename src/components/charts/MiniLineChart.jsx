import { Line, LineChart, ResponsiveContainer } from 'recharts';

const MiniLineChart = ({ data, stroke = "#10b981" }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={stroke}
                    strokeWidth={2}
                    dot={data.length === 1} // Show dot if only 1 point
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default MiniLineChart;