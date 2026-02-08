"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, User, Code2, Briefcase, Target, ShieldCheck } from "lucide-react"
import { db } from "@/lib/db"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/auth-provider"

const ROLES = ["Software Engineer", "Product Manager", "Designer", "Founder", "Student", "Researcher", "Creative", "Other"]
const LEVELS = ["Junior (L1/L2)", "Mid-Level (L3/L4)", "Senior (L5+)", "Staff/Principal", "Intern/Student"]

const SUGGESTED_GOALS = [
    "Secure a Senior Role at a Top-Tier Tech Company",
    "Launch and Scale a Profitable SaaS Product",
    "Master a New Domain (e.g., GenAI, Systems)",
    "Transition from IC to Engineering Management",
    "Build a Top 1% Design/Engineering Portfolio"
]

export default function OnboardingPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [step, setStep] = React.useState(1)
    const [formData, setFormData] = React.useState({
        username: "",
        role: "",
        level: "",
        goal: ""
    })

    const handleSubmit = async () => {
        // Save to DB
        const existingSettings = await db.settings.orderBy('id').first()
        if (existingSettings) {
            await db.settings.update(existingSettings.id!, {
                username: formData.username,
                role: formData.role,
                level: formData.level, // We'll map this string to a simpler level in DB if strictly typed, but let's assume loose for now or DB update
                execution_score: 0,
                streak: 0
            })
        } else {
            await db.settings.add({
                username: formData.username,
                role: formData.role,
                level: formData.level,
                theme: 'light',
                streak: 0,
                execution_score: 0,
                deep_work_mode: false
            })
        }

        // "Login"
        login()
    }

    const nextStep = () => {
        if (step < 3) setStep(step + 1)
        else handleSubmit()
    }

    const canProceed = () => {
        if (step === 1 && formData.username.trim().length > 1) return true
        if (step === 2 && formData.role && formData.level) return true
        if (step === 3 && formData.goal.trim().length > 3) return true
        return false
    }

    return (
        <main className="min-h-screen bg-[#E0F2E9] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="mb-8 text-center">
                    <div className="inline-block bg-black text-white px-4 py-1 font-mono font-bold text-sm mb-4 border-2 border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                        STEP {step} OF 3
                    </div>
                    <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-[#00C2FF]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="neo-card bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="w-16 h-16 bg-[#FFD600] border-2 border-black rounded-full flex items-center justify-center mb-4">
                                    <User size={32} />
                                </div>
                                <h1 className="text-4xl font-black uppercase">Identify Yourself</h1>
                                <p className="text-xl font-mono text-gray-600">What is your callsign, operator?</p>
                                <input
                                    autoFocus
                                    placeholder="e.g. Neo, Dev1, V"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full text-2xl font-bold bg-gray-50 border-b-4 border-black p-4 outline-none focus:bg-[#E0F2E9] transition-colors"
                                />
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="w-16 h-16 bg-[#00FF94] border-2 border-black rounded-full flex items-center justify-center mb-4">
                                    <ShieldCheck size={32} />
                                </div>
                                <h1 className="text-4xl font-black uppercase">Select Class</h1>
                                <p className="text-xl font-mono text-gray-600">Define your specialization and rank.</p>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        {ROLES.map(r => (
                                            <button
                                                key={r}
                                                onClick={() => setFormData({ ...formData, role: r })}
                                                className={cn(
                                                    "p-3 border-2 border-black font-bold text-left transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                                                    formData.role === r ? "bg-black text-white" : "bg-white"
                                                )}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                    <select
                                        value={formData.level}
                                        onChange={e => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full p-4 border-2 border-black font-bold bg-white text-lg outline-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select Rank Level</option>
                                        {LEVELS.map(l => (
                                            <option key={l} value={l}>{l}</option>
                                        ))}
                                    </select>
                                </div>
                            </motion.div>
                        )}



                        // ... inside OnboardingPage component, Step 3 ...

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="w-16 h-16 bg-[#FF5C00] border-2 border-black rounded-full flex items-center justify-center mb-4">
                                    <Target size={32} />
                                </div>
                                <h1 className="text-4xl font-black uppercase">Prime Directive</h1>
                                <p className="text-xl font-mono text-gray-600">What is your main professional goal right now?</p>

                                {/* Quick Selection Chips */}
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTED_GOALS.map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => setFormData({ ...formData, goal: g })}
                                            className="px-3 py-1.5 text-sm font-bold border-2 border-black bg-white hover:bg-[#FFD600] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none"
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    autoFocus
                                    placeholder="e.g. Launching my startup, Getting promoted to Senior..."
                                    value={formData.goal}
                                    onChange={e => setFormData({ ...formData, goal: e.target.value })}
                                    className="w-full h-32 text-xl font-bold bg-gray-50 border-2 border-black p-4 outline-none focus:bg-[#E0F2E9] transition-colors resize-none"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className="bg-black text-white px-8 py-4 font-black text-xl uppercase flex items-center gap-2 border-2 border-transparent hover:bg-[#00C2FF] hover:text-black hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none"
                        >
                            {step === 3 ? "Initialize System" : "Next Phase"} <ArrowRight size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
