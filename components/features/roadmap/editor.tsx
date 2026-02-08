"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Trash2, Save, Calendar } from "lucide-react"
import { db, Roadmap } from "@/lib/db"

interface RoadmapEditorProps {
    isOpen: boolean
    onClose: () => void
    weekToEdit?: Roadmap
}

export function RoadmapEditor({ isOpen, onClose, weekToEdit }: RoadmapEditorProps) {
    const [formData, setFormData] = React.useState({
        week: 1,
        topic: '',
        status: 'Planned',
        goals: '',
        project: ''
    })

    React.useEffect(() => {
        if (weekToEdit) {
            setFormData({
                week: weekToEdit.week,
                topic: weekToEdit.topic || '',
                status: weekToEdit.status || 'Planned',
                goals: weekToEdit.goals ? weekToEdit.goals.join('\n') : '',
                project: weekToEdit.project || ''
            })
        } else {
            // Default to next available week? For now manual.
            setFormData({
                week: 1,
                topic: '',
                status: 'Planned',
                goals: '',
                project: ''
            })
        }
    }, [weekToEdit, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload = {
            week: Number(formData.week),
            topic: formData.topic,
            status: formData.status as any,
            goals: formData.goals.split('\n').map(s => s.trim()).filter(Boolean),
            project: formData.project
        }

        if (weekToEdit?.id) {
            await db.roadmap.update(weekToEdit.id, payload)
        } else {
            await db.roadmap.add(payload)
        }

        onClose()
        setFormData({ week: 1, topic: '', status: 'Planned', goals: '', project: '' })
    }

    const handleDelete = async () => {
        if (confirm("Delete this week plan?")) {
            await db.roadmap.delete(weekToEdit!.id)
            onClose()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, rotate: -2 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.95, opacity: 0, rotate: 2 }}
                        className="w-full max-w-lg bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#FFD600] border-b-4 border-black p-4 flex justify-between items-center">
                            <h3 className="text-2xl font-black font-mono uppercase">
                                {weekToEdit ? 'Edit Mission Plan' : 'Draft New Week'}
                            </h3>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                            >
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-1">
                                    <label className="font-bold font-mono text-xs uppercase block mb-1">Week #</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-50 border-2 border-black p-3 font-bold text-center outline-none focus:bg-[#E0F2E9]"
                                        value={formData.week}
                                        onChange={e => setFormData({ ...formData, week: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label className="font-bold font-mono text-xs uppercase block mb-1">Mission Topic</label>
                                    <input
                                        className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                                        placeholder="e.g. Advanced Rust Patterns"
                                        value={formData.topic}
                                        onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-bold font-mono text-xs uppercase block mb-1">Directives (Goals) - One per line</label>
                                <textarea
                                    className="w-full bg-gray-50 border-2 border-black p-3 font-bold font-mono text-sm outline-none focus:bg-[#E0F2E9] min-h-[100px] resize-none"
                                    placeholder={"1. Complete Chapter 4\n2. Build CLI Tool\n3. Write 3 blog posts"}
                                    value={formData.goals}
                                    onChange={e => setFormData({ ...formData, goals: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="font-bold font-mono text-xs uppercase block mb-1">Core Project</label>
                                <input
                                    className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                                    placeholder="e.g. Multi-threaded Web Server"
                                    value={formData.project}
                                    onChange={e => setFormData({ ...formData, project: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="font-bold font-mono text-xs uppercase block mb-1">Status</label>
                                <div className="flex gap-2">
                                    {['Planned', 'Active', 'Completed'].map(s => (
                                        <button
                                            type="button"
                                            key={s}
                                            onClick={() => setFormData({ ...formData, status: s })}
                                            className={`flex-1 py-2 border-2 border-black font-bold uppercase text-xs transition-all ${formData.status === s
                                                ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]'
                                                : 'bg-white hover:bg-gray-100'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t-2 border-black">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#00FF94] text-black border-2 border-black py-4 font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={24} strokeWidth={3} />
                                    {weekToEdit ? 'Save Changes' : 'Confirm Week'}
                                </button>
                                {weekToEdit && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-6 border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        <Trash2 size={24} strokeWidth={3} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
