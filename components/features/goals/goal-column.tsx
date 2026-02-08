"use client"

import * as React from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { db, Goal } from "@/lib/db"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Check, Trash2, Target, Calendar, Clock, Crosshair } from "lucide-react"
import { cn } from "@/lib/utils"

interface GoalColumnProps {
    type: 'Daily' | 'Weekly' | 'Monthly'
    color: string
    icon: React.ElementType
}

export function GoalColumn({ type, color, icon: Icon }: GoalColumnProps) {
    const goals = useLiveQuery(() => db.goals.where('type').equals(type).toArray(), [type])
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [editText, setEditText] = React.useState("")
    const [newGoal, setNewGoal] = React.useState("")

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newGoal.trim()) return
        await db.goals.add({
            type: type,
            text: newGoal,
            completed: false,
            created_at: new Date()
        })
        setNewGoal("")
    }

    const toggleComplete = async (goal: Goal) => {
        await db.goals.update(goal.id!, { completed: !goal.completed })
    }

    const handleDelete = async (id: number) => {
        if (confirm("Delete this directive?")) {
            await db.goals.delete(id)
        }
    }

    const startEdit = (goal: Goal) => {
        setEditingId(goal.id!)
        setEditText(goal.text)
    }

    const saveEdit = async (id: number) => {
        if (!editText.trim()) return
        await db.goals.update(id, { text: editText })
        setEditingId(null)
    }

    return (
        <div className={cn("neo-card h-full flex flex-col min-h-[500px]", color)}>
            <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-4">
                <div className="p-2 bg-black text-white border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                    <Icon size={20} />
                </div>
                <h3 className="font-black font-mono text-xl uppercase">{type} Targets</h3>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {goals?.map(goal => (
                        <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={cn(
                                "group flex items-center gap-3 p-3 border-2 border-black transition-all bg-white",
                                goal.completed ? "opacity-60 bg-gray-100" : "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px]"
                            )}
                        >
                            <button
                                onClick={() => toggleComplete(goal)}
                                className={cn(
                                    "w-6 h-6 border-2 border-black flex items-center justify-center transition-colors flex-shrink-0",
                                    goal.completed ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                                )}
                            >
                                {goal.completed && <Check size={14} strokeWidth={4} />}
                            </button>

                            {editingId === goal.id ? (
                                <input
                                    autoFocus
                                    value={editText}
                                    onChange={e => setEditText(e.target.value)}
                                    onBlur={() => saveEdit(goal.id!)}
                                    onKeyDown={e => e.key === 'Enter' && saveEdit(goal.id!)}
                                    className="flex-1 bg-white border-b-2 border-black outline-none font-bold font-mono text-sm"
                                />
                            ) : (
                                <span
                                    onClick={() => startEdit(goal)}
                                    className={cn(
                                        "flex-1 font-bold text-sm leading-tight font-mono cursor-pointer hover:underline",
                                        goal.completed && "line-through"
                                    )}
                                >
                                    {goal.text}
                                </span>
                            )}

                            <button
                                onClick={() => handleDelete(goal.id!)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                    {goals?.length === 0 && (
                        <div className="text-center py-12 text-black/40 font-mono text-xs font-bold border-2 border-dashed border-black/20">
                            NO ORDERS RECEIVED
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input */}
            <form onSubmit={handleAdd} className="mt-4 flex gap-2 pt-4 border-t-2 border-black">
                <input
                    value={newGoal}
                    onChange={e => setNewGoal(e.target.value)}
                    placeholder={`Add ${type} Objective...`}
                    className="flex-1 bg-white border-2 border-black p-2 font-bold font-mono text-xs outline-none focus:bg-[#E0F2E9] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                />
                <button
                    type="submit"
                    disabled={!newGoal.trim()}
                    className="p-2 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:shadow-none"
                >
                    <Plus size={18} />
                </button>
            </form>
        </div>
    )
}
