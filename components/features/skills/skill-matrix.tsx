"use client"

import * as React from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { db, Skill } from "@/lib/db"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Star, Trophy, Zap, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function SkillMatrix() {
    const skills = useLiveQuery(() => db.skills.toArray())
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [skillToEdit, setSkillToEdit] = React.useState<Skill | undefined>(undefined)

    // Seeding
    React.useEffect(() => {
        const seed = async () => {
            const count = await db.skills.count()
            if (count === 0) {
                await db.skills.bulkAdd([
                    { name: "Python", category: "Language", current_level: 4, target_level: 5, last_updated: new Date() },
                    { name: "PyTorch", category: "Framework", current_level: 3, target_level: 5, last_updated: new Date() },
                    { name: "React", category: "Frontend", current_level: 4, target_level: 4, last_updated: new Date() },
                    { name: "System Design", category: "Core", current_level: 2, target_level: 4, last_updated: new Date() }
                ])
            }
        }
        seed()
    }, [])

    const updateLevel = async (id: number, level: number) => {
        await db.skills.update(id, { current_level: level, last_updated: new Date() })
    }

    const deleteSkill = async (id: number) => {
        if (confirm("Delete this skill?")) {
            await db.skills.delete(id)
        }
    }

    const openModal = (skill?: Skill) => {
        setSkillToEdit(skill)
        setIsModalOpen(true)
    }

    if (!skills) return <div>Loading Matrix...</div>

    const categories = Array.from(new Set(skills.map(s => s.category)))

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black font-mono uppercase tracking-tight bg-[#FF5C00] inline-block px-3 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                    Skill Stack
                </h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-[#00C2FF] hover:text-black transition-all font-bold uppercase font-mono text-sm"
                >
                    <Plus size={16} /> Add Skill
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map((category, index) => (
                    <div key={`${category}-${index}`} className="neo-card bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">
                            {category}
                        </h3>
                        <div className="space-y-6">
                            {skills.filter(s => s.category === category).map((skill) => (
                                <SkillRow key={skill.id} skill={skill} onUpdate={updateLevel} onEdit={() => openModal(skill)} onDelete={() => deleteSkill(skill.id!)} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <AddSkillModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                skillToEdit={skillToEdit}
            />
        </div>
    )
}

function SkillRow({ skill, onUpdate, onEdit, onDelete }: { skill: Skill, onUpdate: any, onEdit: any, onDelete: any }) {
    return (
        <div className="group">
            <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                    <button onClick={onEdit} className="font-bold text-lg hover:underline decoration-2 decoration-[#00C2FF] cursor-pointer">
                        {skill.name}
                    </button>
                    <button onClick={onDelete} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={14} />
                    </button>
                </div>
                <span className="font-mono text-xs font-bold bg-[#FFD600] px-1 border border-black">
                    Lvl {skill.current_level}/{skill.target_level}
                </span>
            </div>

            {/* Custom Bold Progress Bar */}
            <div className="flex gap-1 h-8">
                {[1, 2, 3, 4, 5].map((level) => {
                    const filled = level <= skill.current_level
                    return (
                        <button
                            key={level}
                            onClick={() => onUpdate(skill.id, level)}
                            className={cn(
                                "flex-1 border-2 border-black transition-all hover:translate-y-[-2px]",
                                filled ? "bg-[#00FF94] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-gray-100 opacity-50 hover:opacity-100"
                            )}
                        />
                    )
                })}
            </div>
        </div>
    )
}

function AddSkillModal({ isOpen, onClose, skillToEdit }: { isOpen: boolean, onClose: () => void, skillToEdit?: Skill }) {
    const [name, setName] = React.useState("")
    const [category, setCategory] = React.useState("")
    const [targetLevel, setTargetLevel] = React.useState(5)

    React.useEffect(() => {
        if (skillToEdit) {
            setName(skillToEdit.name)
            setCategory(skillToEdit.category)
            setTargetLevel(skillToEdit.target_level)
        } else {
            setName("")
            setCategory("")
            setTargetLevel(5)
        }
    }, [skillToEdit, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            name,
            category,
            current_level: skillToEdit ? skillToEdit.current_level : 1,
            target_level: targetLevel,
            last_updated: new Date()
        }

        if (skillToEdit?.id) {
            await db.skills.update(skillToEdit.id, payload)
        } else {
            await db.skills.add(payload)
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
                        className="bg-white w-full max-w-md border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black font-mono uppercase bg-[#00FF94] px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                {skillToEdit ? 'Refine Skill' : 'Acquire Skill'}
                            </h3>
                            <button onClick={onClose} className="hover:rotate-90 transition-transform">
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="font-bold font-mono text-xs uppercase block mb-1">Skill Name</label>
                                <input
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                                    placeholder="e.g. Rust"
                                />
                            </div>
                            <div>
                                <label className="font-bold font-mono text-xs uppercase block mb-1">Category</label>
                                <input
                                    required
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                                    placeholder="e.g. Backend, Language..."
                                />
                            </div>
                            <div>
                                <label className="font-bold font-mono text-xs uppercase block mb-1">Target Level (1-5)</label>
                                <input
                                    type="number"
                                    max={5}
                                    min={1}
                                    value={targetLevel}
                                    onChange={e => setTargetLevel(Number(e.target.value))}
                                    className="w-full border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                                />
                            </div>
                            <button className="w-full bg-black text-white font-mono font-bold uppercase py-4 border-2 border-transparent hover:bg-[#FF5C00] hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 mt-4">
                                Save Protocol
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
