import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { calculateStreak } from "@/lib/gamification";

export function useAccelerationScore() {
    const activeSprint = useLiveQuery(() => db.sprints.where('status').equals('active').first());
    const logs = useLiveQuery(() => db.logs.toArray());
    const roadmapItems = useLiveQuery(() => db.roadmap.toArray());
    const skills = useLiveQuery(() => db.skills.toArray());

    if (!activeSprint || !logs || !roadmapItems || !skills) {
        return {
            compositeScore: 0,
            executionConsistency: 0,
            deepWorkPercent: 0,
            roadmapPercent: 0,
            skillDelta: 0
        };
    }

    const now = new Date();

    // 1. Execution Consistency (Last 14 Days)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(l => new Date(l.date) >= fourteenDaysAgo);

    // Count unique days with activity in the last 14 days
    const activeDays = new Set(recentLogs.map(l => l.date)).size;
    const executionConsistency = Math.min((activeDays / 14) * 100, 100);

    // 2. Deep Work Percent (Last 7 Days vs 14h target)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekLogs = logs.filter(l => new Date(l.date) >= sevenDaysAgo);
    const totalHours = lastWeekLogs.reduce((acc, log) => acc + log.hours_studied, 0);
    const deepWorkPercent = Math.min((totalHours / 14) * 100, 100);

    // 3. Roadmap Percent
    const sprintRoadmap = roadmapItems.filter(r => r.sprint_id === activeSprint.id);
    const completedRoadmap = sprintRoadmap.filter(r => r.status === 'Completed').length;
    let roadmapPercent = 0;
    if (sprintRoadmap.length > 0) {
        roadmapPercent = (completedRoadmap / sprintRoadmap.length) * 100;
    }

    // 4. Skill Delta
    const targetSkill = skills.find(s => s.name.toLowerCase().includes(activeSprint.primary_skill_focus.toLowerCase()) || activeSprint.primary_skill_focus.toLowerCase().includes(s.name.toLowerCase()));
    let skillDelta = 0;
    if (targetSkill && targetSkill.target_level > 0) {
        skillDelta = (targetSkill.current_level / targetSkill.target_level) * 100;
    } else {
        // Fallback if skill not directly mapped, assume 50% for visual pacing or rely on overall execution
        skillDelta = sprintRoadmap.length > 0 ? roadmapPercent : 10;
    }

    const compositeScore = Math.round(
        (executionConsistency * 0.40) +
        (deepWorkPercent * 0.30) +
        (roadmapPercent * 0.20) +
        (skillDelta * 0.10)
    );

    return {
        compositeScore,
        executionConsistency,
        deepWorkPercent,
        roadmapPercent,
        skillDelta
    };
}
