
"use client"

import { motion } from "framer-motion"
import { Sparkles, Mail, Bot, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ResumeArchitect } from "@/components/features/resume-architect"
import { ColdEmailGenerator } from "@/components/features/cold-email-gen"
import { MockInterviewBot } from "@/components/features/interview-bot"

export default function AIPage() {
    return (
        <main className="min-h-screen bg-[#E0F2E9] p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Career Connect</h1>
                    </div>
                    <div className="bg-[#00C2FF] border-2 border-black px-4 py-1 font-mono font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        AI MODEL: GEMINI PRO
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Column 1: Generators */}
                    <div className="space-y-8">
                        <ResumeArchitect />
                        <ColdEmailGenerator />
                    </div>

                    {/* Column 2: Interactive Bot */}
                    <div className="lg:h-full">
                        <MockInterviewBot />
                    </div>
                </div>
            </div>
        </main>
    )
}
