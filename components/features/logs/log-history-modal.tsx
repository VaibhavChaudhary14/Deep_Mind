"use client"

import * as React from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { db, Log } from "@/lib/db"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, Edit, Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { LogModal } from "./log-modal"

interface LogHistoryModalProps {
    isOpen: boolean
    onClose: () => void
}

export function LogHistoryModal({ isOpen, onClose }: LogHistoryModalProps) {
    const logs = useLiveQuery(() => db.logs.orderBy('date').reverse().toArray())
    const [logToEdit, setLogToEdit] = React.useState<Log | undefined>(undefined)
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)

    const handleDelete = async (id: number) => {
        if (confirm("Delete this session log?")) {
            await db.logs.delete(id)
        }
    }

    const handleEdit = (log: Log) => {
        setLogToEdit(log)
        setIsEditModalOpen(true)
    }

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-h-[85vh] flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black font-mono uppercase bg-[#00C2FF] px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    Mission Logs
                                </h2>
                                <button onClick={onClose} className="hover:rotate-90 transition-transform">
                                    <X size={24} strokeWidth={3} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {logs?.length === 0 && (
                                    <div className="text-center py-10 text-gray-400 font-mono">
                                        NO DATA LOGGED
                                    </div>
                                )}
                                {logs?.map((log) => (
                                    <div key={log.id} className="neo-card bg-gray-50 border-2 border-black p-4 flex justify-between items-center hover:bg-white transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 flex items-center justify-center border-2 border-black font-bold text-lg",
                                                log.mood === 'Fire' ? 'bg-[#FF5C00] text-white' :
                                                    log.mood === 'Neutral' ? 'bg-[#FFD600] text-black' : 'bg-gray-200 text-gray-600'
                                            )}>
                                                {log.mood === 'Fire' ? '🔥' : log.mood === 'Neutral' ? '😐' : '😴'}
                                            </div>
                                            <div>
                                                <div className="font-black font-mono uppercase text-lg leading-none mb-1">{log.focus_area}</div>
                                                <div className="flex items-center gap-3 text-xs font-bold text-gray-500 font-mono">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {log.date}</span>
                                                    <span className="flex items-center gap-1 bg-black text-white px-1.5 rounded-sm"><Clock size={12} /> {log.hours_studied}h</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(log)}
                                                className="p-2 hover:bg-[#00FF94] hover:border-black border-2 border-transparent transition-all rounded-none"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(log.id!)}
                                                className="p-2 hover:bg-red-500 hover:text-white hover:border-black border-2 border-transparent transition-all rounded-none"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal Layer */}
            <LogModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setLogToEdit(undefined)
                }}
                logToEdit={logToEdit}
            />
        </>
    )
}
