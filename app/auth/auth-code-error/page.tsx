"use client"

import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen bg-[#FBF9F1] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
                    <AlertCircle size={32} strokeWidth={3} />
                </div>
                <h1 className="text-3xl font-black uppercase mb-2">Access Denied</h1>
                <p className="font-mono text-gray-600 mb-8 font-bold">
                    The security handshake failed. The authentication code was invalid or expired.
                </p>

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
        </div>
    )
}
