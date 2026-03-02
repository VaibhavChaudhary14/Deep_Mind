"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { SprintReflectionModal } from "@/components/features/sprints/SprintReflectionModal";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function SprintLifecycleManager() {
    const router = useRouter();
    const sprints = useLiveQuery(() => db.sprints.toArray());
    const [isReflectionOpen, setIsReflectionOpen] = useState(false);
    const [cooldownSprintId, setCooldownSprintId] = useState<string | null>(null);

    useEffect(() => {
        if (!sprints) return;

        const checkLifecycle = async () => {
            const now = new Date();

            for (const sprint of sprints) {
                const endDate = new Date(sprint.end_date);

                // Rule 1: Active sprint hits Day 90 -> Cooldown
                if (sprint.status === 'active' && now > endDate) {
                    await db.sprints.update(sprint.id, { status: 'cooldown' });
                }

                // Rule 2: Cooldown sprint past 14 days -> Abandoned
                if (sprint.status === 'cooldown') {
                    const cooldownExpiry = new Date(endDate);
                    cooldownExpiry.setDate(cooldownExpiry.getDate() + 14);

                    if (now > cooldownExpiry) {
                        await db.sprints.update(sprint.id, { status: 'abandoned' });
                    }
                }
            }
        };

        checkLifecycle();
    }, [sprints]);

    // Compute active states for UI rendering
    const activeSprint = sprints?.find(s => s.status === 'active');
    const cooldownSprint = sprints?.find(s => s.status === 'cooldown');
    const hasAbandoned = sprints?.some(s => s.status === 'abandoned');

    // Scenario: User is in Cooldown
    if (cooldownSprint && !isReflectionOpen) {
        return (
            <div className="neo-card bg-black text-white border-4 border-[#00FF94] shadow-[8px_8px_0_#00FF94] mb-8 p-6 flex flex-col md:flex-row items-center justify-between animate-pulse-slow">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl font-black font-mono uppercase text-[#00FF94]">Sprint Complete.</h2>
                    <p className="font-mono text-sm font-bold text-gray-400 mt-1">Day 90 reached. Do you recommit to the Acceleration Engine?</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={() => {
                            setCooldownSprintId(cooldownSprint.id);
                            setIsReflectionOpen(true);
                        }}
                        className="flex-1 md:flex-none px-6 py-3 bg-[#00FF94] text-black font-black font-mono uppercase text-sm border-2 border-[#00FF94] hover:bg-white hover:border-white transition-colors"
                    >
                        Review & Recommit
                    </button>
                    <button
                        className="flex-1 md:flex-none px-6 py-3 bg-transparent text-white font-black font-mono uppercase text-sm border-2 border-white hover:bg-white hover:text-black transition-colors"
                    >
                        Reflect First
                    </button>
                </div>
                <SprintReflectionModal
                    isOpen={isReflectionOpen}
                    onClose={() => setIsReflectionOpen(false)}
                    previousSprintId={cooldownSprint.id}
                />
            </div>
        );
    }

    // Scenario: User is Abandoned (Off-sprint)
    if (!activeSprint && !cooldownSprint && hasAbandoned) {
        return (
            <div className="neo-card bg-gray-100 border-4 border-dashed border-gray-400 mb-8 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                    <AlertCircle size={24} />
                    <span className="font-mono font-bold text-sm">You are currently off-sprint. Acceleration paused.</span>
                </div>
                <button
                    onClick={() => router.push('/sprint')}
                    className="px-4 py-2 bg-black text-white font-black font-mono uppercase text-xs shadow-[2px_2px_0_#000] hover:-translate-y-1 transition-transform"
                >
                    Initialize New Sprint
                </button>
            </div>
        );
    }

    return null;
}
