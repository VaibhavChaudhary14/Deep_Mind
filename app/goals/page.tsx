"use client"

import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/dashboard/header"
import { GoalColumn } from "@/components/features/goals/goal-column"
import { Calendar, Clock, Crosshair } from "lucide-react"

export default function GoalsPage() {
    return (
        <Shell>
            <Header />
            <div className="h-[calc(100vh-140px)] overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full pb-6">
                    <div className="h-full">
                        <GoalColumn type="Daily" color="bg-[#00C2FF]" icon={Clock} />
                    </div>
                    <div className="h-full">
                        <GoalColumn type="Weekly" color="bg-[#00FF94]" icon={Crosshair} />
                    </div>
                    <div className="h-full">
                        <GoalColumn type="Monthly" color="bg-[#FFD600]" icon={Calendar} />
                    </div>
                </div>
            </div>
        </Shell>
    )
}
