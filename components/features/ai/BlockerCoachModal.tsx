"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, X, Send } from "lucide-react";
import { diagnoseBlocker } from "@/app/actions/ai-coach";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useExecutionScore } from "@/hooks/use-execution-score";

export function BlockerCoachModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [blocker, setBlocker] = useState("");
    const [isDiagnosing, setIsDiagnosing] = useState(false);
    const [diagnosis, setDiagnosis] = useState<string | null>(null);

    const activeSprint = useLiveQuery(() => db.sprints.where('status').equals('active').first());
    const { details } = useExecutionScore();

    const handleDiagnose = async () => {
        if (!blocker.trim() || !activeSprint) return;

        setIsDiagnosing(true);
        try {
            const result = await diagnoseBlocker({
                targetRole: activeSprint.target_role,
                primarySkill: activeSprint.primary_skill_focus,
                primaryProject: activeSprint.primary_project_focus,
                blockerDescription: blocker,
                recentConsistency: details.consistency || 0
            });

            if (result.success && result.analysis) {
                setDiagnosis(result.analysis);
            } else {
                setDiagnosis("ERROR: Coach offline. Cannot connect to intelligence grid.");
            }
        } catch (error) {
            setDiagnosis("ERROR: Command failure.");
        } finally {
            setIsDiagnosing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="neo-card bg-white max-w-2xl w-full max-h-[90vh] flex flex-col border-4 border-black shadow-[8px_8px_0_#FF5C00]"
                >
                    <div className="flex justify-between items-center mb-6 pb-4 border-b-4 border-black border-dashed">
                        <div className="flex items-center gap-3">
                            <div className="bg-black text-[#FF5C00] p-2 rounded">
                                <Brain size={24} />
                            </div>
                            <h2 className="text-2xl font-black font-mono uppercase tracking-tight">Strategic Coach</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-black rounded">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                        {!diagnosis ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 border-2 border-black font-mono text-sm font-bold text-gray-700">
                                    Report your blocker. The coach will analyze it against your active Sprint ({activeSprint?.target_role}) and your current consistency score ({details.consistency}/30). Expect brutal truth.
                                </div>

                                <textarea
                                    className="w-full h-32 neo-input resize-none"
                                    placeholder="I've been stuck trying to implement the concurrency model for 3 days and I keep procrastinating by reading docs..."
                                    value={blocker}
                                    onChange={(e) => setBlocker(e.target.value)}
                                />

                                <button
                                    onClick={handleDiagnose}
                                    disabled={isDiagnosing || !blocker.trim()}
                                    className="w-full py-4 bg-[#FF5C00] text-black font-black font-mono uppercase text-lg border-2 border-black shadow-[4px_4px_0_#000] hover:bg-[#FFD600] transition-colors flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none disabled:opacity-50"
                                >
                                    {isDiagnosing ? "Diagnosing..." : <><Send size={20} /> Request Diagnosis</>}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-6 bg-black text-[#00FF94] font-mono text-sm whitespace-pre-wrap border-4 border-[#00FF94] shadow-[4px_4px_0_#000]">
                                    {diagnosis}
                                </div>
                                <button
                                    onClick={() => { setDiagnosis(null); setBlocker(""); onClose(); }}
                                    className="w-full py-3 bg-white text-black font-black font-mono uppercase text-sm border-2 border-black shadow-[2px_2px_0_#000] hover:bg-gray-100 transition-colors active:translate-y-1 active:shadow-none"
                                >
                                    Acknowledge & Execute
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
