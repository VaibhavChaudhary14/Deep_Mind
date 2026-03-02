"use client"

import * as React from "react"
import { RoadmapGenerator } from "@/components/features/roadmap/generator"
import { Shell } from "@/components/layout/shell"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { Trash2, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PlanPage() {
    const [isGeneratorOpen, setIsGeneratorOpen] = React.useState(false)
    const savedPlans = useLiveQuery(() => db.ai_plans.orderBy('created_at').reverse().toArray())

    const handleDelete = async (id: number) => {
        if (confirm("Delete this Master Plan forever?")) {
            await db.ai_plans.delete(id)
        }
    }

    return (
        <Shell>
            <div className="max-w-4xl mx-auto space-y-6">
                <header className="pb-6 mb-8 border-b-4 border-black flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight font-mono uppercase">Master Plan AI</h1>
                        <p className="text-gray-500 font-bold mt-2">Summon the Strategic Coach to design your 90-day protocol.</p>
                    </div>
                    {!isGeneratorOpen && (
                        <button
                            onClick={() => setIsGeneratorOpen(true)}
                            className="bg-black text-[#00FF94] font-black uppercase font-mono px-4 py-2 border-2 border-black hover:bg-[#00FF94] hover:text-black transition-colors shadow-[4px_4px_0_#000] active:translate-y-[2px] active:shadow-none flex items-center gap-2"
                        >
                            <Plus size={16} /> Generate New
                        </button>
                    )}
                </header>

                <RoadmapGenerator
                    isOpen={isGeneratorOpen}
                    onClose={() => setIsGeneratorOpen(false)}
                    isEmbedded={true}
                />

                {!isGeneratorOpen && savedPlans && savedPlans.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black font-mono uppercase border-b-4 border-black pb-2">Roadmaps Created</h2>

                        <div className="space-y-4">
                            {savedPlans.map(plan => (
                                <Link href={`/plan/${plan.id}`} key={plan.id} className="block group">
                                    <div className="bg-white border-4 border-black shadow-[8px_8px_0_#000] overflow-hidden group-hover:-translate-y-1 transition-transform cursor-pointer">
                                        <div className="p-6 bg-[#FBF9F1] flex items-center justify-between group-hover:bg-[#FFD600] transition-colors">
                                            <div>
                                                <h3 className="text-xl font-black font-mono uppercase">{plan.role}</h3>
                                                <p className="font-bold text-gray-500 text-sm mt-1">Generated on {new Date(plan.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(plan.id!) }}
                                                    className="p-2 text-red-500 hover:bg-white border-2 border-transparent hover:border-black transition-all"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                                <div className="bg-black text-white p-2 border-2 border-black group-hover:bg-white group-hover:text-black transition-colors">
                                                    <ArrowRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Shell>
    )
}
