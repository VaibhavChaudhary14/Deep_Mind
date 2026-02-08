"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts"

export function HoursChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) return <div className="flex items-center justify-center h-[200px] text-gray-400 font-mono font-bold uppercase">No data</div>

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#000" strokeWidth={1} strokeOpacity={0.1} />
                <XAxis
                    dataKey="date"
                    stroke="#000"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#000', strokeWidth: 3 }}
                    fontFamily="monospace"
                    fontWeight="900"
                    dy={10}
                />
                <YAxis
                    stroke="#000"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}h`}
                    fontFamily="monospace"
                    fontWeight="900"
                />
                <Tooltip
                    cursor={{ fill: '#000', opacity: 0.1 }}
                    contentStyle={{
                        backgroundColor: '#FFD600',
                        border: '3px solid #000',
                        boxShadow: '4px 4px 0px 0px #000',
                        borderRadius: '0px',
                        color: '#000',
                        fontFamily: 'monospace',
                        fontWeight: 'bold'
                    }}
                    itemStyle={{ color: '#000' }}
                />
                <Bar dataKey="Deep Work" stackId="a" fill="#00C2FF" stroke="#000" strokeWidth={2} />
                <Bar dataKey="Learning" stackId="a" fill="#FFD600" stroke="#000" strokeWidth={2} />
                <Bar dataKey="Projects" stackId="a" fill="#FF5C00" stroke="#000" strokeWidth={2} />
                <Bar dataKey="Planning" stackId="a" fill="#9D00FF" stroke="#000" strokeWidth={2} />
                <Bar dataKey="Outreach" stackId="a" fill="#00FF94" stroke="#000" strokeWidth={2} />
                <Bar dataKey="Admin" stackId="a" fill="#9CA3AF" stroke="#000" strokeWidth={2} />
            </BarChart>
        </ResponsiveContainer>
    )
}
