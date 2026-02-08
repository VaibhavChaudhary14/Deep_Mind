
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
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('profiles')
            .select('xp')
            .eq('id', user.id)
            .single()

        if (data) {
            const { level, title, progress, nextLevelXp } = getLevelFn(data.xp || 0)
            set({ xp: data.xp || 0, level, title, progress, nextLevelXp })
        }
    },

    addXP: async (amount, reason) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const currentXp = get().xp
        const newXp = currentXp + amount

        // Optimistic Update
        const { level, title, progress, nextLevelXp } = getLevelFn(newXp)
        set({ xp: newXp, level, title, progress, nextLevelXp })

        // DB Update
        const { error } = await supabase
            .from('profiles')
            .update({ xp: newXp, updated_at: new Date().toISOString() })
            .eq('id', user.id)

        if (error) {
            console.error("Failed to sync XP:", error)
            // Revert? For now, just log.
        }

        // Check for Level Up
        const oldLevel = getLevelFn(currentXp).level
        if (level > oldLevel) {
            // Trigger Level Up Toast/Modal (Future)
            console.log(`Level Up! ${oldLevel} -> ${level}`)
        }
    }
}))
