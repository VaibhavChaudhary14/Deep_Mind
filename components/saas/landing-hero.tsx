"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Brain, Code2, Rocket, Terminal } from "lucide-react"

export function LandingHero() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--color-bg-primary)]">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[60%] bg-purple-900/10 blur-[100px] rounded-full" />
            </div>

            <div className="z-10 text-center max-w-4xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-800 bg-gray-900/50 text-xs font-mono text-gray-400 mb-6 backdrop-blur-sm"
                >
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Mission Control V2 is Live
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6 tracking-tight"
                >
                    Master Your AI Career
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto"
                >
                    The all-in-one operating system for AI/ML Engineers. Track deep work, visualize skill growth, and ship projects that get you hired.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link href="/dashboard" className="px-8 py-4 bg-[var(--color-primary)] text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 group">
                        <Rocket className="group-hover:-translate-y-1 transition-transform" />
                        Launch Console
                    </Link>
                    <Link href="#features" className="px-8 py-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-gray-800 rounded-xl font-bold text-lg hover:bg-[var(--color-bg-tertiary)] transition-all">
                        Explore Features
                    </Link>
                </motion.div>
            </div>

            {/* Feature Grid Mockup */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-20 w-full max-w-6xl px-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={Brain}
                        title="Skill Intelligence"
                        desc="Track proficiency across Python, ML, and Deployment with evidence-based logging."
                        gradient="from-blue-500/20 to-cyan-500/5"
                    />
                    <FeatureCard
                        icon={Terminal}
                        title="Deep Work Tracker"
                        desc="Built-in Pomodoro timer and flow state tracking to maximize your output."
                        gradient="from-purple-500/20 to-pink-500/5"
                    />
                    <FeatureCard
                        icon={Code2}
                        title="Project Portfolio"
                        desc="Manage your build pipeline from ideation to deployment with Kanban boards."
                        gradient="from-green-500/20 to-emerald-500/5"
                    />
                </div>
            </motion.div>
        </div>
    )
}

function FeatureCard({ icon: Icon, title, desc, gradient }: any) {
    return (
        <div className={`p-6 rounded-2xl border border-gray-800 bg-gradient-to-br ${gradient} backdrop-blur-sm`}>
            <div className="p-3 bg-gray-900/50 w-fit rounded-lg mb-4 text-white">
                <Icon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-[var(--color-text-secondary)] text-sm">{desc}</p>
        </div>
    )
}
