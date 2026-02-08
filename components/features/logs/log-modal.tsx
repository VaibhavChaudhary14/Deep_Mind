"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Clock, ArrowRight, Check, Zap } from "lucide-react"
import { db, Log } from "@/lib/db"
import { cn } from "@/lib/utils"
import { useXP } from "@/store/use-xp"
import { XP_VALUES } from "@/lib/gamification"

interface LogModalProps {
    isOpen: boolean
    onClose: () => void
    logToEdit?: Log
}

const FOCUS_AREAS = [
    { id: 'Deep Work', label: 'Deep Work', color: 'bg-[#00C2FF]' },
    { id: 'Learning', label: 'Learning', color: 'bg-[#FFD600]' },
    { id: 'Projects', label: 'Projects', color: 'bg-[#FF5C00]' },
    { id: 'Planning', label: 'Planning', color: 'bg-[#9D00FF]' },
    { id: 'Outreach', label: 'Outreach', color: 'bg-[#00FF94]' },
    { id: 'Admin', label: 'Admin', color: 'bg-gray-400' },
]

const MOODS = [
    { id: 'Fire', label: '🔥 On Fire' },
    { id: 'Neutral', label: '😐 Neutral' },
    { id: 'Tired', label: '😴 Tired' },
]

export function LogModal({ isOpen, onClose, logToEdit }: LogModalProps) {
    const [formData, setFormData] = React.useState({
        date: new Date().toISOString().split('T')[0],
        hours_studied: 4,
        focus_area: 'Python',
        tasks_completed: 1,
        mood: 'Fire',
        deep_work_intervals: 0
    })
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    React.useEffect(() => {
        if (logToEdit) {
            setFormData({
                date: logToEdit.date,
                hours_studied: logToEdit.hours_studied,
                focus_area: logToEdit.focus_area,
                tasks_completed: logToEdit.tasks_completed,
                mood: logToEdit.mood,
                deep_work_intervals: logToEdit.deep_work_intervals
            })
        } else {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                hours_studied: 4,
                focus_area: 'Python',
                tasks_completed: 1,
                mood: 'Fire',
                deep_work_intervals: 0
            })
        }
    }, [logToEdit, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const payload = {
                date: formData.date,
                hours_studied: Number(formData.hours_studied),
                focus_area: formData.focus_area as any,
                tasks_completed: Number(formData.tasks_completed),
                mood: formData.mood as any,
                deep_work_intervals: Number(formData.deep_work_intervals),
                created_at: logToEdit ? logToEdit.created_at : new Date()
            }

            if (logToEdit?.id) {
                await db.logs.update(logToEdit.id, payload)
            } else {
                await db.logs.add(payload)
                // Award XP for new log
                // useXP.getState().addXP(XP_VALUES.DAILY_LOG, "Daily Log") // Can't use hook inside async function easily without getState or passing it in.
                // Actually, I can use the hook in the component and passing the function.
                // But wait, `useXP` is a hook. I can import the store directly if I need to use it outside, 
                // BUT `useXP` is created with `create` from zustand, so it acts as both a hook and a store.
                // So `useXP.getState().addXP(...)` is valid!
                useXP.getState().addXP(XP_VALUES.DAILY_LOG, "Daily Log Check-in")
            }

            onClose()
        } catch (err) {
            console.error("Failed to log work", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, rotate: -2 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.95, opacity: 0, rotate: 2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-[#FFD600] border-b-4 border-black p-4 flex justify-between items-center">
                                <h2 className="text-2xl font-black font-mono uppercase flex items-center gap-2">
                                    <Clock size={28} strokeWidth={3} />
                                    {logToEdit ? "Edit Mission" : "Log Mission"}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                                >
                                    <X size={24} strokeWidth={3} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="font-bold font-mono text-xs uppercase block">Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                required
                                                value={formData.date}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                                            />
                                            <Calendar className="absolute right-3 top-3 text-black pointer-events-none" size={20} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold font-mono text-xs uppercase block">Hours</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0.5"
                                            max="24"
                                            required
                                            value={formData.hours_studied}
                                            onChange={e => setFormData({ ...formData, hours_studied: Number(e.target.value) })}
                                            className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-bold font-mono text-xs uppercase block">Focus Area</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {FOCUS_AREAS.map(area => (
                                            <button
                                                key={area.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, focus_area: area.id })}
                                                className={cn(
                                                    "py-2 px-2 border-2 text-xs font-bold uppercase transition-all flex items-center gap-2",
                                                    formData.focus_area === area.id
                                                        ? "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white transform -translate-y-1"
                                                        : "border-transparent bg-gray-100 hover:border-black hover:bg-white text-gray-500"
                                                )}
                                                style={{
                                                    backgroundColor: formData.focus_area === area.id ? area.color : undefined
                                                }}
                                            >
                                                {area.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="font-bold font-mono text-xs uppercase block">Tasks Crushed</label>
                                        <input
                                            type="number"
                                            min="0"
                                            required
                                            value={formData.tasks_completed}
                                            onChange={e => setFormData({ ...formData, tasks_completed: Number(e.target.value) })}
                                            className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold font-mono text-xs uppercase block">Energy Level</label>
                                        <select
                                            value={formData.mood}
                                            onChange={e => setFormData({ ...formData, mood: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                                        >
                                            {MOODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#00FF94] text-black border-2 border-black py-4 font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <span className="animate-spin">⏳</span> : <Check size={28} strokeWidth={4} />}
                                    {logToEdit ? "Update Mission" : "Confirm Log"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
