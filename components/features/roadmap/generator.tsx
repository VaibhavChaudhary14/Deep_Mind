"use client"

import * as React from "react"
import { AnimatePresence } from "framer-motion"
import { Wand2 } from "lucide-react"
import { db } from "@/lib/db"
import { Modal } from "@/components/ui/modal"

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
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    title="AI Plan Generator"
                    headerColor="bg-purple-400"
                >
                    <div className="mb-4 text-sm text-gray-500">
                        <p className="mb-2">Paste your learning plan or type a list of topics. The AI will structure it into weeks.</p>
                        <div className="bg-gray-100 p-2 rounded border border-gray-200 font-mono text-xs text-gray-500">
                            Week 1: Advanced React Patterns<br />
                            - Learn UseEffect deep dive<br />
                            - Build Custom Hooks<br />
                            Week 2: Backend with Go<br />
                            - Goroutines basics
                        </div>
                    </div>

                    <textarea
                        className="w-full h-40 bg-white border-2 border-black p-4 font-mono text-sm focus:bg-[#E0F2E9] focus:outline-none transition-colors mb-4"
                        placeholder="Paste your plan here..."
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                    />

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className="w-full bg-black text-white font-bold py-3 uppercase font-mono flex items-center justify-center gap-2 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#00FF94] hover:text-black border-2 border-transparent hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? <span className="animate-spin">⏳</span> : <Wand2 size={20} />}
                        Generate Roadmap
                    </button>
                </Modal>
            )}
        </AnimatePresence>
    )
}
