
import { db } from "./db"
import { supabase } from "./supabase"
import { Log, Project, Skill, Application } from "./db"

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
            })), { onConflict: 'id, date' }) // Strategy: Last write wins based on ID usually, but here ID might collide if not careful.
        // Better strategy for V1: Just push all local to remote, let remote handle IDs if we used UUIDs. 
        // Since we use auto-increment locally, mapping is hard. 
        // Simplified Sync: Push local to remote as "new" if not exists?
        // REALISTIC MVP SYNC: Overwrite specific tables based on "last_updated".

        if (error) console.error("Logs sync error:", error)
    }

    // 3. Sync Skills (Smart Sync: Match by Name)
    const localSkills = await db.skills.toArray()
    if (localSkills.length > 0) {
        // Fetch existing remote skills to map IDs
        const { data: remoteSkills, error: fetchError } = await supabase
            .from('skills')
            .select('id, name')
            .eq('user_id', user.id)

        if (fetchError) {
            console.error("Skills fetch error:", JSON.stringify(fetchError, null, 2))
        } else {
            const remoteMap = new Map(remoteSkills?.map(s => [s.name, s.id]))

            const payload = localSkills.map(skill => {
                // If skill exists remotely, attach its UUID/BigInt ID. 
                // If not, exclude ID to let Supabase generate it.
                // We DO NOT use local 'id' (number) for remote 'id' (bigint/uuid).
                const remoteId = remoteMap.get(skill.name)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id: localId, ...skillData } = skill

                return {
                    ...skillData,
                    id: remoteId, // undefined if new, existing ID if update
                    user_id: user.id,
                    updated_at: new Date().toISOString() // Ensure timestamp update
                }
            })

            const { error } = await supabase
                .from('skills')
                .upsert(payload, { onConflict: 'id' }) // Use ID as conflict target (implied primary key)

            if (error) console.error("Skills sync error:", JSON.stringify(error, null, 2))
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
