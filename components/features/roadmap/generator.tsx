"use client"

import * as React from "react"
import { AnimatePresence } from "framer-motion"
import { Wand2, CheckCircle2, Loader2 } from "lucide-react"
import { db } from "@/lib/db"
import { Modal } from "@/components/ui/modal"
import { useRouter } from "next/navigation"

interface RoadmapGeneratorProps {
    isOpen: boolean
    onClose: () => void
    isEmbedded?: boolean
}

export function RoadmapGenerator({ isOpen, onClose, isEmbedded }: RoadmapGeneratorProps) {
    const router = useRouter();

    const [qaHistory, setQaHistory] = React.useState<{ question: string, answer: string }[]>([]);
    const [currentQuestion, setCurrentQuestion] = React.useState<{ question: string, options: string[] } | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [isComplete, setIsComplete] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fetchNextQuestion = async (history: any[]) => {
        setIsLoading(true);
        setCurrentQuestion(null);
        setError(null);
        try {
            const res = await fetch('/api/ai/mcq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history })
            });

            const textResponse = await res.text();
            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (e) {
                console.error("Non-JSON API Response:", textResponse);
                setError("The server returned an invalid format. An internal backend error occurred.");
                return;
            }

            if (!res.ok) {
                setError(data.error || `API Error (${res.status})`);
                return;
            }

            if (data.question && data.options) {
                setCurrentQuestion(data);
            } else {
                setError("The AI returned an invalid response structure. Please try again.");
            }
        } catch (err) {
            console.error("Failed to get question", err);
            setError("Network or API timeout. Please ensure the backend is running.");
        } finally {
            setIsLoading(false);
        }
    }

    // Reset when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setQaHistory([]);
            setCurrentQuestion(null);
            setIsComplete(false);
            setError(null);
            fetchNextQuestion([]);
        }
    }, [isOpen]);

    const handleAnswer = (answer: string) => {
        if (!currentQuestion) return;
        const newHistory = [...qaHistory, { question: currentQuestion.question, answer }];
        setQaHistory(newHistory);
        if (newHistory.length < 4) {
            fetchNextQuestion(newHistory);
        } else {
            setCurrentQuestion(null);
        }
    }

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const res = await fetch('/api/ai/generate-roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: qaHistory })
            });

            const textResponse = await res.text();
            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (e) {
                console.error("Non-JSON API Response:", textResponse);
                setError("The server returned an invalid format during generation.");
                return;
            }

            if (!res.ok) {
                setError(data.error || `API Error (${res.status})`);
                return;
            }

            if (data.roadmap && Array.isArray(data.roadmap)) {

                // Process roadmap to include tracking fields
                const processedContent = data.roadmap.map((day: any) => ({
                    ...day,
                    status: 'Todo',
                    time_taken: 0
                }));

                await db.ai_plans.add({
                    role: data.targetRole || qaHistory[0].answer,
                    content: processedContent,
                    created_at: new Date()
                });

                setIsComplete(true);
            } else {
                setError("The generated roadmap structure was invalid. Please retry.");
            }
        } catch (error) {
            console.error("Failed to generate plan", error);
            setError("Network or API timeout while generating protocol.");
        } finally {
            setIsGenerating(false);
        }
    }

    const innerContent = (
        <div className="min-h-[300px] flex flex-col justify-center">

            {!isComplete && isLoading && (
                <div className="flex flex-col items-center justify-center space-y-4 py-12 animate-in fade-in">
                    <Loader2 size={48} className="animate-spin text-black" />
                    <p className="font-bold font-mono text-gray-500">Synthesizing diagnostics...</p>
                </div>
            )}

            {!isComplete && !isLoading && error && (
                <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in fade-in zoom-in duration-300">
                    <div className="bg-[#FF00FF] border-4 border-black p-4 shadow-[6px_6px_0_#000] text-center max-w-sm">
                        <h3 className="text-xl font-black font-mono text-white mb-2 uppercase">Diagnostic Failed</h3>
                        <p className="font-bold font-mono text-white text-sm">{error}</p>
                    </div>
                    <button
                        onClick={() => qaHistory.length === 4 ? handleGenerate() : fetchNextQuestion(qaHistory)}
                        className="mt-6 px-6 py-3 bg-black text-white font-black uppercase font-mono border-4 border-black hover:bg-[#FFD600] hover:text-black shadow-[4px_4px_0_#000] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        Retry Sector
                    </button>
                    <button
                        onClick={onClose}
                        className="text-gray-500 font-bold font-mono underline hover:text-black mt-2"
                    >
                        Abort Scan
                    </button>
                </div>
            )}

            {!isComplete && !isLoading && !error && currentQuestion && qaHistory.length < 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-3 border-b-4 border-black pb-2">
                        <span className="bg-black text-white font-black font-mono px-2 py-1 text-sm border-2 border-black">
                            {qaHistory.length + 1} / 4
                        </span>
                        <h3 className="text-xl font-black font-mono uppercase text-black">{currentQuestion.question}</h3>
                    </div>

                    <div className="space-y-3">
                        {currentQuestion.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                className="w-full text-left p-4 bg-white border-4 border-black font-bold font-mono hover:bg-[#FFD600] active:translate-y-[2px] shadow-[4px_4px_0_#000] active:shadow-none transition-all"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {!isComplete && !isLoading && qaHistory.length === 4 && (
                <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300 py-8">
                    <h3 className="text-2xl font-black font-mono uppercase text-black border-l-4 border-black pl-3 inline-block">Diagnostic Complete</h3>
                    <p className="text-sm font-bold text-gray-500 font-mono">The AI has gathered enough context to build your 90-day execution protocol.</p>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full bg-black text-[#00FF94] font-black py-5 text-lg uppercase font-mono flex items-center justify-center gap-3 hover:bg-[#00FF94] hover:text-black border-4 border-black shadow-[6px_6px_0_#000] disabled:opacity-50 transition-colors"
                    >
                        {isGenerating ? <><Loader2 size={24} className="animate-spin" /> Generating Protocol...</> : <><Wand2 size={24} /> Compile Strategy</>}
                    </button>
                </div>
            )}

            {isComplete && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 text-center py-8">
                    <div className="mx-auto w-24 h-24 bg-[#00FF94] border-4 border-black flex items-center justify-center rounded-full shadow-[8px_8px_0_#000]">
                        <CheckCircle2 size={48} className="text-black" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black font-mono uppercase text-black tracking-tight">Protocol Locked.</h3>
                        <p className="font-bold text-gray-500 font-mono mt-2">A 90-day tactical execution roadmap has been generated and saved below.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white text-black text-sm font-black uppercase font-mono inline-flex items-center justify-center border-4 border-black shadow-[4px_4px_0_#000] hover:bg-[#FFD600] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        Close & View Roadmap
                    </button>
                </div>
            )}

        </div>
    );

    if (isEmbedded) {
        if (!isOpen) return null;
        return (
            <div className="bg-[#FBF9F1] border-4 border-black p-8 shadow-[8px_8px_0_#000]">
                {innerContent}
            </div>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    title="Strategic AI Diagnostic"
                    headerColor="bg-black text-white"
                >
                    {innerContent}
                </Modal>
            )}
        </AnimatePresence>
    )
}
