"use client"

import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="max-w-md w-full bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
                <AlertCircle size={32} strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-black uppercase mb-2">Access Denied</h1>
            <p className="font-mono text-gray-600 mb-4 font-bold">
                The security handshake failed.
            </p>
            {error && (
                <div className="bg-red-50 border-2 border-red-200 p-2 mb-6 font-mono text-xs text-red-800 break-words">
                    <strong>Error Details:</strong><br />
                    {error}
                </div>
            )}

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
