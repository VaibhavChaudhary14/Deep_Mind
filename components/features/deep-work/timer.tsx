"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Coffee } from "lucide-react"
import { useDeepWork } from "@/components/providers/deep-work-provider"
import { cn } from "@/lib/utils"

const FOCUS_TIME = 50 * 60 // 50 minutes
const BREAK_TIME = 10 * 60 // 10 minutes

export function DeepWorkTimer() {
    const { isDeepWork, toggleDeepWork } = useDeepWork()
    const [timeLeft, setTimeLeft] = React.useState(FOCUS_TIME)
    const [isActive, setIsActive] = React.useState(false)
    const [mode, setMode] = React.useState<"focus" | "break">("focus")

    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
            // Play sound here ideally
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, timeLeft])

    const toggleTimer = () => {
        setIsActive(!isActive)
        if (!isDeepWork && mode === "focus") {
            toggleDeepWork() // Auto-enable deep work mode on start
        }
    }

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(mode === "focus" ? FOCUS_TIME : BREAK_TIME)
    }

    const switchMode = () => {
        const newMode = mode === "focus" ? "break" : "focus"
        setMode(newMode)
        setTimeLeft(newMode === "focus" ? FOCUS_TIME : BREAK_TIME)
        setIsActive(false)
        if (newMode === "break" && isDeepWork) {
            toggleDeepWork() // Auto-disable deep work on break
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const progress = ((mode === "focus" ? FOCUS_TIME : BREAK_TIME) - timeLeft) / (mode === "focus" ? FOCUS_TIME : BREAK_TIME) * 100

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8">
            <div className="relative flex items-center justify-center w-64 h-64">
                {/* Progress Circle Background */}
                <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-800"
                    />
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 120}
                        strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                        className={cn(
                            "transition-all duration-1000",
                            mode === "focus" ? "text-[var(--color-ml)]" : "text-[var(--color-python)]"
                        )}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Timer Text */}
                <div className="absolute flex flex-col items-center">
                    <span className="text-6xl font-mono font-bold tracking-tighter">
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-sm uppercase tracking-widest text-[var(--color-text-muted)] mt-2">
                        {mode === "focus" ? "Deep Work" : "Rest & Recharge"}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                <button
                    onClick={resetTimer}
                    className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                    <RotateCcw size={24} strokeWidth={3} />
                </button>

                <button
                    onClick={toggleTimer}
                    className={cn(
                        "p-6 border-4 border-black transition-all transform hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                        isActive
                            ? "bg-[#FF5C00] text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                            : mode === "focus"
                                ? "bg-[#00FF94] text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                                : "bg-[#00C2FF] text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                    )}
                >
                    {isActive ? <Pause size={32} fill="currentColor" strokeWidth={3} /> : <Play size={32} fill="currentColor" className="ml-1" strokeWidth={3} />}
                </button>

                <button
                    onClick={switchMode}
                    className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    title={mode === "focus" ? "Switch to Break" : "Switch to Focus"}
                >
                    <Coffee size={24} strokeWidth={3} />
                </button>
            </div>

            {/* Motivational Text */}
            {isActive && mode === "focus" && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[var(--color-text-muted)] text-sm italic"
                >
                    "Discipline allows magic. Be magical."
                </motion.p>
            )}
        </div>
    )
}
