"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Brain, Code2, Rocket, Terminal, Trophy, Zap, Cpu, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/auth-provider"
import { db } from "@/lib/db"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function LandingPage() {
    const { scrollYProgress } = useScroll()
    const { login } = useAuth()
    const router = useRouter()
    const y = useTransform(scrollYProgress, [0, 1], [0, -50])

    const handleStart = async () => {
        // Check if user is authenticated via Supabase
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
            router.push("/dashboard")
        } else {
            router.push("/auth") // Redirect to new Auth page
        }
    }

    return (
        <main className="min-h-screen bg-[#E0F2E9] text-black overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-white/80 backdrop-blur-md border-b-4 border-black">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-black text-xl">D</div>
                    <span className="font-black text-xl tracking-tighter">DEEP MIND</span>
                </div>
                <button
                    onClick={handleStart}
                    className="px-6 py-2 bg-[#FF5C00] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
                >
                    ENTER CONSOLE <ArrowRight size={18} strokeWidth={3} />
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 min-h-screen flex flex-col justify-center items-center">
                <div className="absolute inset-0 grid grid-cols-[40px_40px] opacity-10 pointer-events-none">
                    {Array.from({ length: 100 }).map((_, i) => (
                        <div key={i} className="border-r border-b border-black h-10 w-10" />
                    ))}
                </div>

                <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="text-left space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-block bg-[#00FF94] border-2 border-black px-4 py-1 font-mono font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                            SYSTEM STATUS: ONLINE
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter"
                        >
                            SCALE YOUR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] to-[#9D00FF] [-webkit-text-stroke:3px_black]">CAREER</span> <br />
                            VELOCITY
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl font-mono font-bold text-gray-700 max-w-md border-l-4 border-black pl-4"
                        >
                            The operating system for elite professionals. Track deep work, visualize skill stacks, and execute with precision.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <button onClick={handleStart} className="group relative px-8 py-4 bg-black text-white font-bold text-xl border-2 border-black shadow-[8px_8px_0px_0px_#00FF94] hover:shadow-[12px_12px_0px_0px_#00FF94] hover:-translate-y-1 transition-all">
                                <span className="flex items-center gap-2">
                                    <Terminal size={24} /> INITIALIZE
                                </span>
                            </button>
                            <Link href="#features" className="px-8 py-4 bg-white text-black font-bold text-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                                VIEW DOCS
                            </Link>
                        </motion.div>
                    </div>

                    {/* 3D Visual Element */}
                    <div className="relative h-[500px] w-full hidden lg:block perspective-1000">
                        <motion.div
                            style={{ y }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="relative w-80 h-96 bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-y-12 rotate-x-6 transform-style-3d group hover:rotate-y-0 transition-transform duration-500">
                                <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#FFD600] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full flex items-center justify-center z-20 animate-bounce">
                                    <Zap size={32} strokeWidth={3} />
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="h-4 w-1/3 bg-black/10 rounded"></div>
                                    <div className="h-32 bg-[#00C2FF]/20 border-2 border-black border-dashed flex items-center justify-center">
                                        <Brain size={48} className="text-black opacity-50" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-black"></div>
                                        <div className="h-4 w-5/6 bg-black/80"></div>
                                        <div className="h-4 w-4/6 bg-black/60"></div>
                                    </div>
                                    <div className="flex gap-2 mt-8">
                                        <div className="w-8 h-8 bg-[#FF5C00] border-2 border-black rounded-full"></div>
                                        <div className="w-8 h-8 bg-[#00FF94] border-2 border-black rounded-full"></div>
                                        <div className="w-8 h-8 bg-[#9D00FF] border-2 border-black rounded-full"></div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -left-12 bottom-20 bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_#FF00FF] z-30 transform -rotate-6 group-hover:rotate-0 transition-transform">
                                    <div className="font-mono font-bold text-sm">STREAK: 12 DAYS</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 px-4 bg-white border-t-4 border-black">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">Core Modules</h2>
                        <div className="h-2 w-32 bg-black mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Feature3D
                            icon={Brain}
                            title="Skill Matrix"
                            desc="Visualize your tech stack growth. Level up from Novice to Architect with evidence-based tracking."
                            color="bg-[#00C2FF]"
                        />
                        <Feature3D
                            icon={Layers}
                            title="Placement Ops"
                            desc="Kanban-style application tracker. Manage targets, interviews, and offers in one mission control."
                            color="bg-[#FFD600]"
                        />
                        <Feature3D
                            icon={Rocket}
                            title="Project Lab"
                            desc="Ship projects that matter. Document your build process and generate case studies automatically."
                            color="bg-[#FF5C00]"
                        />
                    </div>
                </div>
            </section>

            {/* Marquee Section */}
            <div className="bg-[#00FF94] border-y-4 border-black py-4 overflow-hidden">
                <div className="flex gap-8 animate-marquee whitespace-nowrap font-black text-2xl uppercase font-mono">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className="flex items-center gap-4">
                            <Zap fill="black" /> FOCUS DEEPLY <Zap fill="black" /> SCALE IMPACT <Zap fill="black" /> MASTER CRAFT
                        </span>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <section className="py-32 px-4 bg-[#0B0F14] text-white text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <Trophy size={64} className="mx-auto text-[#FFD600]" />
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                        READY TO <br /><span className="text-[#00FF94]">ASCEND?</span>
                    </h2>
                    <p className="text-xl text-gray-400 font-mono">Join the ranks of top 1% performers.</p>
                    <button onClick={handleStart} className="inline-block px-12 py-6 bg-white text-black font-black text-2xl border-4 border-transparent hover:bg-[#FFD600] transition-colors shadow-[0px_0px_20px_rgba(255,255,255,0.2)]">
                        START MISSION
                    </button>
                </div>
            </section>
        </main>
    )
}

function Feature3D({ icon: Icon, title, desc, color }: any) {
    return (
        <div className="group h-full">
            <div className={cn(
                "h-full p-8 border-4 border-black bg-white transition-all duration-300",
                "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
                "group-hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]",
                "group-hover:-translate-y-2"
            )}>
                <div className={cn("w-16 h-16 border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]", color)}>
                    <Icon size={32} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black uppercase mb-4">{title}</h3>
                <p className="font-mono font-bold text-gray-600 border-l-2 border-black pl-4">{desc}</p>
            </div>
        </div>
    )
}
