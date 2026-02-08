"use client"

import { useState } from "react"
import { Shell } from "@/components/layout/shell"
import { Shield } from "lucide-react"
import { AdminNav } from "@/components/features/admin/admin-nav"
import { OverviewStats } from "@/components/features/admin/overview-stats"
import { ActivityFeed } from "@/components/features/admin/activity-feed"
import { SystemSettings } from "@/components/features/admin/system-settings"

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'system'>('overview')

    return (
        <Shell>
            <div className="max-w-6xl mx-auto pb-20">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-black text-white border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black font-mono uppercase tracking-tighter">Command Center</h1>
                        <p className="font-bold font-mono text-gray-500">System Administration & Network Monitoring</p>
                    </div>
                </div>

                {/* Navigation */}
                <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Content */}
                <div className="min-h-[500px]">
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <OverviewStats />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <ActivityFeed />
                                <div className="p-6 bg-[#FBF9F1] border-4 border-black border-dashed">
                                    <h3 className="font-black font-mono uppercase text-xl mb-4">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setActiveTab('system')} className="p-4 bg-white border-2 border-black hover:bg-[#FFD600] transition-colors font-bold font-mono text-sm text-left">
                                            System Diagnostics
                                        </button>
                                        <button onClick={() => setActiveTab('activity')} className="p-4 bg-white border-2 border-black hover:bg-[#FFD600] transition-colors font-bold font-mono text-sm text-left">
                                            View Logs
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ActivityFeed />
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <SystemSettings />
                        </div>
                    )}
                </div>
            </div>
        </Shell>
    )
}
