"use client"

import { useDeepWork } from "@/components/providers/deep-work-provider"
import { useExecutionScore } from "@/hooks/use-execution-score"
import { Flame, Sun, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
    const { isDeepWork, toggleDeepWork } = useDeepWork()
    const { score, details } = useExecutionScore()
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight font-mono uppercase">Dashboard</h1>
                <p className="text-gray-500 font-bold mt-1 bg-[var(--color-mustard)] inline-block px-2 transform -rotate-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black text-sm">{today}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                {/* Execution Score Badge */}
                <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                    score >= 80 ? "bg-[#c6f6d5]" : score >= 50 ? "bg-[#feebc8]" : "bg-[#fed7d7]"
                )}>
                    <span className="text-xs font-bold uppercase tracking-wider text-black">Execution Score</span>
                    <span className="text-xl font-bold font-mono text-black">{score}</span>
                </div>

                {/* Streak Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                    <span className="font-bold font-mono text-black">{details.streak} Day Streak</span>
                </div>

                {/* Deep Work Toggle */}
                <button
                    onClick={toggleDeepWork}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black transition-all font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none",
                        isDeepWork
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-[var(--color-soft-pink)] text-black hover:bg-[#f6dbe8]"
                    )}
                >
                    {isDeepWork ? <Sun className="w-4 h-4" /> : <Timer className="w-4 h-4" />}
                    <span>{isDeepWork ? "Exit Focus" : "Enter Focus"}</span>
                </button>
            </div>
        </header>
    )
}
