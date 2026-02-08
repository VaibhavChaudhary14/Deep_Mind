import { Check, Github } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] text-white">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/" className="text-xl font-bold tracking-tight text-[var(--color-ml)]">MissionControl</Link>
                <Link href="/dashboard" className="text-sm font-medium hover:text-[var(--color-primary)]">Go to Dashboard</Link>
            </nav>

            <div className="py-20 px-4 text-center">
                <div className="inline-block px-4 py-1.5 rounded-full bg-green-900/30 border border-green-800 text-green-400 text-sm font-bold mb-6 animate-pulse">
                    100% Free & Open Source
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Invest in Yourself, Not Tools.</h1>
                <p className="text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto text-lg">
                    We believe career growth should be accessible to everyone. Mission Control is completely free for all engineers.
                </p>

                <div className="max-w-md mx-auto p-8 rounded-3xl border border-[var(--color-primary)] bg-gradient-to-b from-blue-900/10 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                    <h3 className="text-3xl font-bold mb-2">Community Edition</h3>
                    <div className="text-5xl font-bold mb-2">$0</div>
                    <p className="text-sm text-gray-400 mb-8">Forever.</p>

                    <ul className="space-y-4 mb-8 text-left">
                        <li className="flex gap-3 items-center"><Check size={20} className="text-green-500" /> Unlimited Logs & Analytics</li>
                        <li className="flex gap-3 items-center"><Check size={20} className="text-green-500" /> AI Career Coach Insights</li>
                        <li className="flex gap-3 items-center"><Check size={20} className="text-green-500" /> Full Roadmap & Task Board</li>
                        <li className="flex gap-3 items-center"><Check size={20} className="text-green-500" /> Local-First Privacy (Your Data is Yours)</li>
                        <li className="flex gap-3 items-center"><Check size={20} className="text-green-500" /> Export to JSON/CSV</li>
                    </ul>

                    <Link href="/dashboard" className="block w-full py-4 text-center rounded-xl bg-[var(--color-primary)] hover:bg-blue-600 font-bold transition-all shadow-lg shadow-blue-500/25 mb-4">
                        Launch Dashboard
                    </Link>

                    <a href="https://github.com/VaibhavChaudhary14" target="_blank" className="flex items-center justify-center gap-2 w-full py-3 text-center rounded-xl bg-gray-800 hover:bg-gray-700 font-bold transition-colors text-sm">
                        <Github size={18} /> Star on GitHub
                    </a>
                </div>
            </div>
        </div>
    )
}
