"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/providers/auth-provider"
import { useEffect } from "react"
import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/dashboard/header"
import { useExecutionScore } from "@/hooks/use-execution-score"
import { useAnalytics } from "@/hooks/use-analytics"
import { HoursChart } from "@/components/features/analytics/hours-chart"
import { FocusChart } from "@/components/features/analytics/focus-chart"
import { LogModal } from "@/components/features/logs/log-modal"
import { LogHistoryModal } from "@/components/features/logs/log-history-modal"
import { ArrowUpRight, CheckCircle2, Clock, Globe, Plus, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { WeeklyGoalCard } from "@/components/features/goals/weekly-goal-card"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"

import { syncData } from "@/lib/sync"

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()

  React.useEffect(() => {
    if (isAuthenticated) {
      syncData() // Background sync on load
    }
  }, [isAuthenticated])
  const { score, details } = useExecutionScore()
  const { hoursData, focusData } = useAnalytics()
  const projects = useLiveQuery(() => db.projects.toArray())
  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false)

  return (
    <Shell>
      <Header />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Hours (7d)"
          value={`${details.totalHours}h`}
          trend="Goal: 28h"
          color="bg-[var(--color-bg-secondary)]"
          icon={Clock}
          iconColor="bg-blue-100 text-blue-600"
        />
        <MetricCard
          title="Consistency"
          value={`${details.consistency}/30`}
          trend="Pts"
          color="bg-[var(--color-bg-secondary)]"
          icon={CheckCircle2}
          iconColor="bg-green-100 text-green-600"
        />
        <MetricCard
          title="Output"
          value={`${details.output}/40`}
          trend="Shipped Pts"
          color="bg-[var(--color-bg-secondary)]"
          icon={Globe}
          iconColor="bg-purple-100 text-purple-600"
        />
        <div className="neo-card bg-black text-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-gray-400 text-sm font-mono">RANK</span>
            <Trophy className="text-yellow-400" />
          </div>
          <div>
            <div className="text-3xl font-mono font-bold">{score >= 90 ? 'S-Tier' : score >= 70 ? 'A-Tier' : 'B-Tier'}</div>
            <div className="text-xs text-gray-400 mt-1">Top 5% of Operators</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Log / Active Task / Analytics */}
        <div className="lg:col-span-2 space-y-8">
          <section className="neo-card min-h-[350px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl font-mono">Activity Log</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="px-2 py-1 bg-white hover:bg-black hover:text-white border-2 border-black rounded text-xs font-bold transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase"
                >
                  View History
                </button>
                <div className="px-2 py-1 bg-gray-100 border-2 border-black rounded text-xs font-bold">LAST 7 DAYS</div>
              </div>
            </div>
            <HoursChart data={hoursData} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-mono bg-[var(--color-mustard)] inline-block px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                CURRENT FOCUS
              </h2>
            </div>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="w-full neo-card h-32 flex flex-col items-center justify-center border-4 border-black bg-black text-white hover:bg-[#FFD600] hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group"
            >
              <div className="bg-white text-black rounded-full p-2 mb-2 group-hover:bg-black group-hover:text-[#FFD600] border-2 border-transparent group-hover:border-black transition-colors">
                <Plus size={32} strokeWidth={3} />
              </div>
              <span className="font-black font-mono text-xl uppercase tracking-tighter">Log Mission</span>
            </button>
          </section>

          <section>
            <h2 className="text-xl font-bold font-mono mb-4 bg-[var(--color-mint)] inline-block px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              RECENT PROJECTS
            </h2>
            <div className="space-y-4">
              {projects?.slice(0, 3).map(project => (
                <div key={project.id} className="neo-card hover:bg-yellow-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xl">{project.name}</h3>
                      <p className="text-sm font-mono text-gray-500 mt-1">
                        {project.status} • {project.tech_stack.slice(0, 2).join(', ')}
                      </p>
                    </div>
                    {project.status === 'Ship' && (
                      <span className="px-2 py-1 rounded bg-green-200 border-2 border-black text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">DEPLOYED</span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-4 text-sm font-bold">
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" className="flex items-center gap-1 hover:underline cursor-pointer"><Globe size={16} /> Demo</a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" className="flex items-center gap-1 hover:underline cursor-pointer"><ArrowUpRight size={16} /> GitHub</a>
                    )}
                    {!project.demo_url && !project.github_url && (
                      <span className="text-xs text-gray-400 font-mono">NO LINKS</span>
                    )}
                  </div>
                </div>
              ))}
              {(!projects || projects.length === 0) && (
                <div className="neo-card bg-gray-50 border-dashed text-center py-8 opacity-60">
                  <p className="font-mono text-xs font-bold">NO ACTIVE PROJECTS DETECTED</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets (Charts) */}
        <div className="space-y-8">

          <div className="neo-card bg-[var(--color-cream)]">
            <h3 className="font-bold mb-4 font-mono text-lg border-b-2 border-black pb-2">Topic Distribution</h3>
            <FocusChart data={focusData} />
            <div className="mt-6 space-y-3">
              {focusData.slice(0, 4).map((item: any, i: number) => (
                <div key={item.name} className="flex justify-between text-sm items-center p-2 bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="flex items-center gap-2 font-bold uppercase">
                    <span className={`w-4 h-4 border-2 border-black`} style={{ backgroundColor: ['#00C2FF', '#9D00FF', '#00FF94', '#FF00FF', '#FFD600', '#FF5C00'][i % 6] }}></span>
                    {item.name}
                  </span>
                  <span className="font-mono bg-black text-white px-1.5 py-0.5 rounded-none font-bold text-xs">{item.value}h</span>
                </div>
              ))}
            </div>
          </div>

          <WeeklyGoalCard />
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
