"use client";

import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function WeightChart({ data }) {
    return (
        <div className="h-[220px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis domain={["dataMin - 2", "dataMax + 2"]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: 13
                        }}
                        formatter={(v) => [`${v} kg`, "Peso"]}
                    />
                    <Line
                        type="monotone" dataKey="peso"
                        stroke="#16a34a" strokeWidth={3}
                        dot={{ r: 5, fill: "#16a34a", strokeWidth: 0 }}
                        activeDot={{ r: 7 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
