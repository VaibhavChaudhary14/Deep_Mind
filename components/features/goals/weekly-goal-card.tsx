"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { Trophy, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function WeeklyGoalCard() {
    const goals = useLiveQuery(() => db.goals.where('type').equals('Weekly').toArray())

    const total = goals?.length || 0
    const completed = goals?.filter(g => g.completed).length || 0
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0

    // Get all uncompleted goals, or if all completed, show the last completed ones (up to 3)
    const activeGoals = goals?.filter(g => !g.completed) || []
    const displayGoals = activeGoals.length > 0 ? activeGoals : goals?.slice(-3) || []

    return (
        <div className="neo-card bg-[var(--color-soft-pink)] flex flex-col transition-all duration-300">
            <h3 className="font-bold mb-4 flex items-center gap-2 border-b-2 border-black pb-2">
                <Trophy size={20} />
                Weekly Objectives
            </h3>

            <div className="flex justify-between text-sm font-bold mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
            </div>

            <div className="w-full bg-white border-2 border-black rounded-full h-4 mb-4 overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div
                    className="bg-black h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="space-y-3">
                {total === 0 ? (
                    <div className="text-center text-gray-500 font-mono text-xs py-2 opacity-70">
                        NO ACTIVE WEEKLY GOALS
                    </div>
                ) : (
                    <>
                        {displayGoals.map(goal => (
                            <div key={goal.id} className="flex items-start gap-2">
                                {goal.completed ? (
                                    <CheckCircle2 size={16} className="text-green-700 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <div className="w-4 h-4 border-2 border-black rounded-full mt-0.5 flex-shrink-0 bg-white" />
                                )}
                                <p className={cn(
                                    "text-sm font-bold leading-tight",
                                    goal.completed && "line-through opacity-50"
                                )}>
                                    {goal.text}
                                </p>
                            </div>
                        ))}

                        {activeGoals.length > 5 && (
                            <p className="text-xs font-mono opacity-50 text-center pt-2">
                                + {activeGoals.length - 5} more
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
