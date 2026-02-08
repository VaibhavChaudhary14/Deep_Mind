
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, Bot, User, AlertCircle, Lightbulb } from "lucide-react"
import { generateInterviewQuestion } from "@/app/actions/ai-interview"

interface InterviewResponse {
    feedback?: string
    next_question: string
    hint?: string
    difficulty?: string
}

interface Message {
    role: 'bot' | 'user' | 'feedback'
    text: string
    meta?: any
}

export function MockInterviewBot() {
    const [role, setRole] = useState("")
    const [started, setStarted] = useState(false)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages])

    const processResponse = (res: InterviewResponse) => {
        const newMsgs: Message[] = []

        if (res.feedback) {
            newMsgs.push({ role: 'feedback', text: res.feedback })
        }

        newMsgs.push({
            role: 'bot',
            text: res.next_question,
            meta: { difficulty: res.difficulty }
        })

        setMessages(prev => [...prev, ...newMsgs])
    }

    const startInterview = async () => {
        if (!role) return
        setStarted(true)
        setLoading(true)
        const res = await generateInterviewQuestion(role, "Intermediate", [])
        if (res.success && res.data) {
            processResponse(res.data)
        }
        setLoading(false)
    }

    const sendMessage = async () => {
        if (!input.trim()) return

        const userMsg = input
        setMessages(prev => [...prev, { role: 'user', text: userMsg }])
        setInput("")
        setLoading(true)

        // Convert messages to history string context for AI
        // We only send User and Bot messages, skip feedback to save context
        const history = messages
            .filter(m => m.role !== 'feedback')
            .map(m => `${m.role.toUpperCase()}: ${m.text}`)

        history.push(`USER: ${userMsg}`)

        const res = await generateInterviewQuestion(role, "Intermediate", history)
        if (res.success && res.data) {
            processResponse(res.data)
        }
        setLoading(false)
    }

    const handleReset = () => {
        setStarted(false)
        setMessages([])
        setInput("")
        setRole("")
    }

    return (
        <div className={`neo-card bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col transition-all duration-300 ${started ? 'h-[600px]' : 'h-auto p-6'}`}>
            <div className={`flex items-center justify-between ${started ? 'p-4 border-b-2 border-black bg-[#E0F2E9]' : 'mb-4'}`}>
                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                    <Bot size={24} className="text-black" /> Interview Sim
                </h2>
                {started && (
                    <button onClick={handleReset} className="p-2 hover:bg-white rounded-full transition-colors border-2 border-transparent hover:border-black" title="End Session">
                        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </motion.div>
                    </button>
                )}
            </div>

            {!started ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col space-y-4"
                >
                    <div>
                        <label className="font-bold text-xs uppercase block mb-1 text-gray-500">Target Role</label>
                        <input
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g. SDE II, Data Scientist"
                            className="w-full bg-gray-50 border-2 border-black p-2 font-mono text-sm"
                        />
                    </div>

                    <button
                        onClick={startInterview}
                        disabled={!role || loading}
                        className="w-full bg-black text-white py-2 font-bold uppercase hover:bg-[#00C2FF] hover:text-black transition-colors"
                    >
                        {loading ? "INITIALIZING..." : "START SESSION"}
                    </button>
                </motion.div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-dots">
                        <AnimatePresence>
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex w-full ${m.role === 'user' ? 'justify-end' :
                                        m.role === 'feedback' ? 'justify-center' : 'justify-start'
                                        }`}
                                >
                                    {m.role === 'feedback' ? (
                                        <div className="bg-orange-100 border-2 border-orange-500 text-orange-800 p-2 text-xs font-bold w-3/4 text-center rounded flex items-center justify-center gap-2">
                                            <AlertCircle size={12} /> {m.text}
                                        </div>
                                    ) : (
                                        <div className={`max-w-[80%] p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${m.role === 'user' ? 'bg-[#FFD600] mr-2 rounded-tl-xl rounded-bl-xl rounded-br-none' : 'bg-white ml-2 rounded-tr-xl rounded-br-xl rounded-bl-none'
                                            }`}>
                                            {m.role === 'bot' && m.meta?.difficulty && (
                                                <div className="text-[9px] uppercase font-black text-gray-400 mb-1">
                                                    Logic Level: {m.meta.difficulty}
                                                </div>
                                            )}
                                            <p className="font-mono text-sm">{m.text}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-black text-white p-3 border-2 border-transparent ml-2 animate-pulse">
                                    <span className="font-mono text-xs">ANALYZING RESPONSE...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t-2 border-black bg-white flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type..."
                            className="flex-1 bg-gray-50 border-2 border-black p-2 font-mono text-sm outline-none focus:bg-[#E0F2E9]"
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="bg-black text-white px-3 border-2 border-black hover:bg-[#00FF94] hover:text-black transition-colors disabled:opacity-50"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
