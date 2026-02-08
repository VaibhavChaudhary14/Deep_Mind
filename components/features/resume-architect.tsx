
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Copy, Check, Zap, Cpu, Trophy } from "lucide-react"
import { generateResumePoints } from "@/app/actions/ai-resume"

interface ResumePoint {
    action: string
    impact: string
    detail: string
    full_point: string
}

export function ResumeArchitect() {
    const [skill, setSkill] = useState("")
    const [project, setProject] = useState("")
    const [points, setPoints] = useState<ResumePoint[]>([])
    const [loading, setLoading] = useState(false)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    const handleGenerate = async () => {
        if (!skill || !project) return
        setLoading(true)
        setPoints([])

        const res = await generateResumePoints(skill, "Intermediate", project)
        if (res.success && res.data) {
            setPoints(res.data)
        }
        setLoading(false)
    }

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const handleReset = () => {
        setSkill("")
        setProject("")
        setPoints([])
        setLoading(false)
    }

    return (
        <div className="neo-card bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                    <Sparkles size={24} className="text-[#9D00FF]" /> Resume Architect
                </h2>
                {points.length > 0 && (
                    <button onClick={handleReset} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Reset">
                        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>
                        </motion.div>
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {points.length === 0 ? (
                    <motion.div
                        key="input-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="font-bold text-xs uppercase block mb-1 text-gray-500">Key Skill</label>
                            <input
                                value={skill}
                                onChange={(e) => setSkill(e.target.value)}
                                placeholder="e.g. Next.js, Python"
                                className="w-full bg-gray-50 border-2 border-black p-2 font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-xs uppercase block mb-1 text-gray-500">Context</label>
                            <input
                                value={project}
                                onChange={(e) => setProject(e.target.value)}
                                placeholder="e.g. Initialized a RAG pipeline"
                                className="w-full bg-gray-50 border-2 border-black p-2 font-mono text-sm"
                            />
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !skill || !project}
                            className="w-full bg-[#9D00FF] text-white font-bold py-2 border-2 border-black uppercase hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all disabled:opacity-50 text-sm"
                        >
                            {loading ? "Synthesizing..." : "Generate Achievements"}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3"
                    >
                        {points.map((pt, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-gray-50 border-2 border-black p-3 relative group hover:bg-[#E0F2E9] transition-colors"
                            >
                                <button
                                    onClick={() => copyToClipboard(pt.full_point, i)}
                                    className="absolute top-2 right-2 p-1 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors z-10"
                                >
                                    {copiedIndex === i ? <Check size={12} /> : <Copy size={12} />}
                                </button>

                                <div className="flex items-start gap-2 mb-1">
                                    <span className="bg-black text-white text-[9px] font-bold px-1 py-0.5 uppercase">
                                        {pt.action}
                                    </span>
                                    <span className="bg-[#9D00FF] text-white text-[9px] font-bold px-1 py-0.5 uppercase">
                                        {pt.impact}
                                    </span>
                                </div>

                                <div className="font-mono text-[10px] text-gray-500 mb-2 leading-tight">
                                    {pt.detail}
                                </div>

                                <div className="bg-white border-2 border-black p-2 text-xs font-bold leading-snug">
                                    {pt.full_point}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
