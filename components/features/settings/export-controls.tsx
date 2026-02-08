"use client"

import * as React from "react"
import { db } from "@/lib/db"
import { Download, FileJson, FileText } from "lucide-react"

export function ExportControls() {
    const handleExportJSON = async () => {
        try {
            const logs = await db.logs.toArray()
            const projects = await db.projects.toArray()
            const skills = await db.skills.toArray()

            const data = { logs, projects, skills, exportedAt: new Date().toISOString() }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
            const url = URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            a.download = `mission-control-backup-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error("Export failed", err)
            alert("Failed to export data")
        }
    }

    const handleExportCSV = async () => {
        try {
            const logs = await db.logs.toArray()
            if (!logs.length) {
                alert("No logs to export")
                return
            }

            // Convert logs to CSV
            const headers = ["Date", "Hours", "Focus Area", "Tasks Done", "Mood"]
            const rows = logs.map(log => [
                log.date,
                log.hours_studied,
                log.focus_area,
                log.tasks_completed,
                log.mood
            ])

            const csvContent = [
                headers.join(","),
                ...rows.map(e => e.join(","))
            ].join("\n")

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
            const url = URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            a.download = `mission-control-logs-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error("CSV Export failed", err)
            alert("Failed to export CSV")
        }
    }

    return (
        <div className="space-y-4">
            <div className="p-4 border border-gray-800 rounded-xl bg-[var(--color-bg-secondary)]">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                    <Download size={18} />
                    Data Export
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    Download your data for backup or external analysis.
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={handleExportJSON}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-tertiary)] hover:bg-gray-800 rounded-lg transition-colors text-sm font-mono border border-gray-700"
                    >
                        <FileJson size={16} className="text-yellow-500" />
                        Backup (JSON)
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-tertiary)] hover:bg-gray-800 rounded-lg transition-colors text-sm font-mono border border-gray-700"
                    >
                        <FileText size={16} className="text-green-500" />
                        Logs (CSV)
                    </button>
                </div>
            </div>
        </div>
    )
}
