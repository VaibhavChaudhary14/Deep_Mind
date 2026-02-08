"use client"

import * as React from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { AnimatePresence } from "framer-motion"
import { Save, User } from "lucide-react"
import { Modal } from "@/components/ui/modal"

export function EditProfileModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const settings = useLiveQuery(() => db.settings.orderBy('id').first())
    const [name, setName] = React.useState("")
    const [role, setRole] = React.useState("")
    const [title, setTitle] = React.useState("")

    React.useEffect(() => {
        if (settings) {
            setName(settings.username || "Member")
            setRole(settings.role || "Professional")
            setTitle(settings.title || "Level 1 • Novice")
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
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    title="Edit Identity"
                    headerColor="bg-[#FFD600]"
                >
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
                </Modal>
            )}
        </AnimatePresence>
    )
}
