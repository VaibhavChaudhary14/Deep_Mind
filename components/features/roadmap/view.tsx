"use client"

import * as React from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { db, Roadmap } from "@/lib/db"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, Clock, Plus, Wand2, Edit3 } from "lucide-react"
import { cn } from "@/lib/utils"
// import { RoadmapGenerator } from "./generator" // Temporarily commenting out if not used directly or assuming it's pop-up driven
import { RoadmapEditor } from "./editor"
import { RoadmapGenerator } from "./generator"

export function RoadmapView() {
    const roadmap = useLiveQuery(() => db.roadmap.toArray())
    const [isEditorOpen, setIsEditorOpen] = React.useState(false)
    const [isGeneratorOpen, setIsGeneratorOpen] = React.useState(false)
    const [selectedWeek, setSelectedWeek] = React.useState<Roadmap | undefined>(undefined)

    // Seeding logic (Simplified for brevity, assuming already seeded or manual add)
    React.useEffect(() => {
        const seed = async () => {
            const count = await db.roadmap.count()
            if (count === 0) {
                // Initial seed logic if needed
            }
        }
        seed()
    }, [])

    const handleEdit = (week: Roadmap) => {
        setSelectedWeek(week)
        setIsEditorOpen(true)
    }

    const handleAdd = () => {
        setSelectedWeek(undefined)
        setIsEditorOpen(true)
    }

    if (!roadmap) return <div>Loading Plan...</div>

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black font-mono uppercase tracking-tight bg-[#FFD600] inline-block px-3 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                    Master Plan
                </h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsGeneratorOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#9D00FF] text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all font-bold uppercase font-mono text-sm"
                    >
                        <Wand2 size={16} /> AI Generate
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-gray-800 transition-all font-bold uppercase font-mono text-sm"
                    >
                        <Plus size={16} /> Add Week
                    </button>
                </div>
            </div>

            <div className="relative border-l-4 border-black ml-4 space-y-12">
                {roadmap?.sort((a, b) => a.week - b.week).map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-12"
                    >
                        {/* Timeline Connector */}
                        <div className={cn(
                            "absolute -left-[14px] top-0 w-6 h-6 rounded-full border-4 border-black z-10",
                            step.status === 'Completed' ? "bg-[#00FF94]" :
                                step.status === 'Active' ? "bg-[#FFD600]" : "bg-white"
                        )} />

                        <div className={cn(
                            "neo-card relative group",
                            step.status === 'Active' ? "bg-white border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "bg-gray-50 opacity-80"
                        )}>
                            <button
                                onClick={() => handleEdit(step)}
                                className="absolute top-4 right-4 p-2 bg-white border-2 border-black text-black opacity-0 group-hover:opacity-100 transition-all hover:bg-[#00C2FF] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <Edit3 size={16} />
                            </button>

                            <div className="flex items-center gap-4 mb-4">
                                <span className="font-mono font-black text-lg bg-black text-white px-3 py-1 border-2 border-transparent">
                                    WEEK {step.week}
                                </span>
                                <span className={cn(
                                    "text-xs font-bold uppercase border-2 border-black px-2 py-0.5",
                                    step.status === 'Completed' ? "bg-[#00FF94]" :
                                        step.status === 'Active' ? "bg-[#FFD600]" : "bg-gray-200"
                                )}>
                                    {step.status}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black font-sans uppercase mb-4 text-black">{step.topic}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold border-b-2 border-black mb-2 inline-block text-black">GOALS</h4>
                                    <ul className="space-y-2">
                                        {step.goals?.map((goal, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm font-medium text-black">
                                                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-black" strokeWidth={2.5} />
                                                {goal}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold border-b-2 border-black mb-2 inline-block text-black">PROJECT</h4>
                                    <div className="bg-[#00C2FF] p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <p className="font-bold text-black">{step.project}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <RoadmapEditor
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                weekToEdit={selectedWeek}
            />

            <RoadmapGenerator
                isOpen={isGeneratorOpen}
                onClose={() => setIsGeneratorOpen(false)}
            />
        </div>
    )
}
