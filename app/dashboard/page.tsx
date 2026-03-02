"use client"

import * as React from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/dashboard/header"
import { ActivityHeatmap } from "@/components/features/analytics/activity-heatmap"
import { LogModal } from "@/components/features/logs/log-modal"
import { LogHistoryModal } from "@/components/features/logs/log-history-modal"
import { DeepWorkTimer } from "@/components/features/deep-work/timer"
import { Plus } from "lucide-react"

// V2 Imports
import { TargetIdentity } from "@/components/dashboard/TargetIdentity"
import { AccelerationScore } from "@/components/dashboard/AccelerationScore"
import { MomentumRiskAlert } from "@/components/features/analytics/MomentumRiskAlert"
import { DailyExecutionBoard } from "@/components/dashboard/DailyExecutionBoard"
import { SprintMigrationModal } from "@/components/features/sprints/SprintMigrationModal"
import { cn } from "@/lib/utils"
import { SprintLifecycleManager } from "@/components/features/sprints/SprintLifecycleManager"
import { SprintStatusAlert } from "@/components/features/sprints/SprintStatusAlert"
import { syncData } from "@/lib/sync"

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()

  React.useEffect(() => {
    if (isAuthenticated) {
      syncData() // Background sync on load
    }
  }, [isAuthenticated])

  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false)

  return (
    <Shell>
      <Header />

      {/* V2 Lifecycle Engine & Alerts */}
      <SprintLifecycleManager />
      <SprintStatusAlert />

      {/* V2 Migration / Setup Modal */}
      <SprintMigrationModal />

      {/* V2 Risk Alert */}
      <MomentumRiskAlert />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Core Identity & Execution */}
        <div className="lg:col-span-2 space-y-8 flex flex-col">
          <TargetIdentity />

          <div className="flex-grow">
            <DailyExecutionBoard />
          </div>
        </div>

        {/* Right Column: Key Progression Indicators */}
        <div className="space-y-8">

          <div className="h-[200px]">
            <AccelerationScore />
          </div>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-mono bg-[var(--color-mustard)] inline-block px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                Deep Work Station
              </h2>
            </div>
            <DeepWorkTimer />

            <button
              onClick={() => setIsLogModalOpen(true)}
              className="w-full mt-4 py-3 bg-white border-2 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFD600] flex items-center justify-center gap-2 transition-all active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <Plus size={18} /> Log Custom Session
            </button>
          </section>

          {/* Activity Heatmap */}
          <section className="neo-card">
            <h3 className="font-bold text-lg font-mono mb-4 border-b-2 border-black pb-2 uppercase text-gray-400">Consistency Graph</h3>
            <ActivityHeatmap />
          </section>

        </div>
      </div>

      <LogModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} />
      <LogHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </Shell>
  )
}

function MetricCard({ title, value, trend, color, icon: Icon, iconColor }: any) {
  return (
    <div className={cn("neo-card", color)}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]", iconColor)}>
          <Icon size={24} />
        </div>
        <span className="text-xs font-bold font-mono bg-white border-2 border-black px-2 py-1 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {trend}
        </span>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase">{title}</p>
        <h3 className="text-3xl font-black font-mono mt-1">{value}</h3>
      </div>
    </div>
  )
}
