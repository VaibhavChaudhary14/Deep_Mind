"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/db";
import { Check, Target, Zap, Briefcase, ChevronRight, Activity } from "lucide-react";

export function SprintReflectionModal({ isOpen, onClose, previousSprintId }: { isOpen: boolean; onClose: () => void; previousSprintId: string | null }) {
    const [step, setStep] = useState(1);
    const [previousSprint, setPreviousSprint] = useState<any>(null);

    const [reflection, setReflection] = useState({ worked: "", failed: "", changed: "" });
    const [evolution, setEvolution] = useState({ role: "", skill: "", project: "" });

    useEffect(() => {
        if (previousSprintId) {
            db.sprints.get(previousSprintId).then(sprint => {
                if (sprint) {
                    setPreviousSprint(sprint);
                    setEvolution({
                        role: sprint.target_role,
                        skill: sprint.primary_skill_focus,
                        project: sprint.primary_project_focus
                    });
                }
            });
        }
    }, [previousSprintId]);

    const handleConfirm = async () => {
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + 90);

        const newCycleNumber = (previousSprint?.sprint_cycle_number || 1) + 1;

        const newSprint = {
            id: crypto.randomUUID(),
            target_role: evolution.role,
            primary_skill_focus: evolution.skill,
            primary_project_focus: evolution.project,
            sprint_cycle_number: newCycleNumber,
            start_date: start.toISOString(),
            end_date: end.toISOString(),
            status: 'active' as const,
            created_at: new Date()
        };

        // Inject into DB
        await db.sprints.add(newSprint);

        // Ensure previous sprint is completely off 'active' state
        if (previousSprintId) {
            await db.sprints.update(previousSprintId, { status: 'completed' });
        }

        // Migrate active items to new sprint
        const activeRoadmap = await db.roadmap.where('status').equals('Active').toArray();
        for (const r of activeRoadmap) {
            await db.roadmap.update(r.id!, { sprint_id: newSprint.id });
        }

        const activeTodos = await db.todos.where('status').noneOf(['Done']).toArray();
        for (const t of activeTodos) {
            await db.todos.update(t.id!, { sprint_id: newSprint.id });
        }

        onClose();
    };

    if (!isOpen || !previousSprint) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="neo-card bg-white max-w-2xl w-full border-4 border-black shadow-[12px_12px_0_#FFF] max-h-[90vh] overflow-y-auto"
                >
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black font-mono uppercase bg-black text-[#00FF94] inline-block px-4 py-2">Step 1: Reflection</h2>
                            <p className="font-bold text-gray-500">Before you commit to the next 90 days, analyze the previous cycle.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-black uppercase mb-1">What worked?</label>
                                    <textarea className="w-full neo-input h-20" value={reflection.worked} onChange={e => setReflection({ ...reflection, worked: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-black uppercase mb-1">What failed?</label>
                                    <textarea className="w-full neo-input h-20" value={reflection.failed} onChange={e => setReflection({ ...reflection, failed: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-black uppercase mb-1">What changed in your trajectory?</label>
                                    <textarea className="w-full neo-input h-20" value={reflection.changed} onChange={e => setReflection({ ...reflection, changed: e.target.value })} />
                                </div>
                            </div>

                            <button onClick={() => setStep(2)} className="w-full py-4 bg-black text-white font-black uppercase text-lg hover:bg-[#FFD600] hover:text-black transition-colors border-2 border-black flex items-center justify-center gap-2">
                                Continue to Evolution <ChevronRight />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black font-mono uppercase bg-black text-[#FFD600] inline-block px-4 py-2">Step 2: Evolution</h2>

                            <div className="bg-gray-100 p-4 border-2 border-black font-mono text-sm leading-relaxed font-bold">
                                Cycle {previousSprint.sprint_cycle_number} targeted "{previousSprint.target_role}". <br /><br />
                                <span className="text-[#00C2FF]">Keep it, upgrade it, or pivot entirely.</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="font-black font-mono text-xs uppercase flex items-center gap-2 mb-1"><Target size={14} /> Target Role</label>
                                    <input className="w-full neo-input text-lg font-bold" value={evolution.role} onChange={e => setEvolution({ ...evolution, role: e.target.value })} />
                                </div>
                                <div>
                                    <label className="font-black font-mono text-xs uppercase flex items-center gap-2 mb-1"><Zap size={14} /> Primary Skill Focus</label>
                                    <input className="w-full neo-input text-lg font-bold" value={evolution.skill} onChange={e => setEvolution({ ...evolution, skill: e.target.value })} />
                                </div>
                                <div>
                                    <label className="font-black font-mono text-xs uppercase flex items-center gap-2 mb-1"><Briefcase size={14} /> Primary Project Delivery</label>
                                    <input className="w-full neo-input text-lg font-bold" value={evolution.project} onChange={e => setEvolution({ ...evolution, project: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="px-6 py-4 bg-white text-black font-black uppercase border-2 border-black hover:bg-gray-100">Back</button>
                                <button onClick={() => setStep(3)} className="flex-1 py-4 bg-black text-white font-black uppercase text-lg hover:bg-[#00FF94] hover:text-black transition-colors border-2 border-black flex items-center justify-center gap-2">
                                    Sign Confirmation <ChevronRight />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 text-center pb-8">
                            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto text-[#FF00FF] mb-6 shadow-[8px_8px_0_#FFF] border-4 border-white">
                                <Activity size={40} />
                            </div>

                            <h2 className="text-4xl font-black font-mono uppercase tracking-tighter leading-none">The Contract</h2>
                            <p className="font-bold text-gray-500 max-w-md mx-auto">
                                80% of users who initiate a Cycle {previousSprint.sprint_cycle_number + 1} sprint see accelerated compounding progress.
                            </p>

                            <div className="p-6 bg-black text-white border-2 border-black text-left font-mono font-bold text-lg">
                                I commit to the next 90 days of deep execution toward becoming a <span className="text-[#00FF94]">{evolution.role}</span>.
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(2)} className="px-6 py-4 bg-white text-black font-black uppercase border-2 border-black hover:bg-gray-100">Back</button>
                                <button onClick={handleConfirm} className="flex-1 py-4 bg-[#FF00FF] text-white font-black uppercase text-2xl hover:bg-black transition-colors border-2 border-black shadow-[6px_6px_0_#000] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2">
                                    <Check size={28} /> Lock It In
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
