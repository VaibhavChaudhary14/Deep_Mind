"use client"

import { DeepWorkTimer } from "@/components/features/deep-work/timer"
import { motion } from "framer-motion"
import { Brain, Zap, Coffee } from "lucide-react"
import { Shell } from "@/components/layout/shell"

export default function DeepWorkPage() {
    return (
        <Shell>
            <main className="min-h-[80vh] flex flex-col items-center justify-center">
                <div className="max-w-4xl w-full space-y-8">
                    <header className="text-center space-y-2">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest"
                        >
                            <Zap size={14} className="text-[#00C2FF]" fill="currentColor" />
                            High Performance Zone
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
                            Deep <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] to-[#00FF94]">Work</span>
                        </h1>
                        <p className="font-mono text-gray-500 font-bold max-w-md mx-auto">
                            60-minute blocks. Zero distractions. Pure output.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Instructions */}
                        <div className="hidden md:block space-y-4">
                            <div className="neo-card bg-white rotate-[-2deg]">
                                <h3 className="font-bold flex items-center gap-2"><Brain size={18} /> Protocol</h3>
                                <ul className="text-sm space-y-2 mt-2 font-mono text-gray-600">
                                    <li>1. Eliminate notifications</li>
                                    <li>2. Define one clear goal</li>
                                    <li>3. No tab switching</li>
                                    <li>4. Hydrate during breaks</li>
                                </ul>
                            </div>
                        </div>

                        {/* Main Timer */}
                        <div className="md:col-span-1 transform scale-110">
                            <DeepWorkTimer defaultFocusMinutes={60} isLapMode={true} />
                        </div>

                        {/* Stats/Laps */}
                        <div className="hidden md:block space-y-4">
                            <div className="neo-card bg-white rotate-[2deg]">
                                <h3 className="font-bold flex items-center gap-2"><Coffee size={18} /> Recovery</h3>
                                <p className="text-sm mt-2 font-mono text-gray-600">
                                    After each 60m lap, take a 10m walk or stretch. Your brain needs the reset to maintain neuroplasticity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Shell>
    )
}
