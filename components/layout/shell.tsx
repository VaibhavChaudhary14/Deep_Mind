"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useSidebar } from "@/components/providers/sidebar-provider"
import { motion } from "framer-motion"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import * as React from "react"

interface ShellProps {
    children: React.ReactNode
}

export function Shell({ children }: ShellProps) {
    const { isCollapsed } = useSidebar()
    const { isAuthenticated, isOnboarding } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    React.useEffect(() => {
        // Allow public access to Landing Page and Onboarding
        if (pathname === "/" || pathname === "/onboarding") return

        // If not authenticated and not loading (isOnboarding is effectively loading state here for auth check)
        if (!isAuthenticated && !isOnboarding) {
            router.push("/")
        }
    }, [isAuthenticated, isOnboarding, pathname, router])

    return (


        <div className="flex h-screen overflow-hidden bg-[var(--color-bg-primary)]">
            <Sidebar />
            <motion.main
                initial={false}
                animate={{ marginLeft: isCollapsed ? 80 : 260 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto p-8 relative w-full"
            >
                <div className="mx-auto max-w-7xl space-y-8">
                    {children}
                </div>
            </motion.main>
        </div>
    )
}
