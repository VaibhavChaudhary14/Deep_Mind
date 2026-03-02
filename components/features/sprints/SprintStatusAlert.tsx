"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Clock, Flame } from "lucide-react";

export function SprintStatusAlert() {
    const activeSprint = useLiveQuery(() =>
        db.sprints.where('status').equals('active').first()
    );

    if (!activeSprint) return null;

    const now = new Date();
    const endDate = new Date(activeSprint.end_date);
    const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

    // Day 85 Trigger: Final Week Urgency
    if (diffDays <= 7 && diffDays > 0) {
        return (
            <div className="neo-card bg-[#FF00FF] text-white border-4 border-black mb-8 p-4 flex items-center justify-between shadow-[4px_4px_0_#000] animate-pulse-slow">
                <div className="flex items-center gap-3">
                    <div className="bg-black p-2"><Flame className="text-[#00FF94]" /></div>
                    <div>
                        <h3 className="font-black font-mono uppercase">Final Week. Finish Strong.</h3>
                        <p className="text-sm font-bold opacity-90">{diffDays} days remaining in Cycle {activeSprint.sprint_cycle_number}. Empty the tank.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Day 75 Trigger: Start Planning Warning
    if (diffDays <= 15 && diffDays > 7) {
        return (
            <div className="neo-card bg-black text-[#00FF94] border-4 border-[#00FF94] mb-8 p-4 flex items-center justify-between shadow-[4px_4px_0_#00FF94]">
                <div className="flex items-center gap-3">
                    <div className="bg-[#00FF94] p-2"><Clock className="text-black" /></div>
                    <div>
                        <h3 className="font-black font-mono uppercase">Sprint Conclusion Approaching</h3>
                        <p className="text-sm font-bold opacity-80">{diffDays} days left. Start planning your trajectory for Cycle {activeSprint.sprint_cycle_number + 1}.</p>
                    </div>
                </div>
            </div>
        );
    }

    return null; // Return nothing if neither condition is met
}
