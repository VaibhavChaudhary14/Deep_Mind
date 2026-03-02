"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { ArrowRight, CheckCircle2, Crosshair } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function DailyExecutionBoard() {
    // Pull only "Todo" statuses, limit to top 3 by priority weighting
    const activeTodos = useLiveQuery(() =>
        db.todos.where('status').equals('Todo').toArray()
    );

    // Filter top 3 (mock sort for priority)
    const topPriorities = activeTodos?.sort((a, b) => {
        const pWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return pWeight[b.priority] - pWeight[a.priority];
    }).slice(0, 3) || [];

    const activeRoadmapStrand = useLiveQuery(() =>
        db.roadmap.where('status').equals('Active').first()
    );

    const handleComplete = async (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        await db.todos.update(id, { status: 'Done' });
    };

    return (
        <div className="neo-card bg-white border-4 border-black h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
                <div className="flex items-center gap-3">
                    <Crosshair size={24} className="text-[#FF00FF]" />
                    <h2 className="text-xl font-black font-mono uppercase tracking-tight">Daily Execution Filter</h2>
                </div>
                <Link href="/todos" className="text-xs font-bold font-mono bg-black text-white px-3 py-1 hover:bg-[#FF00FF] transition-colors">
                    FULL CONTROL PANEL <ArrowRight size={14} className="inline ml-1" />
                </Link>
            </div>

            {/* active sprint context */}
            {activeRoadmapStrand && (
                <div className="mb-6 p-4 bg-[#FBF9F1] border-2 border-dashed border-black">
                    <span className="text-[10px] font-black uppercase text-gray-500 mb-1 block">Active Sprint Alignment</span>
                    <div className="font-bold text-sm">Target: {activeRoadmapStrand.topic}</div>
                </div>
            )}

            <div className="space-y-3 flex-grow">
                {topPriorities.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 font-bold font-mono text-sm border-2 border-dashed border-gray-200 h-full flex items-center justify-center">
                        NO ACTIVE PRIORITIES. REST OR PLAN.
                    </div>
                ) : (
                    topPriorities.map((todo) => (
                        <div key={todo.id} className="flex items-start gap-3 p-3 border-2 border-black shadow-[2px_2px_0_#000] hover:-translate-y-1 transition-transform group bg-white cursor-pointer">
                            <button 
                                onClick={(e) => todo.id && handleComplete(e, todo.id)}
                                className="mt-0.5 text-gray-300 group-hover:text-black hover:text-[#00FF94] transition-colors"
                            >
                                <CheckCircle2 size={18} />
                            </button>
                            <div>
                                <div className="font-bold text-sm leading-tight">{todo.title}</div>
                                <div className="flex gap-2 mt-2">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase px-1 border-2 border-black",
                                        todo.priority === 'High' ? 'bg-[#FF5C00] text-white' :
                                            todo.priority === 'Medium' ? 'bg-[#FFD600]' : 'bg-gray-100'
                                    )}>
                                        {todo.priority}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
