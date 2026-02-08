
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Send, Copy, Check, MousePointerClick } from "lucide-react"
import { generateColdEmail } from "@/app/actions/ai-email"

interface EmailResult {
    subject_lines: string[]
    hook: string
    value_prop: string
    call_to_action: string
    full_body: string
}

export function ColdEmailGenerator() {
    const [company, setCompany] = useState("")
    const [recipient, setRecipient] = useState("")
    const [role, setRole] = useState("")
    const [myProfile, setMyProfile] = useState("")

    const [result, setResult] = useState<EmailResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState(0)

    const handleGenerate = async () => {
        if (!company || !role) return
        setLoading(true)
        setResult(null)

        const res = await generateColdEmail(company, recipient || "Hiring Manager", role, myProfile || "passionate engineer")
        if (res.success && res.data) {
            setResult(res.data)
        }
        setLoading(false)
    }

    const copyToClipboard = () => {
        if (!result) return
        const text = `Subject: ${result.subject_lines[selectedSubject]}\n\n${result.full_body}`
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleReset = () => {
        setCompany("")
        setRole("")
        setRecipient("")
        setMyProfile("")
        setResult(null)
    }

    return (
        <div className="neo-card bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                    <Mail size={24} className="text-[#FF5C00]" /> Outreach
                </h2>
                {result && (
                    <button onClick={handleReset} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Reset">
                        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>
                        </motion.div>
                    </button>
                )}
            </div>

            {!result ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-xs uppercase block mb-1 text-gray-500">Target Company</label>
                            <input
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="e.g. Google"
                                className="w-full bg-gray-50 border-2 border-black p-2 font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="font-bold text-xs uppercase block mb-1 text-gray-500">Target Role</label>
                            <input
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g. AI Engineer"
                                className="w-full bg-gray-50 border-2 border-black p-2 font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-xs uppercase block mb-1 text-gray-500">Recipient</label>
                            <input
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder="Optional"
                                className="w-full bg-gray-50 border-2 border-black p-2 font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-xs uppercase block mb-1 text-gray-500">My Background</label>
                            <input
                                value={myProfile}
                                onChange={(e) => setMyProfile(e.target.value)}
                                placeholder="Brief context"
                                className="w-full bg-gray-50 border-2 border-black p-2 font-mono text-sm"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !company || !role}
                        className="w-full bg-[#FF5C00] text-black font-bold py-2 border-2 border-black uppercase hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all disabled:opacity-50 text-sm"
                    >
                        {loading ? "Drafting..." : "Generate Outreach"}
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4"
                >
                    {/* Subject Line Selector */}
                    <div className="space-y-2">
                        <span className="font-bold text-[10px] uppercase bg-black text-white px-2 py-0.5">Select Subject</span>
                        <div className="space-y-1">
                            {result.subject_lines.map((subject, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedSubject(i)}
                                    className={`p-1.5 border-2 cursor-pointer transition-all flex items-center gap-2 ${selectedSubject === i
                                            ? "border-black bg-[#FF5C00] text-white font-bold"
                                            : "border-gray-200 hover:border-black text-gray-500"
                                        }`}
                                >
                                    <div className={`w-3 h-3 rounded-full border-2 border-white flex items-center justify-center`}>
                                        {selectedSubject === i && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                    <span className="text-xs truncate">{subject}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Email Body */}
                    <div className="bg-gray-50 border-2 border-black p-3 relative group">
                        <button
                            onClick={copyToClipboard}
                            className="absolute top-2 right-2 p-1 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                        </button>

                        <div className="mb-3 pb-2 border-b-2 border-gray-200">
                            <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Hook</div>
                            <p className="font-serif italic text-sm text-gray-800">{result.hook}</p>
                        </div>

                        <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                            {result.full_body}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
