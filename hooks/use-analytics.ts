"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { subDays, format, startOfDay } from "date-fns"

export function useAnalytics() {
    const logs = useLiveQuery(() => db.logs.toArray())

    if (!logs) return { hoursData: [], focusData: [] }

    // 1. Last 7 Days Hours
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i)
        return format(d, 'yyyy-MM-dd')
    })

    const hoursData = last7Days.map(dateStr => {
        const dayLogs = logs.filter(l => l.date === dateStr)

        // Initialize with default values to ensure all keys exist
        const dailyBreakdown: any = {
            date: format(new Date(dateStr), 'EEE'),
            fullDate: dateStr,
            total: 0,
            Python: 0,
            Math: 0,
            ML: 0,
            Projects: 0,
            Deployment: 0,
            Revision: 0
        }

        dayLogs.forEach(log => {
            if (log.focus_area) {
                dailyBreakdown[log.focus_area] = (dailyBreakdown[log.focus_area] || 0) + log.hours_studied
                dailyBreakdown.total += log.hours_studied
            }
        })

        return dailyBreakdown
    })

    // 2. Focus Distribution (All Time)
    const focusMap = new Map<string, number>()
    logs.forEach(log => {
        const current = focusMap.get(log.focus_area) || 0
        focusMap.set(log.focus_area, current + log.hours_studied)
    })

    const focusData = Array.from(focusMap.entries()).map(([name, value]) => ({
        name,
        value
    })).sort((a, b) => b.value - a.value)

    return {
        hoursData,
        focusData
    }
}
