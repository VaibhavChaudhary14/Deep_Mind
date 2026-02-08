"use client"

import Link from "next/link"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

function ErrorContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const error = searchParams.get('error')
    const details = searchParams.get('details')
    const debug = searchParams.get('debug')

    // Status for recovery attempt
    const [status, setStatus] = useState<'error' | 'recovering' | 'success'>('error')
    const [hashDetected, setHashDetected] = useState<string | null>(null)

    useEffect(() => {
        // Recovery Logic for Implicit Flow (Hash Fragment)
        // If Supabase/Google sent the token in the URL hash (Implicit Flow), we can capture it here.
        const handleImplicitFlow = async () => {
            if (typeof window !== 'undefined' && window.location.hash) {
                const hash = window.location.hash.substring(1) // remove #
                setHashDetected(hash)

                const params = new URLSearchParams(hash)
                const accessToken = params.get('access_token')
                const refreshToken = params.get('refresh_token')
                const type = params.get('type')

                // recovery_token is sometimes used for password resets, but access_token is for oauth
                if (accessToken && (type === 'recovery' || type === 'signup' || type === 'invite' || !type)) {
                    setStatus('recovering')
                    console.log("Implicit flow detected, attempting restoration...")

                    // Manually set the session in Supabase client
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || ''
                    })

                    if (!error) {
                        setStatus('success')
                        // Clear hash to clean URL
                        window.history.replaceState(null, '', window.location.pathname)

                        // Check Onboarding Status
                        const { data: { user } } = await supabase.auth.getUser()
                        if (user) {
                            const { data: profile } = await supabase
                                .from('profiles')
                                .select('role, level')
                                .eq('id', user.id)
                                .single()

                            if (!profile?.role || !profile?.level) {
                                console.log("Profile incomplete, redirecting to Onboarding")
                                setTimeout(() => router.push('/onboarding'), 1500)
                                return
                            }
                        }

                        setTimeout(() => router.push('/dashboard'), 1500)
                    } else {
                        console.error("Restoration failed", error)
                        // Stay on error page but show details
                    }
                }
            }
        }

        handleImplicitFlow()
    }, [router])

    if (status === 'recovering') {
        return (
            <div className="max-w-md w-full bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                <h2 className="font-bold uppercase text-xl">Restoring Session...</h2>
                <p className="font-mono text-gray-500 mt-2">Recovering token from secure fragment.</p>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="max-w-md w-full bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
                    <CheckCircle size={32} strokeWidth={3} />
                </div>
                <h1 className="text-3xl font-black uppercase mb-2">Access Granted</h1>
                <p className="font-mono text-gray-600 font-bold">Redirecting to Dashboard...</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl w-full bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
                <AlertCircle size={32} strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-black uppercase mb-2">Access Denied</h1>
            <p className="font-mono text-gray-600 mb-4 font-bold">
                The security handshake failed.
            </p>

            <div className="bg-red-50 border-2 border-red-200 p-4 mb-6 font-mono text-xs text-red-800 break-words text-left overflow-x-auto">
                <p className="mb-2"><strong>Error:</strong> {error}</p>
                {details && <p className="mb-2"><strong>Details:</strong> {details}</p>}

                {hashDetected ? (
                    <div className="mt-4 pt-4 border-t border-red-200">
                        <strong>⚠️ Hash Fragment Detected (Implicit Flow):</strong>
                        <p className="truncate">{hashDetected.substring(0, 50)}...</p>
                        <p className="text-gray-500 mt-1">Token present but restoration failed.</p>
                    </div>
                ) : debug && (
                    <div className="mt-4 pt-4 border-t border-red-200">
                        <strong>Debug Info (Server):</strong>
                        <pre className="whitespace-pre-wrap mt-1">{JSON.stringify(JSON.parse(decodeURIComponent(debug)), null, 2)}</pre>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <Link
                    href="/auth"
                    className="block w-full bg-black text-white font-mono font-bold uppercase py-3 border-2 border-black hover:bg-[#FFD600] hover:text-black transition-all"
                >
                    Return to Login
                </Link>
                <Link
                    href="/"
                    className="block w-full bg-white text-black font-mono font-bold uppercase py-3 border-2 border-black hover:bg-gray-50 transition-all"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen bg-[#FBF9F1] flex items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <ErrorContent />
            </Suspense>
        </div>
    )
}
