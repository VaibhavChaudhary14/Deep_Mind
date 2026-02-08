
"use client"

import { Shell } from "@/components/layout/shell"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Crown, User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getLevelFn } from "@/lib/gamification"
import { cn } from "@/lib/utils"

interface Profile {
    id: string
    username: string
    role: string
    xp: number
    avatar_url?: string
}

export default function LeaderboardPage() {
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<string | null>(null)

    useEffect(() => {
        async function fetchLeaderboard() {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser()
            setCurrentUser(user?.id || null)

            // Fetch top 50 profiles by XP
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, role, xp, avatar_url')
                .order('xp', { ascending: false })
                .limit(50)

            if (data) {
                setProfiles(data)
            }
            setLoading(false)
        }

        fetchLeaderboard()
    }, [])

    return (
        <Shell>
            <div className="space-y-6">
                <header className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <Trophy className="text-[#FFD600]" size={40} strokeWidth={3} />
                            Global Rankings
                        </h1>
                        <p className="font-mono text-gray-500 font-bold uppercase">Top performers across the network</p>
                    </div>
                </header>

                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b-4 border-black bg-black text-white font-mono font-bold uppercase text-sm">
                        <div className="col-span-2 text-center">Rank</div>
                        <div className="col-span-6">User</div>
                        <div className="col-span-2 text-center">Level</div>
                        <div className="col-span-2 text-right">XP</div>
                    </div>

                    <div className="divide-y-2 divide-black">
                        {loading ? (
                            <div className="p-8 text-center font-mono font-bold animate-pulse">Scanning Network...</div>
                        ) : profiles.map((profile, index) => {
                            const rank = index + 1
                            const isMe = profile.id === currentUser
                            const { level } = getLevelFn(profile.xp || 0)

                            return (
                                <motion.div
                                    key={profile.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "grid grid-cols-12 gap-4 p-4 items-center font-mono font-bold hover:bg-gray-50 transition-colors",
                                        isMe ? "bg-[#E0F2E9]" : ""
                                    )}
                                >
                                    {/* Rank */}
                                    <div className="col-span-2 flex justify-center">
                                        {rank === 1 && <Crown size={24} className="text-[#FFD600]" fill="#FFD600" />}
                                        {rank === 2 && <Medal size={24} className="text-gray-400" />}
                                        {rank === 3 && <Medal size={24} className="text-[#CD7F32]" />}
                                        {rank > 3 && <span className="text-xl">#{rank}</span>}
                                    </div>

                                    {/* User */}
                                    <div className="col-span-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-200 flex items-center justify-center overflow-hidden">
                                            {profile.avatar_url ? (
                                                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <div className="leading-none text-lg">
                                                {profile.username || "Anonymous"}
                                                {isMe && <span className="ml-2 text-[10px] bg-black text-white px-1 py-0.5 rounded">YOU</span>}
                                            </div>
                                            <div className="text-xs text-gray-500 uppercase">{profile.role || "Professional"}</div>
                                        </div>
                                    </div>

                                    {/* Level */}
                                    <div className="col-span-2 text-center">
                                        <div className="inline-block bg-black text-white text-xs px-2 py-1 rounded">
                                            LVL {level}
                                        </div>
                                    </div>

                                    {/* XP */}
                                    <div className="col-span-2 text-right text-xl text-[#00C2FF]">
                                        {profile.xp?.toLocaleString() || 0}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Shell>
    )
}
