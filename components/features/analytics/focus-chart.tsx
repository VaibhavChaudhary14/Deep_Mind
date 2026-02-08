"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = [
    '#00C2FF', // Vivid Cyan
    '#9D00FF', // Vivid Purple
    '#00FF94', // Vivid Mint
    '#FF00FF', // Hot Pink
    '#FFD600', // Vivid Yellow
    '#FF5C00'  // Vivid Orange
]

export function FocusChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) return <div className="flex items-center justify-center h-[200px] text-gray-400 font-mono font-bold uppercase">No data</div>

    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="#000"
                    strokeWidth={3}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#000',
                        border: '3px solid #000',
                        boxShadow: '6px 6px 0px 0px #000',
                        borderRadius: '0px',
                        color: '#FFF',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}
                    itemStyle={{ color: '#FFF' }}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}
