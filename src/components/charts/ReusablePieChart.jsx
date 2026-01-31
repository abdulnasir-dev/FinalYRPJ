import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function ReusablePieChart({
    data,
    colors = {},
    showLegend = true,
}) {
    return (
        <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={colors[entry.label] || "#9ca3af"}
                            />
                        ))}
                    </Pie>

                    <Tooltip />
                    {showLegend && <Legend />}
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

