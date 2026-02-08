
import { db } from "./db"
import { supabase } from "./supabase"
import { Log, Project, Skill, Application } from "./db"
import { calculateStreak } from "./gamification"

export async function syncData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    console.log("Starting sync for user:", user.id)

    // 1. Sync Settings/Profile
    const settings = await db.settings.orderBy('id').first()
    if (settings) {
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                username: settings.username,
                role: settings.role,
                level: settings.level,
                streak: settings.streak,
                deep_work_mode: settings.deep_work_mode,
                updated_at: new Date().toISOString()
            })
        if (error) console.error("Profile sync error:", error)
    }

    // 2. Sync Logs
    const localLogs = await db.logs.toArray()
    if (localLogs.length > 0) {
        const { error } = await supabase
            .from('logs')
            .upsert(localLogs.map(log => ({
                ...log,
                user_id: user.id
            })), { onConflict: 'id, date' })

        if (error) console.error("Logs sync error:", error)
    }

    // 3. Sync Skills (Smart Sync: Match by Name to prevent ID conflicts)
    const localSkills = await db.skills.toArray()
    if (localSkills.length > 0) {
        const { data: remoteSkills, error: fetchError } = await supabase
            .from('skills')
            .select('id, name')
            .eq('user_id', user.id)

        if (fetchError) {
            console.error("Skills fetch error:", JSON.stringify(fetchError, null, 2))
        } else {
            const remoteMap = new Map(remoteSkills?.map(s => [s.name, s.id]))

            const updates: any[] = []
            const inserts: any[] = []

            localSkills.forEach(skill => {
                const remoteId = remoteMap.get(skill.name)

                const payload = {
                    user_id: user.id,
                    name: skill.name,
                    category: skill.category,
                    current_level: skill.current_level,
                    target_level: skill.target_level,
                    last_updated: new Date().toISOString()
                }

                if (remoteId) {
                    updates.push({ ...payload, id: remoteId })
                } else {
                    inserts.push(payload)
                }
            })

            if (updates.length > 0) {
                const { error } = await supabase
                    .from('skills')
                    .upsert(updates, { onConflict: 'id' })
                if (error) console.error("Skills update error:", JSON.stringify(error, null, 2))
            }

            if (inserts.length > 0) {
                const { error } = await supabase
                    .from('skills')
                    .insert(inserts)
                if (error) console.error("Skills insert error:", JSON.stringify(error, null, 2))
            }
        }
    }

    // 4. Projects
    const localProjects = await db.projects.toArray()
    if (localProjects.length > 0) {
        const { error } = await supabase
            .from('projects')
            .upsert(localProjects.map(p => ({
                ...p,
                user_id: user.id
            })))
        if (error) console.error("Projects sync error:", error)
    }

    // 5. Applications
    const localApps = await db.applications.toArray()
    if (localApps.length > 0) {
        const { error } = await supabase
            .from('applications')
            .upsert(localApps.map(a => ({
                ...a,
                user_id: user.id
            })))
        if (error) console.error("Applications sync error:", error)
    }

    console.log("Sync complete")
}

// Hook to auto-sync on mount
export function useSync() {
    // In a real app, use SWR or React Query with a mutation or useEffect
    // For now, exposure function
    return { syncData }
}
