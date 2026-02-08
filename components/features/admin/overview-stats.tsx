"use client"

import { useEffect, useState } from "react"
import { Users, Zap, Shield, Activity } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion, useSpring, useTransform } from "framer-motion"

function AnimatedNumber({ value }: { value: number }) {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 })
    const display = useTransform(spring, (current) => Math.floor(current).toLocaleString())

    useEffect(() => {
        spring.set(value)
    }, [value, spring])

    return <motion.span>{display}</motion.span>
}

export function OverviewStats() {
    const [stats, setStats] = useState([
        { label: "Total Operatives", value: 0, icon: Users, color: "bg-[#00C2FF]" },
        { label: "Global XP", value: 0, icon: Zap, color: "bg-[#FFD600]" },
        { label: "Active Sessions", value: 0, icon: Activity, color: "bg-[#00FF94]" },
        { label: "System Health", value: 100, icon: Shield, color: "bg-white", suffix: "%" },
    ])

    useEffect(() => {
        fetchStats()

        // Real-time subscription could go here
        const interval = setInterval(fetchStats, 30000) // Refresh every 30s
        return () => clearInterval(interval)
    }, [])

    const fetchStats = async () => {
        try {
            // 1. Total Operatives
            const { count: operativesCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })

            // 2. Global XP (Sum)
            const { data: xpData } = await supabase
                .from('profiles')
                .select('xp')

            const totalXP = xpData?.reduce((acc, curr) => acc + (curr.xp || 0), 0) || 0

            // 3. Active Sessions (Logs in last 24h as proxy)
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)

            const { count: sessionsCount } = await supabase
                .from('logs')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', yesterday.toISOString())

            setStats(prev => [
                { ...prev[0], value: operativesCount || 0 },
                { ...prev[1], value: totalXP },
                { ...prev[2], value: sessionsCount || 0 },
                { ...prev[3], value: 100 } // Keep System Health static for now
            ])
        } catch (error) {
            console.error("Error fetching admin stats:", error)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <div key={index} className={`neo-card ${stat.color} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col justify-between min-h-[160px]`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-black text-white border-2 border-transparent">
                                <Icon size={24} />
                            </div>
                            <span className="font-black font-mono text-xs uppercase bg-black text-white px-2 py-1 animate-pulse">Live</span>
                        </div>
                        <div>
                            <h3 className="font-black font-mono text-4xl mb-1 truncate">
                                <AnimatedNumber value={stat.value} />
                                {stat.suffix}
                            </h3>
                            <p className="font-bold font-mono text-sm uppercase opacity-75">{stat.label}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
