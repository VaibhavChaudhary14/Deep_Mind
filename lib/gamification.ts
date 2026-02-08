
export const XP_VALUES = {
    DAILY_LOG: 50,
    TASK_COMPLETE: 20,
    DEEP_WORK_MINUTE: 5,
    PROJECT_SHIP: 500,
    SKILL_LEVEL_UP: 100
}

export const LEVELS = [
    { level: 1, title: "Novice", minXp: 0 },
    { level: 5, title: "Associate", minXp: 1000 },
    { level: 10, title: "Professional", minXp: 5000 },
    { level: 20, title: "Expert", minXp: 20000 },
    { level: 50, title: "Master", minXp: 100000 },
    { level: 100, title: "Visionary", minXp: 1000000 }
]

export function getLevelFn(xp: number) {
    // Simple logic: Level = floor(sqrt(xp / 100)) + 1? 
    // Or just use the brackets above?
    // Let's use a continuous formula for level, but map titles to specific milestones.
    // Formula: XP = Level^2 * 100 -> Level = sqrt(XP / 100)
    // Example: 0 XP = L0 (or 1), 100 XP = L1, 400 XP = L2, 10000 XP = L10.

    // Let's stick to a simpler linear-ish curve or just the milestones?
    // The user wants generic implementation. Let's use a formula that aligns roughly with the milestones.

    /**
     * Level N requires 100 * N^2 XP roughly?
     * L1: 100
     * L10: 100 * 100 = 10,000 (Close to Professional 5000)
     * L100: 100 * 10000 = 1,000,000 (Exact match for Visionary)
     */

    // We'll use Level = Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1
    // But we need to handle the "Title" mapping.

    const level = Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1

    // Find highest title applicable
    // Sort descending
    const match = [...LEVELS].reverse().find(l => level >= l.level)
    const title = match ? match.title : "Novice"

    const nextLevel = level + 1
    const nextLevelXp = 100 * Math.pow(nextLevel - 1, 2) // Wait, if L = sqrt(xp/100) + 1  => (L-1) = sqrt(xp/100) => (L-1)^2 = xp/100 => xp = 100*(L-1)^2

    // Actually, if Level 1 starts at 0 XP. 
    // Formula: XP required for Level L = 100 * (L-1)^2
    // L1: 0
    // L2: 100
    // L10: 100 * 81 = 8100
    // L100: 100 * 99^2 ≈ 1,000,000

    const currentLevelXpStart = 100 * Math.pow(level - 1, 2)
    const nextLevelXpStart = 100 * Math.pow(level, 2)

    const progress = Math.min(100, Math.max(0, ((xp - currentLevelXpStart) / (nextLevelXpStart - currentLevelXpStart)) * 100))

    return {
        level,
        title,
        progress,
        nextLevelXp: nextLevelXpStart,
        currentLevelXp: currentLevelXpStart
    }
}

export function calculateStreak(logs: { date: string }[]) {
    if (!logs || logs.length === 0) return 0

    // Sort logs descending
    const sortedDates = [...new Set(logs.map(l => l.date))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    if (sortedDates.length === 0) return 0

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    // Check if the most recent log is today or yesterday
    const lastLogDate = sortedDates[0]
    if (lastLogDate !== today && lastLogDate !== yesterday) {
        return 0
    }

    let streak = 0
    let currentDate = new Date(lastLogDate)

    for (let i = 0; i < sortedDates.length; i++) {
        const logDate = new Date(sortedDates[i])

        // Compare dates (ignoring time) as strings to avoid timezone mess if simplified
        const d1 = currentDate.toISOString().split('T')[0]
        const d2 = logDate.toISOString().split('T')[0]

        if (d1 === d2) {
            streak++
            // Move expectation to previous day
            currentDate.setDate(currentDate.getDate() - 1)
        } else {
            // Gap found
            break
        }
    }

    return streak
}
