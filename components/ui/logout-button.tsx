"use client"

import { LogOut } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { cn } from "@/lib/utils"

interface LogoutButtonProps {
    className?: string
    showLabel?: boolean
}

export function LogoutButton({ className, showLabel = true }: LogoutButtonProps) {
    const { logout } = useAuth()

    return (
        <button
            onClick={logout}
            className={cn(
                "flex items-center gap-2 font-bold font-mono text-sm uppercase transition-colors hover:text-red-500 text-gray-400",
                className
            )}
        >
            <LogOut size={16} />
            {showLabel && <span>Logout</span>}
        </button>
    )
}