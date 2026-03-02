"use client"

import * as React from "react"
import { Shell } from "@/components/layout/shell"
import { useParams, useRouter } from "next/navigation"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { ArrowLeft, Clock, CheckCircle2, Circle, PlayCircle } from "lucide-react"

export default function PlanDetailPage() {
    const params = useParams()
    const router = useRouter()
    const planId = parseInt(params.id as string)

    const plan = useLiveQuery(() => db.ai_plans.get(planId))

    if (plan === undefined) {
        return (
            <Shell>
                <div className="flex justify-center items-center h-64 font-mono font-bold text-gray-500 uppercase tracking-widest">
                    <span className="animate-pulse">Loading Protocol Core...</span>
                </div>
            </Shell>
        )
    }

    if (plan === null) {
        return (
            <Shell>
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="font-mono font-black text-2xl uppercase border-4 border-black p-4 bg-[#FF00FF] text-white shadow-[8px_8px_0_#000]">
                        Protocol Not Found
                    </div>
                    <button onClick={() => router.push('/plan')} className="font-bold underline uppercase font-mono mt-4">Return to Archives</button>
                </div>
            </Shell>
        )
    }

    const handleUpdateDay = async (dayIndex: number, updates: any) => {
        const newContent = [...plan.content];
        newContent[dayIndex] = { ...newContent[dayIndex], ...updates };
        await db.ai_plans.update(planId, { content: newContent });
    }

    return (
        <Shell>
            <div className="max-w-4xl mx-auto space-y-6">
                <header className="pb-6 mb-8 border-b-4 border-black flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <button onClick={() => router.push('/plan')} className="flex items-center gap-2 font-bold font-mono text-gray-500 hover:text-black transition-colors mb-4 border-2 border-transparent hover:border-black py-1 px-2 -ml-2">
                            <ArrowLeft size={16} /> BACK TO ARCHIVES
                        </button>
                        <h1 className="text-4xl font-extrabold tracking-tight font-mono uppercase">{plan.role}</h1>
                        <p className="text-gray-500 font-bold mt-2 bg-yellow-200 inline-block px-2 border-2 border-black transform -rotate-1 text-sm shadow-[2px_2px_0_#000]">
                            Deployed on {new Date(plan.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white border-4 border-black p-3 text-center shadow-[4px_4px_0_#000]">
                            <div className="text-3xl font-black font-mono">
                                {plan.content.filter((d: any) => d.status === 'Done').length}
                                <span className="text-gray-400 text-xl">/90</span>
                            </div>
                            <div className="text-[10px] font-bold uppercase text-gray-500">Days Cleared</div>
                        </div>
                    </div>
                </header>

                <div className="space-y-4">
                    {plan.content.map((day: any, idx: number) => (
                        <div key={idx} className={`bg-white border-4 border-black p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-[4px_4px_0_#000] transition-opacity duration-300 ${day.status === 'Done' ? 'opacity-60 bg-gray-50' : ''}`}>
                            <div className="flex items-center gap-4 flex-1 w-full">
                                <div className={`w-16 h-16 border-2 border-black flex items-center justify-center font-black font-mono text-xl flex-shrink-0 transition-colors ${day.status === 'Done' ? 'bg-[#00FF94]' : day.status === 'In Progress' ? 'bg-[#FFD600]' : 'bg-[#FBF9F1]'}`}>
                                    #{day.day}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold font-mono text-lg leading-tight md:truncate md:max-w-md lg:max-w-lg ${day.status === 'Done' ? 'line-through text-gray-400' : ''}`}>{day.title}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black ${day.priority === 'High' ? 'bg-[#FF5C00] text-white' : day.priority === 'Medium' ? 'bg-[#FFD600] text-black' : 'bg-gray-100 text-black'}`}>
                                            {day.priority}
                                        </span>
                                        {day.status !== 'Todo' && (
                                            <span className="text-[10px] font-bold uppercase text-gray-500 font-mono">
                                                STATUS: {day.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t-2 md:border-t-0 border-dashed border-gray-300">
                                <div className="flex items-center gap-2 bg-[#FBF9F1] p-1.5 border-2 border-black shadow-[2px_2px_0_#000]">
                                    <Clock size={16} className="text-gray-500" />
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={day.time_taken || ''}
                                        onChange={(e) => handleUpdateDay(idx, { time_taken: parseInt(e.target.value) || 0 })}
                                        className="w-12 bg-transparent border-b-2 border-black font-bold font-mono text-center focus:outline-none focus:bg-white transition-colors"
                                    />
                                    <span className="text-xs font-bold font-mono text-gray-500">min</span>
                                </div>

                                <div className="flex gap-1 bg-gray-100 p-1 border-2 border-black">
                                    <button
                                        onClick={() => handleUpdateDay(idx, { status: 'Todo' })}
                                        className={`p-1.5 border-2 border-transparent transition-all ${day.status === 'Todo' ? 'bg-black text-white border-black' : 'hover:bg-gray-200'}`}
                                        title="To Do"
                                    >
                                        <Circle size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateDay(idx, { status: 'In Progress' })}
                                        className={`p-1.5 border-2 border-transparent transition-all ${day.status === 'In Progress' ? 'bg-[#FFD600] text-black border-black' : 'hover:bg-[#FFD600]'}`}
                                        title="In Progress"
                                    >
                                        <PlayCircle size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateDay(idx, { status: 'Done' })}
                                        className={`p-1.5 border-2 border-transparent transition-all ${day.status === 'Done' ? 'bg-[#00FF94] text-black border-black' : 'hover:bg-[#00FF94]'}`}
                                        title="Done"
                                    >
                                        <CheckCircle2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Shell>
    )
}
