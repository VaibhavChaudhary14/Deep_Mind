"use client"

import * as React from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { motion, AnimatePresence } from "framer-motion"
import { X, Save, User } from "lucide-react"

export function EditProfileModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const settings = useLiveQuery(() => db.settings.orderBy('id').first())
    const [name, setName] = React.useState("")
    const [role, setRole] = React.useState("")
    const [title, setTitle] = React.useState("")

    React.useEffect(() => {
        if (settings) {
            setName(settings.username || "Engineer")
            setRole(settings.role || "Engineer")
            setTitle(settings.title || "L3 • SDE II")
        }
    }, [settings, isOpen])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (settings?.id) {
            await db.settings.update(settings.id, {
                username: name,
                role: role,
                title: title
            })
        } else {
            // Fallback init if missing
            await db.settings.add({
                username: name,
                role: role,
                title: title,
                theme: 'light',
                streak: 0,
                execution_score: 0,
                deep_work_mode: false
            })
        }
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black font-mono uppercase bg-[#FFD600] px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                Edit Identity
                            </h2>
                            <button onClick={onClose} className="hover:rotate-90 transition-transform">
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="font-bold font-mono text-xs uppercase block">Codename / Name</label>
                                <div className="flex items-center gap-2 border-2 border-black p-2 focuses:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                                    <User size={20} />
                                    <input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full outline-none font-bold bg-transparent"
                                        placeholder="e.g. Neo"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-bold font-mono text-xs uppercase block">Role</label>
                                <input
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    className="w-full border-2 border-black p-3 font-medium outline-none focus:bg-[#E0F2E9]"
                                    placeholder="e.g. AI Engineer"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-bold font-mono text-xs uppercase block">Level / Title</label>
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full border-2 border-black p-3 font-medium outline-none focus:bg-[#E0F2E9]"
                                    placeholder="e.g. L4 • Senior Architect"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white font-mono font-bold uppercase py-4 border-2 border-transparent hover:bg-[#00FF94] hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={18} /> Save Identity
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
