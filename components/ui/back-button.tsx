"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string
}

export function BackButton({ label = "Back", className, ...props }: BackButtonProps) {
    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className={cn(
                "flex items-center gap-2 text-gray-500 hover:text-black font-bold uppercase text-xs mb-4 transition-colors group",
                className
            )}
            {...props}
        >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg">{label}</span>
        </button>
    )
}
