"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: React.ReactNode
    children: React.ReactNode
    headerColor?: string
}

export function Modal({ isOpen, onClose, title, children, headerColor = "bg-[#FFD600]" }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, rotate: -2 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.95, opacity: 0, rotate: 2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className={`${headerColor} border-b-4 border-black p-4 flex justify-between items-center`}>
                            <h2 className="text-2xl font-black font-mono uppercase flex items-center gap-2">
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                            >
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
