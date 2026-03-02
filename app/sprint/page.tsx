"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Shell } from "@/components/layout/shell";
import { Header } from "@/components/dashboard/header";
import { RoadmapView } from "@/components/features/roadmap/view";
import { Target, Zap, Briefcase, Calendar } from "lucide-react";
import { BlockerCoachModal } from "@/components/features/ai/BlockerCoachModal";
import { SprintLifecycleManager } from "@/components/features/sprints/SprintLifecycleManager";
import { SprintStatusAlert } from "@/components/features/sprints/SprintStatusAlert";

export default function SprintPage() {
    const [isCoachOpen, setIsCoachOpen] = useState(false);
    const activeSprint = useLiveQuery(() =>
        db.sprints.where('status').equals('active').first()
    );

    return (
        <Shell>
            <Header />

            {/* V2 Lifecycle Engine & Alerts */}
            <SprintLifecycleManager />
            <SprintStatusAlert />

            <div className="mb-8">
                <h1 className="text-3xl font-black font-mono uppercase tracking-tight mb-4 flex items-center gap-3">
                    <Calendar className="text-[#00FF94]" size={32} />
                    90-Day Active Sprint
                </h1>

                {activeSprint ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="neo-card bg-white border-4 border-black border-b-[6px] border-r-[6px]">
                            <div className="flex items-center gap-2 mb-2">
                                <Target size={18} className="text-[#FF00FF]" />
                                <h3 className="font-black font-mono text-sm uppercase text-gray-400">Target Role</h3>
                            </div>
                            <div className="font-bold text-lg leading-tight">{activeSprint.target_role}</div>
                        </div>

                        <div className="neo-card bg-white border-4 border-black border-b-[6px] border-r-[6px]">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={18} className="text-[#00C2FF]" />
                                <h3 className="font-black font-mono text-sm uppercase text-gray-400">Primary Skill</h3>
                            </div>
                            <div className="font-bold text-lg leading-tight">{activeSprint.primary_skill_focus}</div>
                        </div>

                        <div className="neo-card bg-white border-4 border-black border-b-[6px] border-r-[6px]">
                            <div className="flex items-center gap-2 mb-2">
                                <Briefcase size={18} className="text-[#FFD600]" />
                                <h3 className="font-black font-mono text-sm uppercase text-gray-400">Primary Project</h3>
                            </div>
                            <div className="font-bold text-lg leading-tight">{activeSprint.primary_project_focus}</div>
                        </div>

                        {/* AI Coach Call to Action */}
                        <div className="md:col-span-3 mt-4">
                            <button
                                onClick={() => setIsCoachOpen(true)}
                                className="w-full py-4 bg-black text-white border-4 border-black shadow-[6px_6px_0_#FF5C00] hover:-translate-y-1 hover:shadow-[10px_10px_0_#FF5C00] transition-all font-black font-mono uppercase tracking-tight flex items-center justify-center gap-3"
                            >
                                <Zap className="text-[#00FF94]" size={20} />
                                Diagnose Blocker with Strategic Coach
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="neo-card bg-gray-50 border-4 border-dashed border-gray-300 text-center py-12">
                        <p className="font-bold font-mono text-gray-400">No active sprint detected.</p>
                        <p className="text-sm mt-2 text-gray-400">Go to Dashboard to initiate V2 Acceleration Mode.</p>
                    </div>
                )}
            </div>

            {/* V1 Roadmap fits perfectly as the 12-week macro timeline mapping beneath the Sprint header */}
            <div className="mt-8">
                <h2 className="text-xl font-black font-mono uppercase mb-4 border-b-4 border-black pb-2 inline-block">12-Week Macro Timeline</h2>
                <RoadmapView />
            </div>

            <BlockerCoachModal isOpen={isCoachOpen} onClose={() => setIsCoachOpen(false)} />
        </Shell>
    );
}
