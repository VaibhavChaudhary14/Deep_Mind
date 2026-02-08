
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle, Coffee, Brain } from "lucide-react"
import { useDeepWork } from "@/components/providers/deep-work-provider"
import { cn } from "@/lib/utils"
import { useXP } from "@/store/use-xp"
import { XP_VALUES } from "@/lib/gamification"
// import useSound from 'use-sound' // Future scope

interface TimerProps {
    defaultFocusMinutes?: number
    isLapMode?: boolean
}

export function DeepWorkTimer({ defaultFocusMinutes = 25, isLapMode = false }: TimerProps) {
    const MODES = {
        focus: { label: "Deep Work", minutes: defaultFocusMinutes, color: "text-[#00C2FF]", icon: Brain },
        shortBreak: { label: "Short Break", minutes: 5, color: "text-[#00FF94]", icon: Coffee },
        longBreak: { label: "Long Break", minutes: 15, color: "text-[#FFD600]", icon: Coffee },
    }

    // ... existing state ...
    // Note: We need to initialize state inside, but MODES relies on props. 
    // Wait, useState initializer only runs once. If props change, it won't update.
    // However, for this use case, the component is mounted with static props per page.

    const { isDeepWork, toggleDeepWork } = useDeepWork()
    const [mode, setMode] = React.useState<keyof typeof MODES>("focus")
    const [timeLeft, setTimeLeft] = React.useState(defaultFocusMinutes * 60)
    const [isActive, setIsActive] = React.useState(false)
    const [sessionsCompleted, setSessionsCompleted] = React.useState(0)
    const [laps, setLaps] = React.useState<number[]>([]) // Store lap durations or timestamps? simple count for now.

    // Timer Logic
    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            handleTimerComplete()
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, timeLeft])

    // Sync Deep Work Mode
    React.useEffect(() => {
        if (isActive && mode === "focus" && !isDeepWork) {
            toggleDeepWork()
        } else if (!isActive && isDeepWork) {
            toggleDeepWork() // Exit deep work if paused/stopped
        }
    }, [isActive, mode])

    const handleTimerComplete = () => {
        setIsActive(false)
        if (mode === "focus") {
            const minutesCompleted = MODES[mode].minutes
            const xpEarned = minutesCompleted * XP_VALUES.DEEP_WORK_MINUTE

            // Award XP
            useXP.getState().addXP(xpEarned, "Deep Work Session")
            setSessionsCompleted(prev => prev + 1)

            if (isLapMode) {
                setLaps(prev => [...prev, sessionsCompleted + 1])
            }

            // Auto switch to short break
            setMode("shortBreak")
            setTimeLeft(MODES["shortBreak"].minutes * 60)
        } else {
            // Break over, back to work
            setMode("focus")
            setTimeLeft(MODES["focus"].minutes * 60)
        }
    }

    const toggleTimer = () => setIsActive(!isActive)

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(MODES[mode].minutes * 60)
    }

    const switchMode = (newMode: keyof typeof MODES) => {
        setMode(newMode)
        setTimeLeft(MODES[newMode].minutes * 60)
        setIsActive(false)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const CurrentIcon = MODES[mode].icon

    return (
        <div className="neo-card bg-black text-white p-6 relative overflow-hidden">
            {/* Background Pulse Animation when Active */}
            {isActive && (
                <motion.div
                    className="absolute inset-0 bg-[#00C2FF] opacity-10"
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}

            <div className="relative z-10">
                {/* Header / Mode Switcher */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                        {(Object.keys(MODES) as Array<keyof typeof MODES>).map((m) => (
                            <button
                                key={m}
                                onClick={() => switchMode(m)}
                                className={cn(
                                    "px-2 py-1 text-xs font-bold uppercase border-2",
                                    mode === m ? "bg-white text-black border-white" : "border-gray-700 text-gray-500 hover:border-gray-500"
                                )}
                            >
                                {MODES[m].label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono text-gray-400">
                        <CheckCircle size={14} />
                        <span>{sessionsCompleted} SESSIONS</span>
                    </div>
                </div>

                {/* Timer Display */}
                <div className="text-center py-4">
                    <motion.div
                        key={mode}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn("text-7xl font-black font-mono tracking-tighter tabular-nums", MODES[mode].color)}
                    >
                        {formatTime(timeLeft)}
                    </motion.div>
                    <div className="text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center justify-center gap-2">
                        <CurrentIcon size={16} />
                        {isActive ? "Focusing..." : "Ready"}
                    </div>
                </div>

                {/* Lap Indicators */}
                {isLapMode && laps.length > 0 && (
                    <div className="flex justify-center gap-1 mb-4">
                        {laps.map((lap, i) => (
                            <div key={i} className="w-8 h-2 bg-[#00C2FF] rounded-full" />
                        ))}
                    </div>
                )}

                {/* Controls */}
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={toggleTimer}
                        className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center border-4 border-white transition-all shadow-[0px_0px_20px_rgba(255,255,255,0.2)]",
                            isActive ? "bg-red-500 hover:bg-red-600" : "bg-[#00FF94] text-black hover:scale-110"
                        )}
                    >
                        {isActive ? <Pause size={32} fill="white" /> : <Play size={32} fill="black" className="ml-1" />}
                    </button>

                    <button
                        onClick={resetTimer}
                        className="p-3 rounded-full border-2 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}
