"use client"

import React, { useEffect, useState } from "react"
import { ActivityCalendar } from "react-activity-calendar"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { Tooltip as ReactTooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

interface Activity {
    date: string
    count: number
    level: number
}

// Minimal theme definition if not using the exported type
interface Theme {
    light: [string, string, string, string, string];
    dark: [string, string, string, string, string];
}

export function ActivityHeatmap() {
    const logs = useLiveQuery(() => db.logs.toArray())
    const [data, setData] = useState<Activity[]>([])

    useEffect(() => {
        if (!logs) return

        const counts: Record<string, number> = {}
        logs.forEach(log => {
            const date = log.date
            const value = Math.ceil(Number(log.hours_studied) || 1)
            counts[date] = (counts[date] || 0) + value
        })

        const heatmapData = Object.entries(counts).map(([date, count]) => {
            let level = 0
            if (count === 0) level = 0
            else if (count <= 2) level = 1
            else if (count <= 4) level = 2
            else if (count <= 6) level = 3
            else level = 4

            return {
                date,
                count,
                level
            }
        })

        heatmapData.sort((a, b) => a.date.localeCompare(b.date))
        setData(heatmapData)
    }, [logs])

    const currentYear = new Date().getFullYear()

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[150px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded bg-gray-50 text-gray-400 font-mono text-sm">
                NO ACTIVITY DATA RECORDED
            </div>
        )
    }

    const theme: any = {
        light: ['#f3f4f6', '#dcfce7', '#86efac', '#22c55e', '#14532d'],
        dark: ['#f3f4f6', '#dcfce7', '#86efac', '#22c55e', '#14532d'],
    }

    return (
        <div className="w-full overflow-x-auto pb-2">
            <ActivityCalendar
                data={data}
                colorScheme="light"
                renderBlock={(block, activity) => (
                    React.cloneElement(block, {
                        'data-tooltip-id': 'react-tooltip',
                        'data-tooltip-content': `${activity.count} hours on ${activity.date}`
                    })
                )}
                labels={{
                    legend: {
                        less: 'Less',
                        more: 'More',
                    },
                    months: [
                        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ],
                    weekdays: [
                        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
                    ],
                    totalCount: '{{count}} hours tracked in ' + currentYear
                }}
                theme={theme}
                blockSize={12}
                blockMargin={4}
                fontSize={12}
            />
            <ReactTooltip id="react-tooltip" />
        </div>
    )
}
