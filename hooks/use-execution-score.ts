"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"

export function useExecutionScore() {
    const settings = useLiveQuery(() => db.settings.orderBy('id').first())
    const projects = useLiveQuery(() => db.projects.toArray())
    const logs = useLiveQuery(() => db.logs.toArray())

    if (!projects || !logs) {
        return {
            score: 0,
            details: { consistency: 0, output: 0, volume: 0, streak: 0, totalHours: 0 }
        }
    }

    // 1. Consistency Score (30%)
    // Based on streak (max 30 days)
    const streak = settings?.streak || 0
    const consistencyScore = Math.min(streak, 30)

    // 2. Output Score (40%)
    // Based on shipped projects (Hire Ready = 10pts, Others = 2pts)
    const shipppedProjects = projects.filter(p => p.status === 'Ship').length
    const signalProjects = projects.filter(p => p.hire_signal).length
    // Formula: Each shipped project = 5 pts, each Hire Signal = 10 pts. Max 40.
    const rawOutput = (shipppedProjects * 5) + (signalProjects * 10)
    const outputScore = Math.min(rawOutput, 40)

    // 3. Volume Score (30%)
    // Based on hours studied in last 7 days (Target: 4h/day = 28h/week)
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Filter logs for last 7 days
    const lastWeekLogs = logs.filter(l => new Date(l.date) >= oneWeekAgo)
    const totalHours = lastWeekLogs.reduce((acc, log) => acc + log.hours_studied, 0)

    // Formula: (Total Hours / 28) * 30. Max 30.
    const volumeScore = Math.min((totalHours / 28) * 30, 30)

    const totalScore = Math.round(consistencyScore + outputScore + volumeScore)

    return {
        score: totalScore,
        details: {
            consistency: Math.round(consistencyScore),
            output: Math.round(outputScore),
            volume: Math.round(volumeScore),
            streak,
            totalHours
        }
    }
}
