"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { User } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export function TargetIdentity() {
    const { user } = useAuth();

    const activeSprint = useLiveQuery(() =>
        db.sprints.where('status').equals('active').first()
    );

    const targetRole = activeSprint?.target_role || "Awaiting Orders";

    let etaMonths = "-";
    if (activeSprint) {
        const end = new Date(activeSprint.end_date);
        const now = new Date();
        const diffDays = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24)));
        etaMonths = Math.ceil(diffDays / 30).toString();
    }

    return (
        <div className="neo-card bg-[var(--color-cream)] mb-6 flex items-center justify-between border-4 border-black">
            <div>
                <h2 className="text-xl font-black font-mono uppercase text-gray-500 mb-1">Target Identity</h2>
                <div className="text-3xl font-black font-mono">
                    Becoming: <span className="text-[var(--color-mint)] bg-black px-2">{targetRole}</span>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <div className="text-sm font-bold font-mono text-gray-400">ESTIMATED TIME OF ARRIVAL</div>
                <div className="text-2xl font-black font-mono">{etaMonths} MONTHS</div>
            </div>
        </div>
    );
}
