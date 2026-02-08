"use client"

import * as React from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { db, Application } from "@/lib/db"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Calendar, CheckCircle, Clock, MoreVertical, Plus, Search, X } from "lucide-react"

export function PlacementTracker() {
    const applications = useLiveQuery(() => db.applications.toArray())
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [appToEdit, setAppToEdit] = React.useState<Application | undefined>(undefined)

    const handleDelete = async (id: number) => {
        if (confirm("Delete this application tracker?")) {
            await db.applications.delete(id)
        }
    }

    const openModal = (app?: Application) => {
        setAppToEdit(app)
        setIsModalOpen(true)
    }

    if (!applications) return <div>Loading...</div>

    const statusColors: Record<string, string> = {
        'Applied': 'bg-blue-100 text-blue-700 border-blue-700',
        'OA Received': 'bg-purple-100 text-purple-700 border-purple-700',
        'Interview': 'bg-yellow-100 text-yellow-700 border-yellow-700',
        'Offer': 'bg-green-100 text-green-700 border-green-700',
        'Rejected': 'bg-red-100 text-red-700 border-red-700'
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black font-mono uppercase tracking-tight bg-[#00C2FF] inline-block px-3 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                    Placement Ops
                </h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-[#FFD600] hover:text-black transition-all font-bold uppercase font-mono text-sm"
                >
                    <Plus size={16} /> Track New
                </button>
            </div>

            <div className="grid gap-6">
                {applications.length === 0 && (
                    <div className="text-center py-20 border-4 border-dashed border-gray-300 rounded-xl">
                        <p className="text-xl font-bold text-gray-400 font-mono">NO ACTIVE OPERATIONS</p>
                    </div>
                )}

                {applications.map((app) => (
                    <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="neo-card bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between group p-6"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                                <Building2 size={32} />
                            </div>
                            <div>
                                <h3 className="font-black text-2xl uppercase tracking-tight">{app.company}</h3>
                                <p className="font-mono font-bold text-gray-500 text-sm mt-1">{app.role} • {app.platform}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <div className={`px-2 py-1 border-2 text-xs font-black uppercase inline-block mb-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] ${statusColors[app.status] || 'bg-gray-100 border-black'}`}>
                                    {app.status}
                                </div>
                                <p className="text-xs font-bold font-mono text-gray-500 flex items-center justify-end gap-1">
                                    <Clock size={12} /> {new Date(app.date_applied).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openModal(app)} className="p-2 hover:bg-[#00FF94] hover:border-black border-2 border-transparent transition-all">
                                    <MoreVertical size={20} />
                                </button>
                                <button onClick={() => handleDelete(app.id!)} className="p-2 hover:bg-red-500 hover:text-white hover:border-black border-2 border-transparent transition-all">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AddApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                appToEdit={appToEdit}
            />
        </div>
    )
}

function AddApplicationModal({ isOpen, onClose, appToEdit }: { isOpen: boolean, onClose: () => void, appToEdit?: Application }) {
    const [formData, setFormData] = React.useState({
        company: '',
        role: 'Intern',
        platform: 'LinkedIn',
        date_applied: new Date().toISOString().split('T')[0],
        status: 'Applied'
    })

    React.useEffect(() => {
        if (appToEdit) {
            setFormData({
                company: appToEdit.company,
                role: appToEdit.role,
                platform: appToEdit.platform,
                date_applied: appToEdit.date_applied,
                status: appToEdit.status
            })
        } else {
            setFormData({
                company: '',
                role: 'Intern',
                platform: 'LinkedIn',
                date_applied: new Date().toISOString().split('T')[0],
                status: 'Applied'
            })
        }
    }, [appToEdit, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (appToEdit?.id) {
            await db.applications.update(appToEdit.id, formData)
        } else {
            await db.applications.add(formData as any)
        }

        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black font-mono uppercase bg-[#FFD600] px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                {appToEdit ? 'Update Status' : 'New Target'}
                            </h3>
                            <button onClick={onClose} className="hover:rotate-90 transition-transform">
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="font-bold font-mono text-xs uppercase block mb-1">Company</label>
                                <input
                                    placeholder="e.g. Google"
                                    className="w-full border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                                    value={formData.company}
                                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-bold font-mono text-xs uppercase block mb-1">Role</label>
                                    <input
                                        placeholder="Role"
                                        className="w-full border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="font-bold font-mono text-xs uppercase block mb-1">Status</label>
                                    <select
                                        className="w-full border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option>Applied</option>
                                        <option>OA Received</option>
                                        <option>Interview</option>
                                        <option>Offer</option>
                                        <option>Rejected</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-black text-white font-mono font-bold uppercase py-4 border-2 border-transparent hover:bg-[#00C2FF] hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all mt-4">
                                {appToEdit ? 'Update Intel' : 'Initialize Target'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
