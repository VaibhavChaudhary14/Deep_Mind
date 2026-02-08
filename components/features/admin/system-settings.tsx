"use client"

import { ExportControls } from "@/components/features/settings/export-controls"
import { Database, AlertTriangle, Settings } from "lucide-react"

export function SystemSettings() {
    return (
        <div className="space-y-8 max-w-4xl">
            <header>
                <h2 className="text-3xl font-black font-mono uppercase tracking-tighter flex items-center gap-3">
                    <Settings className="text-[#FFD600]" size={32} />
                    System Configuration
                </h2>
                <p className="font-bold font-mono text-gray-500 mt-2">Manage global settings and data controls.</p>
            </header>

            <section className="neo-card bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-black font-mono uppercase mb-6 border-b-4 border-black pb-2 inline-block">
                    <Database className="inline-block mr-2 mb-1" size={24} />
                    Data Management
                </h3>
                <ExportControls />
            </section>
        </div>
    )
}
