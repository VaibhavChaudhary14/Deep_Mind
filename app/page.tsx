"use client"

import React from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Brain, Code2, Rocket, Terminal, Trophy, Zap, Cpu, Layers, Check, X, ChevronDown, Github, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function SaaSLandingPage() {
    const { scrollYProgress } = useScroll()
    const router = useRouter()

    // Parallax effect for the hero 3D grid
    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100])

    const handleStart = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
            router.push("/dashboard")
        } else {
            router.push("/auth")
        }
    }

    return (
        <main className="min-h-screen bg-[#FBF9F1] text-black overflow-x-hidden selection:bg-[#00FF94] selection:text-black font-mono">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-3 md:px-8 md:py-4 bg-[#FBF9F1] border-b-4 border-black">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF5C00] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-white font-black text-2xl">
                        D
                    </div>
                    <span className="font-black text-2xl tracking-tighter uppercase hidden sm:block">Deep Mind</span>
                </div>

                <div className="hidden md:flex gap-8 font-bold uppercase text-sm items-center">
                    <Link href="#features" className="hover:text-[#FF5C00] hover:-translate-y-1 transition-transform">Features</Link>
                    <Link href="#pricing" className="hover:text-[#FF5C00] hover:-translate-y-1 transition-transform">Pricing</Link>
                    <Link href="#opensource" className="hover:text-[#FF5C00] hover:-translate-y-1 transition-transform">Open Source</Link>
                    <Link href="#faq" className="hover:text-[#FF5C00] hover:-translate-y-1 transition-transform">FAQ</Link>
                    <Link href="https://github.com/VaibhavChaudhary14/Deep_Mind" target="_blank" className="flex items-center gap-2 hover:text-[#00FF94] hover:-translate-y-1 transition-transform bg-black text-white px-3 py-1 border-2 border-black">
                        <Github size={16} /> GitHub
                    </Link>
                </div>

                <div className="flex gap-4">
                    <button onClick={handleStart} className="hidden md:block px-6 py-2 bg-white border-2 border-black font-bold uppercase text-sm shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                        Login
                    </button>
                    <button onClick={handleStart} className="px-6 py-2 bg-[#00FF94] border-2 border-black font-black uppercase text-sm shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
                        Get Started <ArrowRight size={18} strokeWidth={3} />
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 min-h-screen flex flex-col justify-center overflow-hidden border-b-4 border-black bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:24px_24px]">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                    {/* Left Copy */}
                    <div className="space-y-8 text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="inline-flex items-center gap-2 bg-[#FFD600] border-2 border-black px-4 py-2 font-black text-sm uppercase shadow-[4px_4px_0px_#000]"
                        >
                            <Zap size={16} fill="black" />
                            V2 Acceleration Engine Live
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter uppercase"
                        >
                            Master Any <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] via-[#9D00FF] to-[#FF00FF] [-webkit-text-stroke:2px_black] drop-shadow-[4px_4px_0px_#000]">
                                Tech Stack
                            </span><br />
                            In 90 Days.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl md:text-2xl font-bold text-gray-800 max-w-lg leading-snug border-l-8 border-black pl-4"
                        >
                            Stop watching tutorials. Start building momentum. Deep Mind generates a brutal 90-day learning protocol tailored to your exact target role.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-6 pt-4"
                        >
                            <button onClick={handleStart} className="px-8 py-5 bg-black text-[#00FF94] font-black text-xl md:text-2xl uppercase border-4 border-black shadow-[8px_8px_0px_#00FF94] hover:shadow-[12px_12px_0px_#FFD600] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
                                <Rocket size={28} /> Deploy Sprint
                            </button>
                            <p className="flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-gray-600 uppercase">
                                <Check size={16} className="text-black" /> 100% Free Forever.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right 3D CSS Isometric Composition */}
                    <motion.div
                        style={{ y: heroY }}
                        className="relative h-[500px] w-full hidden lg:block perspective-1000"
                    >
                        <div className="absolute inset-0 flex items-center justify-center transform-style-3d rotate-x-[20deg] rotate-y-[-25deg] rotate-z-[5deg] group hover:rotate-x-[15deg] hover:rotate-y-[-15deg] transition-all duration-700 ease-out">

                            {/* Layer 1: The AI Protocol Modal */}
                            <motion.div
                                initial={{ opacity: 0, z: -100 }}
                                animate={{ opacity: 1, z: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="absolute bg-[#FBF9F1] border-4 border-black shadow-[16px_16px_0px_#FF00FF] p-6 w-[350px] transform -translate-x-12 -translate-y-24 translate-z-[50px]"
                            >
                                <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
                                    <h3 className="font-black text-lg uppercase">Strategic AI</h3>
                                    <Brain size={20} />
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3 bg-black/10 rounded w-full"></div>
                                    <div className="h-3 bg-black/10 rounded w-5/6"></div>
                                    <div className="h-12 bg-[#FFD600] border-2 border-black mt-4 flex items-center justify-center">
                                        <span className="font-black text-xs uppercase">Target: Full Stack Dev</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="h-8 bg-[#00FF94] border-2 border-black"></div>
                                        <div className="h-8 bg-black"></div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Layer 2: The Core Kanban Dashboard */}
                            <motion.div
                                initial={{ opacity: 0, z: 0 }}
                                animate={{ opacity: 1, z: 50 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="absolute bg-white border-4 border-black shadow-[24px_24px_0px_rgba(0,0,0,1)] p-6 w-[450px] transform translate-x-12 translate-y-12 translate-z-[120px]"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[#00C2FF] border-2 border-black"></div>
                                        <div>
                                            <div className="font-black text-sm uppercase">Sprint: Day 14</div>
                                            <div className="w-24 h-2 bg-black/20 rounded mt-1 overflow-hidden">
                                                <div className="w-1/3 h-full bg-[#FF5C00]"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-[#0B0F14] text-[#00FF94] px-3 py-1 font-black text-xs border-2 border-black">
                                        SCORE: 92%
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {/* Todo Column Mock */}
                                    <div className="space-y-2">
                                        <div className="font-bold text-xs uppercase mb-2 border-b-2 border-black pb-1">To Do</div>
                                        <div className="bg-[#E0F2E9] border-2 border-black p-2 h-16 shadow-[2px_2px_0px_#000]"></div>
                                        <div className="bg-[#E0F2E9] border-2 border-black p-2 h-12 shadow-[2px_2px_0px_#000]"></div>
                                    </div>
                                    {/* In Progress Mock */}
                                    <div className="space-y-2">
                                        <div className="font-bold text-xs uppercase mb-2 border-b-2 border-black pb-1">Executing</div>
                                        <div className="bg-[#FFD600] border-2 border-black p-2 h-20 shadow-[2px_2px_0px_#000] relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-4 h-4 bg-black"></div>
                                        </div>
                                    </div>
                                    {/* Done Mock */}
                                    <div className="space-y-2">
                                        <div className="font-bold text-xs uppercase mb-2 border-b-2 border-black pb-1">Done</div>
                                        <div className="bg-black border-2 border-black p-2 h-16 shadow-[2px_2px_0px_#00FF94]">
                                            <Check size={16} className="text-[#00FF94]" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Accessories */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="absolute -top-12 right-12 w-16 h-16 bg-[#00FF94] border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_#000] translate-z-[150px]"
                            >
                                <Zap size={24} fill="black" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-[-40px] left-[-20px] bg-white border-4 border-black p-3 shadow-[6px_6px_0px_#FF5C00] translate-z-[80px]"
                            >
                                <div className="font-black text-xs uppercase">🔥 14 Day Streak!</div>
                            </motion.div>

                        </div>
                    </motion.div>

                </div>
            </section>

            {/* MARQUEE */}
            <div className="bg-black py-4 overflow-hidden border-b-4 border-black">
                <div className="flex gap-8 animate-marquee whitespace-nowrap font-black text-xl uppercase font-mono text-[#00FF94]">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <span key={i} className="flex items-center gap-6">
                            TRUSTED BY DEVELOPERS LEARNING:
                            <span className="text-white border-2 border-[#00FF94] px-3 py-1 bg-[#1A1A1A]">REACT</span>
                            <span className="text-white border-2 border-[#00FF94] px-3 py-1 bg-[#1A1A1A]">NODE.JS</span>
                            <span className="text-white border-2 border-[#00FF94] px-3 py-1 bg-[#1A1A1A]">PYTHON</span>
                            <span className="text-white border-2 border-[#00FF94] px-3 py-1 bg-[#1A1A1A]">AWS</span>
                            <span className="text-white border-2 border-[#00FF94] px-3 py-1 bg-[#1A1A1A]">RUST</span>
                            <span className="text-[#00FF94]">◆</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* HOW IT WORKS / FEATURES DEEP DIVE */}
            <section id="features" className="py-24 px-4 bg-white border-b-4 border-black">
                <div className="max-w-6xl mx-auto space-y-24">

                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <div className="inline-block bg-[#00C2FF] border-2 border-black px-4 py-1 font-black text-sm uppercase shadow-[4px_4px_0px_#000] mb-4">
                            System Architecture
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">How to Hack <br />Your Career Arc</h2>
                        <p className="text-xl font-bold text-gray-600">Deep Mind isn't a course. It's an execution engine that forces you to learn by building, daily.</p>
                    </div>

                    {/* Step 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative aspect-square md:aspect-auto md:h-[400px] bg-[#E0F2E9] border-4 border-black shadow-[16px_16px_0px_#000] p-8 flex flex-col justify-between overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF94] rounded-bl-full border-b-4 border-l-4 border-black z-0"></div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-12 h-12 bg-white border-4 border-black rounded-full flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_#000]">1</div>
                                <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] transform -rotate-2">
                                    <div className="font-bold border-b-2 border-black pb-2 mb-2">Q: Target Role?</div>
                                    <div className="bg-black text-[#00FF94] px-2 py-1 font-mono text-sm inline-block">A: Senior Backend Engineer</div>
                                </div>
                                <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] transform rotate-1 ml-8">
                                    <div className="font-bold border-b-2 border-black pb-2 mb-2">Q: Tech Stack?</div>
                                    <div className="bg-black text-[#00FF94] px-2 py-1 font-mono text-sm inline-block">A: Go, PostgreSQL, Redis</div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <h3 className="text-4xl font-black uppercase">Diagnose Your Needs</h3>
                            <p className="text-xl font-bold text-gray-600">The 4-stage AI Diagnostic assesses your exact target role, current skill level, and daily time capacity to generate a hyper-personalized roadmap.</p>
                            <ul className="space-y-3 font-bold">
                                <li className="flex gap-3 items-center"><Check size={20} className="text-[#FF5C00]" /> No generic tutorial roadmaps.</li>
                                <li className="flex gap-3 items-center"><Check size={20} className="text-[#FF5C00]" /> Focuses on building, not just reading.</li>
                                <li className="flex gap-3 items-center"><Check size={20} className="text-[#FF5C00]" /> Powered by Gemini 2.5 Flash.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h3 className="text-4xl font-black uppercase">The 90-Day Sprint</h3>
                            <p className="text-xl font-bold text-gray-600">Once generated, your entire curriculum is locked into a 90-Day Sprint Kanban board. Shift your focus purely to execution.</p>
                            <ul className="space-y-3 font-bold">
                                <li className="flex gap-3 items-center"><Check size={20} className="text-[#00C2FF]" /> Dedicated daily execution reader.</li>
                                <li className="flex gap-3 items-center"><Check size={20} className="text-[#00C2FF]" /> Track time spent on deep work.</li>
                                <li className="flex gap-3 items-center"><Check size={20} className="text-[#00C2FF]" /> Instant state persistence (Local-First).</li>
                            </ul>
                        </div>
                        <div className="relative aspect-square md:aspect-auto md:h-[400px] bg-[#0B0F14] border-4 border-black shadow-[16px_16px_0px_#00C2FF] p-8 overflow-hidden group">
                            {/* Decorative Grid */}
                            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20">
                                {Array.from({ length: 36 }).map((_, i) => <div key={i} className="border border-gray-600"></div>)}
                            </div>
                            <div className="relative z-10 flex h-full">
                                <div className="w-full bg-white border-4 border-black p-4 flex flex-col gap-3 transform group-hover:scale-105 transition-transform duration-500">
                                    <div className="h-8 border-b-4 border-black flex justify-between items-center pb-2">
                                        <div className="font-black uppercase">Day 4: API Design</div>
                                        <div className="bg-[#FFD600] px-2 border-2 border-black font-black text-xs">IN PROGRESS</div>
                                    </div>
                                    <div className="flex-1 bg-gray-100 border-2 border-black border-dashed flex items-center justify-center p-4 text-center font-bold text-gray-400">
                                        Action: Build a RESTful endpoint in Go mapping to the user schema.
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 py-2 bg-black text-white text-center font-black uppercase text-sm border-2 border-black">Mark Done</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* THE PRICING SECTION (ANTI-PRICING) */}
            <section id="pricing" className="py-24 px-4 bg-[#FFD600] border-b-4 border-black">
                <div className="max-w-5xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Unlimited Access.<br /><span className="text-white [-webkit-text-stroke:2px_black] drop-shadow-[4px_4px_0px_#000]">Zero Cost.</span></h2>
                        <p className="text-xl font-bold bg-white inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000]">Stop paying $99/mo for generic coding bootcamps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                        {/* The Loser Tier */}
                        <div className="bg-white/50 border-4 border-black p-8 blur-[1px] opacity-70 grayscale">
                            <h3 className="text-2xl font-black uppercase mb-2">Traditional Bootcamps</h3>
                            <div className="text-4xl font-black mb-6 border-b-4 border-black pb-4">$9,999<span className="text-xl text-gray-500">/avg</span></div>
                            <ul className="space-y-4 font-bold text-gray-600">
                                <li className="flex gap-3"><X size={24} className="text-red-500" /> One-size-fits-all curriculum</li>
                                <li className="flex gap-3"><X size={24} className="text-red-500" /> Wastes time on basics</li>
                                <li className="flex gap-3"><X size={24} className="text-red-500" /> No daily friction tracking</li>
                            </ul>
                        </div>

                        {/* The Gigachad Tier */}
                        <div className="bg-white border-4 border-black p-8 shadow-[16px_16px_0px_#000] relative transform md:-translate-y-8">
                            <div className="absolute -top-5 right-4 bg-[#FF5C00] text-white font-black px-4 py-1 border-2 border-black shadow-[4px_4px_0px_#000] transform rotate-3">
                                YOUR PLAN
                            </div>
                            <h3 className="text-3xl font-black uppercase mb-2 text-[#00C2FF]">The Engine</h3>
                            <div className="text-6xl font-black mb-6 border-b-4 border-black pb-4">$0<span className="text-xl text-gray-500">/forever</span></div>
                            <ul className="space-y-4 font-bold text-lg">
                                <li className="flex gap-3 items-center"><Check size={24} className="text-[#00FF94] stroke-[4]" /> Custom AI 90-Day Roadmaps</li>
                                <li className="flex gap-3 items-center"><Check size={24} className="text-[#00FF94] stroke-[4]" /> Daily Execution Board</li>
                                <li className="flex gap-3 items-center"><Check size={24} className="text-[#00FF94] stroke-[4]" /> Acceleration Score Engine</li>
                                <li className="flex gap-3 items-center"><Check size={24} className="text-[#00FF94] stroke-[4]" /> Private, Local-First Data</li>
                            </ul>
                            <button onClick={handleStart} className="w-full mt-8 py-4 bg-black text-white font-black text-xl hover:bg-[#00FF94] hover:text-black hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] border-4 border-black transition-all">
                                GET STARTED FREE
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* OPEN SOURCE / PARTNERSHIP SECTION */}
            <section id="opensource" className="py-24 px-4 bg-white border-b-4 border-black relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 grid grid-cols-[100px_100px] opacity-5 pointer-events-none">
                    {Array.from({ length: 150 }).map((_, i) => (
                        <div key={i} className="border-r border-b border-black h-24 w-24" />
                    ))}
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">

                    {/* Github Card */}
                    <div className="bg-[#0B0F14] text-white border-4 border-black p-8 shadow-[12px_12px_0px_#FFD600] flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <Github size={48} className="text-[#00FF94]" />
                                <h3 className="text-4xl font-black uppercase">Open Source</h3>
                            </div>
                            <p className="font-bold text-gray-400 text-lg mb-8">
                                Deep Mind is 100% open source. Check out the code, fork the repository, or show off your creativity by contributing new modules to the Acceleration Engine.
                            </p>
                        </div>
                        <Link
                            href="https://github.com/VaibhavChaudhary14/Deep_Mind"
                            target="_blank"
                            className="inline-flex items-center justify-between bg-white text-black px-6 py-4 font-black border-4 border-transparent hover:bg-[#00FF94] transition-colors"
                        >
                            <span className="uppercase text-xl">View Repository</span>
                            <ArrowRight size={24} />
                        </Link>
                    </div>

                    {/* Partnership Card */}
                    <div className="bg-[#FF5C00] text-black border-4 border-black p-8 shadow-[12px_12px_0px_#0B0F14] flex flex-col justify-between transform md:translate-y-8">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <Users size={48} />
                                <h3 className="text-4xl font-black uppercase">Looking For Partner</h3>
                            </div>
                            <p className="font-bold text-black border-l-4 border-black pl-4 text-lg mb-8">
                                This engine was built to solve a personal pain point, but the vision is massive.
                                <br /><br />
                                I want to build Deep Mind into a full-scale commercial product. I am actively looking for a Co-Founder / Partner to help scale this to the masses.
                            </p>
                        </div>
                        <Link
                            href="https://www.linkedin.com/in/vaibhavchaudhary14/"
                            target="_blank"
                            className="inline-flex items-center justify-between bg-black text-white px-6 py-4 font-black border-4 border-transparent hover:bg-white hover:text-black hover:border-black transition-all w-full text-left"
                        >
                            <span className="uppercase text-xl">Let's Build Together</span>
                            <ArrowRight size={24} />
                        </Link>
                    </div>

                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-24 px-4 bg-[#FBF9F1] border-b-4 border-black">
                <div className="max-w-3xl mx-auto space-y-12">
                    <h2 className="text-5xl font-black uppercase tracking-tighter text-center">Protocol FAQ</h2>
                    <div className="space-y-4">
                        <FaqItem
                            q="Why 90 days?"
                            a="12 weeks is the optimal psychological window. It's long enough to achieve mastery in a new stack (e.g., learning Next.js and Postgres), but short enough to maintain daily urgency without burning out."
                        />
                        <FaqItem
                            q="Is my plan data synchronized to the cloud?"
                            a="We use a Local-First architecture via Dexie/IndexedDB for maximum speed. Your executing tasks and AI generated roadmaps live safely in your browser, enabling instant offline access."
                        />
                        <FaqItem
                            q="Are there hidden fees later?"
                            a="No. V2 is completely open. If we ever release a V3 with cloud synchronization, serverless edge deployments, or 1-on-1 human coaching, that may be a premium tier, but the core engine remains free."
                        />
                    </div>
                </div>
            </section>

            {/* FINAL CTA & FOOTER */}
            <section className="bg-black text-white pt-32 pb-12 px-4 border-t-8 border-[#00FF94]">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <Terminal size={80} className="mx-auto text-[#FFD600]" />
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                        End The <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD600] to-[#FF5C00]">Tutorial Hell.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 font-mono uppercase font-bold max-w-2xl mx-auto">
                        You don't need another Udemy course. You need a structured, brutal execution environment.
                    </p>
                    <button onClick={handleStart} className="mt-8 inline-block px-12 py-6 bg-white text-black font-black text-2xl uppercase border-4 border-transparent hover:bg-[#00C2FF] transition-colors shadow-[8px_8px_0px_#00FF94] hover:translate-y-[-4px]">
                        OPEN TERMINAL
                    </button>
                </div>

                <div className="max-w-7xl mx-auto mt-32 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 font-bold text-sm">
                    <div>© 2026 Deep Mind Systems. All Rights Reserved.</div>
                    <div className="flex gap-6">
                        <Link href="https://twitter.com" className="hover:text-white uppercase transition-colors">Twitter // X</Link>
                        <Link href="https://github.com/VaibhavChaudhary14/Deep_Mind" target="_blank" className="hover:text-white uppercase transition-colors">GitHub</Link>
                        <Link href="#opensource" className="hover:text-white uppercase transition-colors">Partnership</Link>
                    </div>
                </div>
            </section>
        </main>
    )
}

function FaqItem({ q, a }: { q: string, a: string }) {
    const [open, setOpen] = React.useState(false)
    return (
        <div className="border-4 border-black bg-white overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left p-6 font-black text-xl uppercase flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
                {q}
                <ChevronDown size={24} className={cn("transition-transform duration-300", open && "rotate-180")} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6"
                    >
                        <p className="font-bold text-gray-600 font-mono pt-4 border-t-2 border-black border-dashed">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
