"use client";

import { Shell } from "@/components/layout/shell";
import { Header } from "@/components/dashboard/header";
import { Check, Rocket, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";

export default function PricingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleCheckout = async (tier: string, priceId: string) => {
        if (!user) {
            router.push('/auth');
            return;
        }

        setIsLoading(tier);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, email: user.email, tier, priceId })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <Shell>
            <Header />

            <div className="max-w-6xl mx-auto py-12 px-4">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black font-mono uppercase tracking-tighter mb-4">
                        Fund Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] to-[#9D00FF] [-webkit-text-stroke:2px_black]">Velocity</span>
                    </h1>
                    <p className="text-lg font-mono font-bold text-gray-500 max-w-2xl mx-auto">
                        Deep Mind is not a free to-do list. It is an acceleration engine for engineers serious about their compounding value.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {/* Trial */}
                    <div className="neo-card bg-white border-4 border-black relative">
                        <div className="absolute top-0 right-0 bg-gray-200 border-l-4 border-b-4 border-black px-3 py-1 font-black font-mono text-sm">
                            7 DAYS
                        </div>
                        <h2 className="text-2xl font-black font-mono uppercase mb-2">Initiate</h2>
                        <div className="text-5xl font-black tracking-tighter mb-6">$2</div>
                        <p className="font-bold text-sm text-gray-600 mb-8 border-l-4 border-black pl-3 min-h-[60px]">
                            Commit a micro-fee to filter out the unserious. Full system access for 7 days.
                        </p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex gap-3 items-start"><Check className="text-[#00FF94] mt-1" size={18} /> <span className="font-bold text-sm">One Active 90-Day Sprint</span></li>
                            <li className="flex gap-3 items-start"><Check className="text-[#00FF94] mt-1" size={18} /> <span className="font-bold text-sm">Daily Execution Board</span></li>
                            <li className="flex gap-3 items-start"><Check className="text-[#00FF94] mt-1" size={18} /> <span className="font-bold text-sm">Actionable UI Widgets</span></li>
                        </ul>

                        <button
                            onClick={() => handleCheckout('initiate', 'price_initiate_stripe_id')}
                            disabled={!!isLoading}
                            className="w-full py-4 bg-white text-black border-2 border-black font-black uppercase shadow-[4px_4px_0_#000] hover:bg-gray-100 transition-all active:translate-y-1 active:shadow-none disabled:opacity-50"
                        >
                            {isLoading === 'initiate' ? 'Loading...' : 'Start Trial'}
                        </button>
                    </div>

                    {/* Pro */}
                    <div className="neo-card bg-black text-white border-4 border-black shadow-[12px_12px_0_#00FF94] transform md:-translate-y-8 relative">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#00FF94] text-black border-2 border-black px-4 py-1 font-black font-mono tracking-widest shadow-[4px_4px_0_#000]">
                            MOST CHOSEN
                        </div>
                        <h2 className="text-2xl font-black font-mono uppercase text-[#00FF94] mb-2 mt-4">Operator</h2>
                        <div className="text-5xl font-black tracking-tighter mb-6 text-white">$15<span className="text-xl text-gray-500">/mo</span></div>
                        <p className="font-bold text-sm text-gray-400 mb-8 border-l-4 border-[#00FF94] pl-3 min-h-[60px]">
                            Monthly subscription to the exact framework used by elite engineers.
                        </p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex gap-3 items-start"><Zap className="text-[#00FF94] mt-1" size={18} /> <span className="font-bold text-sm">Unlimited 90-Day Sprints</span></li>
                            <li className="flex gap-3 items-start"><Zap className="text-[#00FF94] mt-1" size={18} /> <span className="font-bold text-sm">Strategic AI Coach Unblockers</span></li>
                            <li className="flex gap-3 items-start"><Zap className="text-[#00FF94] mt-1" size={18} /> <span className="font-bold text-sm">Weekly Acceleration Reports</span></li>
                            <li className="flex gap-3 items-start"><Zap className="text-[#00FF94] mt-1" size={18} /> <span className="font-bold text-sm">Momentum Risk Detection</span></li>
                        </ul>

                        <button
                            onClick={() => handleCheckout('operator', 'price_operator_stripe_id')}
                            disabled={!!isLoading}
                            className="w-full py-4 bg-[#00FF94] text-black border-2 border-[#00FF94] font-black uppercase shadow-[4px_4px_0_#fff] hover:bg-[#00c572] hover:border-[#00c572] transition-all active:translate-y-1 active:shadow-none disabled:opacity-50"
                        >
                            {isLoading === 'operator' ? 'Loading...' : 'Subscribe Monthly'}
                        </button>
                    </div>

                    {/* Annual */}
                    <div className="neo-card bg-white border-4 border-black relative">
                        <div className="absolute top-0 right-0 bg-[#FFD600] border-l-4 border-b-4 border-black px-3 py-1 font-black font-mono text-sm">
                            SAVE 33%
                        </div>
                        <h2 className="text-2xl font-black font-mono uppercase mb-2">Architect</h2>
                        <div className="text-5xl font-black tracking-tighter mb-6">$120<span className="text-xl text-gray-500">/yr</span></div>
                        <p className="font-bold text-sm text-gray-600 mb-8 border-l-4 border-black pl-3 min-h-[60px]">
                            The long-term play. Lock your trajectory in for a full year of compounded growth.
                        </p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex gap-3 items-start"><Shield className="text-[#FF00FF] mt-1" size={18} /> <span className="font-bold text-sm">Everything in Operator</span></li>
                            <li className="flex gap-3 items-start"><Shield className="text-[#FF00FF] mt-1" size={18} /> <span className="font-bold text-sm">V1 Dormant Feature Early Access</span></li>
                            <li className="flex gap-3 items-start"><Shield className="text-[#FF00FF] mt-1" size={18} /> <span className="font-bold text-sm">Direct priority support</span></li>
                        </ul>

                        <button
                            onClick={() => handleCheckout('architect', 'price_architect_stripe_id')}
                            disabled={!!isLoading}
                            className="w-full py-4 bg-black text-white border-2 border-black font-black uppercase shadow-[4px_4px_0_#FFD600] hover:bg-gray-800 transition-all active:translate-y-1 active:shadow-none mt-auto disabled:opacity-50"
                        >
                            {isLoading === 'architect' ? 'Loading...' : 'Subscribe Annually'}
                        </button>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
