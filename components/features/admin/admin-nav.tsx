"use client"

import { Users, LayoutDashboard, Activity, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminNavProps {
    activeTab: 'overview' | 'activity' | 'system'
    setActiveTab: (tab: 'overview' | 'activity' | 'system') => void
}

export function AdminNav({ activeTab, setActiveTab }: AdminNavProps) {
    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'activity', label: 'Network Activity', icon: Activity },
        { id: 'system', label: 'System', icon: Settings },
    ] as const

    return (
        <nav className="flex flex-col md:flex-row gap-2 md:gap-4 mb-8 border-b-4 border-black pb-4">
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                            "flex items-center gap-3 px-6 py-3 font-black font-mono uppercase text-sm md:text-base border-4 border-transparent transition-all",
                            isActive
                                ? "bg-[#FFD600] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px]"
                                : "hover:bg-gray-100 hover:border-gray-200"
                        )}
                    >
                        <Icon size={20} strokeWidth={isActive ? 3 : 2} />
                        {item.label}
                    </button>
                )
            })}
        </nav>
    )
}
