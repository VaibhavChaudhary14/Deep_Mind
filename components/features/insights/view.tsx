"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Bot, LineChart, Lock, Sparkles, TrendingUp, BookOpen, Target, Brain, Zap, Rocket } from "lucide-react"

export function InsightsView() {
    return (
        <div className="space-y-8 pb-20">
            <div className="neo-card bg-[#9D00FF] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 text-white">
                <div className="p-3 bg-black border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                    <Brain size={32} strokeWidth={3} className="text-[#00FF94]" />
                </div>
                <div>
                    <h2 className="text-3xl font-black font-mono uppercase tracking-tighter">AI Career Coach</h2>
                    <p className="font-bold font-mono text-sm opacity-90">Analyzing performance patterns & trajectory.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Output Analysis */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="neo-card bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden p-0"
                >
                    <div className="bg-black p-4 flex justify-between items-center border-b-4 border-black">
                        <h3 className="font-black text-xl text-white uppercase font-mono flex items-center gap-2">
                            <Zap className="text-[#FFD600]" strokeWidth={3} />
                            Velocity Scan
                        </h3>
                        <div className="px-2 py-1 bg-[#FFD600] text-black font-bold font-mono text-xs border-2 border-white">
                            LIVE
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="bg-[#E0F2E9] p-4 border-2 border-black mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <p className="font-mono text-sm font-bold text-black leading-relaxed">
                                <span className="bg-black text-[#00FF94] px-1 mr-1">&gt;</span> Analyzing git commits & log frequency...<br />
                                <span className="bg-black text-[#00FF94] px-1 mr-1">&gt;</span> <strong>INSIGHT:</strong> You ship 40% more code on Tuesdays.<br />
                                <span className="bg-black text-[#00FF94] px-1 mr-1">&gt;</span> <strong>TIP:</strong> Move deep work blocks to Tuesday mornings.
                            </p>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span>Weekly Output</span>
                            <span className="bg-black text-white px-2 py-1 font-mono">Top 5%</span>
                        </div>
                    </div>
                </motion.div>

                {/* Promotion Readiness */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="neo-card bg-[#FFD600] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden"
                >
                    <div className="bg-black p-4 border-b-4 border-black">
                        <h3 className="font-black text-xl text-white uppercase font-mono flex items-center gap-2">
                            <Rocket className="text-[#FF5C00]" strokeWidth={3} />
                            Level Up
                        </h3>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <div className="flex justify-between text-sm font-black mb-2 uppercase">
                                <span>L4 (Senior) Requirements</span>
                                <span>72%</span>
                            </div>
                            <div className="h-6 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative">
                                <div className="h-full bg-[#FF5C00] border-r-2 border-black" style={{ width: '72%' }} />
                            </div>
                        </div>

                        <p className="font-bold font-mono text-sm">
                            You need <span className="underline decoration-2 decoration-black">2 more System Design artifacts</span> and <span className="underline decoration-2 decoration-black">1 Mentorship activity</span> to hit L4 criteria.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Unlocked Advanced Features */}
            <div>
                <h3 className="text-2xl font-black uppercase font-mono mb-6 bg-black text-white inline-block px-4 py-1 border-4 border-black transform -skew-x-12">
                    Expert Protocols
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="neo-card bg-[#FF5C00] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group hover:-translate-y-1 transition-transform"
                    >
                        <div className="p-4 bg-black border-b-4 border-black text-white flex justify-between items-start">
                            <BookOpen size={32} strokeWidth={3} />
                            <span className="text-xs font-mono border border-white px-1">LOCKED</span>
                        </div>
                        <div className="p-4">
                            <h4 className="font-black text-lg uppercase mb-2">System Design</h4>
                            <p className="font-bold text-xs mb-4">Master distributed systems from 0 to 1.</p>
                            <div className="h-2 w-full bg-black/20">
                                <div className="h-full w-1/3 bg-black"></div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="neo-card bg-[#00C2FF] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group hover:-translate-y-1 transition-transform"
                    >
                        <div className="p-4 bg-black border-b-4 border-black text-white flex justify-between items-start">
                            <Target size={32} strokeWidth={3} />
                            <span className="text-xs font-mono border border-white px-1 bg-[#00FF94] text-black font-bold">READY</span>
                        </div>
                        <div className="p-4">
                            <h4 className="font-black text-lg uppercase mb-2">Leetcode Agent</h4>
                            <p className="font-bold text-xs mb-4">Mock interviews for Hard problems.</p>
                            <button className="w-full py-2 bg-black text-white font-mono font-bold text-xs hover:bg-white hover:text-black border-2 border-transparent hover:border-black transition-colors uppercase">
                                Start Simulation
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="neo-card bg-[#00FF94] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group hover:-translate-y-1 transition-transform"
                    >
                        <div className="p-4 bg-black border-b-4 border-black text-white flex justify-between items-start">
                            <Bot size={32} strokeWidth={3} />
                            <span className="text-xs font-mono border border-white px-1">NEW</span>
                        </div>
                        <div className="p-4">
                            <h4 className="font-black text-lg uppercase mb-2">Resume AI</h4>
                            <p className="font-bold text-xs mb-4">Auto-tailor for specific JDs.</p>
                            <button className="w-full py-2 bg-white border-2 border-black text-black font-mono font-bold text-xs hover:bg-black hover:text-white transition-colors uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                Upload PDF
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
