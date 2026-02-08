"use client"

import * as React from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { db, Log } from "@/lib/db"
import { AnimatePresence } from "framer-motion"
import { Trash2, Edit, Calendar, Clock } from "lucide-react"
import { Modal } from "@/components/ui/modal"
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
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        title="Mission Logs"
                        headerColor="bg-[#00C2FF]"
                    >
                        <div className="space-y-4 pr-2 custom-scrollbar">
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
                    </Modal>
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
