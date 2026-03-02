
import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { getLevelFn } from '@/lib/gamification'
import { db } from '@/lib/db'

interface XPState {
    xp: number
    level: number
    title: string
    progress: number
    nextLevelXp: number

    // Actions
    fetchXP: () => Promise<void>
    addXP: (amount: number, reason: string) => Promise<void>
}

export const useXP = create<XPState>((set, get) => ({
    xp: 0,
    level: 1,
    title: "Novice",
    progress: 0,
    nextLevelXp: 100,

    fetchXP: async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            if (!user || authError) return

            const { data, error } = await supabase
                .from('profiles')
                .select('xp')
                .eq('id', user.id)
                .single()

            if (data) {
                const { level, title, progress, nextLevelXp } = getLevelFn(data.xp || 0)
                set({ xp: data.xp || 0, level, title, progress, nextLevelXp })
            }
        } catch (err) {
            console.warn("XP Sync bypassed due to network timeout.")
        }
    },

    addXP: async (amount, reason) => {
        const currentXp = get().xp
        const newXp = currentXp + amount

        // Optimistic Update immediately
        const { level, title, progress, nextLevelXp } = getLevelFn(newXp)
        set({ xp: newXp, level, title, progress, nextLevelXp })

        const oldLevel = getLevelFn(currentXp).level
        if (level > oldLevel) {
            console.log(`Level Up! ${oldLevel} -> ${level}`)
        }

        // DB Update wrapped in try/catch to prevent Turbopack/JSON crashes on timeout
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            if (!user || authError) return

            const { error } = await supabase
                .from('profiles')
                .update({ xp: newXp, updated_at: new Date().toISOString() })
                .eq('id', user.id)

            if (error) console.warn("Background XP sync failed:", error.message)
        } catch (err) {
            console.warn("Background XP sync network timeout bypassed.")
        }
    }
}))
