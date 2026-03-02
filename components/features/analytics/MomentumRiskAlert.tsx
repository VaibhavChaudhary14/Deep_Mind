"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { AlertTriangle, Timer } from "lucide-react";
import { useRouter } from "next/navigation";

export function MomentumRiskAlert() {
    const router = useRouter();

    const logs = useLiveQuery(() =>
        db.logs.orderBy('date').reverse().limit(7).toArray()
    );

    if (!logs) return null;

    // Check for 3 days of no activity (very basic mock logic for V2 Phase 1)
    // Note: Assuming "no logs in the last 3 days" is the trigger. Data array
    // must be deeply inspected against current date in a true prod environment.
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    const hasRecentLog = logs.some(log => new Date(log.date) > threeDaysAgo);

    return (
        <div className="neo-card bg-[#FF4500] text-white border-4 border-black shadow-[4px_4px_0_#000] mb-8 flex flex-col md:flex-row items-center justify-between animate-pulse-slow">
            <div className="flex items-center gap-4">
                <div className="bg-black p-3 rounded shadow-[2px_2px_0_#fff]">
                    <AlertTriangle size={24} className="text-[#FFD600]" />
                </div>
                <div>
                    <h3 className="font-black font-mono text-xl uppercase tracking-tight">Momentum Drop Detected</h3>
                    <p className="font-mono text-sm font-bold mt-1 text-orange-200">3 inactive days. Restart today.</p>
                </div>
            </div>

            <button
                onClick={() => router.push('/deep-work')}
                className="mt-4 md:mt-0 px-6 py-3 bg-white text-black font-black font-mono uppercase text-sm border-2 border-black shadow-[2px_2px_0_#000] hover:bg-[#FFD600] transition-colors flex items-center gap-2 active:translate-y-1 active:shadow-none"
            >
                <Timer size={18} />
                Start 25-min Deep Work
            </button>
        </div>
    );
}
