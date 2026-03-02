"use client";

import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Target, Zap, Briefcase } from "lucide-react";

export function SprintMigrationModal() {
    const [isOpen, setIsOpen] = useState(false);

    // Check if there are any active sprints
    const activeSprints = useLiveQuery(() =>
        db.sprints.where('status').equals('active').toArray()
    );

    // V1 Data for auto-inference
    const profile = useLiveQuery(() => db.settings.toCollection().first());
    const skills = useLiveQuery(() => db.skills.toArray());
    const projects = useLiveQuery(() => db.projects.toArray());

    const [form, setForm] = useState({
        role: "",
        skill: "",
        project: ""
    });

    useEffect(() => {
        // If query resolves and no active sprint exists, open modal indicating V2 transition
        if (activeSprints !== undefined && activeSprints.length === 0) {

            // Auto-infer defaults from V1 state to reduce friction
            const inferredRole = profile?.role || "Senior Software Engineer";
            const inferredSkill = skills?.sort((a, b) => (b.target_level - b.current_level) - (a.target_level - a.current_level))[0]?.name || "System Design";
            const inferredProject = projects?.filter(p => ['Idea', 'Build', 'Polish'].includes(p.status))[0]?.name || "Core Portfolio Project";

            setForm({ role: inferredRole, skill: inferredSkill, project: inferredProject });
            setIsOpen(true);
        }
    }, [activeSprints, profile, skills, projects]);

    const handleConfirm = async () => {
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + 90);

        const newSprint = {
            id: crypto.randomUUID(),
            target_role: form.role,
            primary_skill_focus: form.skill,
            primary_project_focus: form.project,
            sprint_cycle_number: 1,
            start_date: start.toISOString(),
            end_date: end.toISOString(),
            status: 'active' as const,
            created_at: new Date()
        };

        // Inject into DB
        await db.sprints.add(newSprint);

        // Mark setting 
        if (profile?.id) {
            await db.settings.update(profile.id, { active_sprint: newSprint.id });
        }

        // Migrate historical active V1 entities to this sprint ID
        const activeRoadmap = await db.roadmap.where('status').equals('Active').toArray();
        for (const r of activeRoadmap) {
            await db.roadmap.update(r.id!, { sprint_id: newSprint.id });
        }

        const activeTodos = await db.todos.where('status').noneOf(['Done']).toArray();
        for (const t of activeTodos) {
            await db.todos.update(t.id!, { sprint_id: newSprint.id });
        }

        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="neo-card bg-white max-w-xl w-full max-h-[90vh] overflow-y-auto border-4 border-black shadow-[8px_8px_0_#FFD600] relative"
                >
                    <div className="bg-[#FFD600] -mx-6 -mt-6 p-6 border-b-4 border-black mb-6 flex items-start gap-4">
                        <div className="bg-black text-white p-3 rounded">
                            <Rocket size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black font-mono uppercase">Welcome to Acceleration Mode</h2>
                            <p className="font-bold text-sm mt-1">Deep Mind has upgraded. You are now entering a timebound 90-Day Sprint to force career momentum.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50 border-2 border-black p-4 text-sm font-bold font-mono text-gray-600">
                            We analyzed your v1 data to set your trajectory. You can adjust this commitment below. Once locked, this sprint dictates your dashboard for 90 days.
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block font-black font-mono uppercase text-xs mb-2 flex items-center gap-2">
                                    <Target size={14} className="text-[#FF00FF]" /> Primary Role Goal
                                </label>
                                <input
                                    className="w-full neo-input"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    placeholder="e.g. Senior Backend Engineer"
                                />
                            </div>

                            <div>
                                <label className="block font-black font-mono uppercase text-xs mb-2 flex items-center gap-2">
                                    <Zap size={14} className="text-[#00C2FF]" /> Primary Skill Focus
                                </label>
                                <input
                                    className="w-full neo-input"
                                    value={form.skill}
                                    onChange={(e) => setForm({ ...form, skill: e.target.value })}
                                    placeholder="e.g. Distributed Systems"
                                />
                            </div>

                            <div>
                                <label className="block font-black font-mono uppercase text-xs mb-2 flex items-center gap-2">
                                    <Briefcase size={14} className="text-[#00FF94]" /> Primary Shipping Outcome
                                </label>
                                <input
                                    className="w-full neo-input"
                                    value={form.project}
                                    onChange={(e) => setForm({ ...form, project: e.target.value })}
                                    placeholder="e.g. High-concurrency Go API"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleConfirm}
                            className="w-full py-4 bg-black text-white font-black font-mono uppercase text-lg border-2 border-black shadow-[4px_4px_0_#FFD600] hover:bg-gray-800 transition-colors active:translate-y-1 active:shadow-[2px_2px_0_#FFD600]"
                        >
                            Lock 90-Day Sprint
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
