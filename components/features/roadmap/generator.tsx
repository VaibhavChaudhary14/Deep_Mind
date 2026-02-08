"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, Wand2 } from "lucide-react"
import { db } from "@/lib/db"

interface RoadmapGeneratorProps {
    isOpen: boolean
    onClose: () => void
}

export function RoadmapGenerator({ isOpen, onClose }: RoadmapGeneratorProps) {
    const [prompt, setPrompt] = React.useState('')
    const [isGenerating, setIsGenerating] = React.useState(false)

    const handleGenerate = async () => {
        setIsGenerating(true)

        // Heuristic Parser Logic
        const lines = prompt.split('\n').filter(l => l.trim().length > 0)
        const newWeeks = []

        let currentWeek = { week: 0, focus_theme: '', skills_gained: [], projects_planned: [], status: 'Planned' }
        let weekCounter = 1

        // Simple parsing strategy:
        // 1. Look for "Week X:" lines
        // 2. Or just treat every line as a week if no prefixes found

        const hasWeekPrefix = lines.some(l => l.toLowerCase().startsWith('week'))

        if (hasWeekPrefix) {
            for (const line of lines) {
                if (line.toLowerCase().startsWith('week')) {
                    // Save previous if exists
                    if (currentWeek.week > 0) {
                        newWeeks.push({ ...currentWeek })
                    }

                    // Start new
                    const parts = line.split(':')
                    const weekNumMatch = line.match(/\d+/)
                    const weekNum = weekNumMatch ? parseInt(weekNumMatch[0]) : weekCounter++
                    const theme = parts[1] ? parts[1].trim() : line.replace(/Week \d+[:]?/i, '').trim()

                    currentWeek = {
                        week: weekNum,
                        focus_theme: theme,
                        skills_gained: [],
                        projects_planned: [],
                        status: 'Planned'
                    }
                } else if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                    // Bullet point -> Skill or Project
                    const content = line.replace(/[-•]/, '').trim()
                    if (content.toLowerCase().includes('project') || content.toLowerCase().includes('build')) {
                        (currentWeek.projects_planned as string[]).push(content)
                    } else {
                        (currentWeek.skills_gained as string[]).push(content)
                    }
                }
            }
            // Push last
            if (currentWeek.week > 0) newWeeks.push({ ...currentWeek })
        } else {
            // Simple list mode
            const startWeek = (await db.roadmap.count()) + 1
            newWeeks.push(...lines.map((line, i) => ({
                week: startWeek + i,
                focus_theme: line.trim(),
                skills_gained: [],
                projects_planned: [],
                status: 'Planned'
            })))
        }

        // Persist
        if (newWeeks.length > 0) {
            await db.roadmap.bulkAdd(newWeeks as any)
        }

        setTimeout(() => {
            setIsGenerating(false)
            setPrompt('')
            onClose()
        }, 800) // Fake delay for effect
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="w-full max-w-lg bg-[#0B0F14] border border-gray-800 rounded-2xl p-6 relative"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Sparkles className="text-purple-400" />
                                AI Plan Generator
                            </h3>
                            <button onClick={onClose}><X size={20} /></button>
                        </div>

                        <div className="mb-4 text-sm text-[var(--color-text-secondary)]">
                            <p className="mb-2">Paste your learning plan or type a list of topics. The AI will structure it into weeks.</p>
                            <div className="bg-gray-900 p-2 rounded border border-gray-800 font-mono text-xs text-gray-500">
                                Week 1: Advanced React Patterns<br />
                                - Learn UseEffect deep dive<br />
                                - Build Custom Hooks<br />
                                Week 2: Backend with Go<br />
                                - Goroutines basics
                            </div>
                        </div>

                        <textarea
                            className="w-full h-40 bg-[var(--color-bg-secondary)] border border-gray-700 rounded-xl p-4 font-mono text-sm focus:border-purple-500 focus:outline-none transition-colors"
                            placeholder="Paste your plan here..."
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                        />

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt.trim()}
                            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? <span className="animate-spin">⏳</span> : <Wand2 size={20} />}
                            Generate Roadmap
                        </button>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
