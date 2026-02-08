"use client"

import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import * as React from "react"

interface ShellProps {
    children: React.ReactNode
}

export function Shell({ children }: ShellProps) {
    const { isAuthenticated, isOnboarding } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    React.useEffect(() => {
        if (pathname === "/" || pathname === "/onboarding") return

        if (!isAuthenticated && !isOnboarding) {
            router.push("/")
        }
    }, [isAuthenticated, isOnboarding, pathname, router])

    const showNav = isAuthenticated && pathname !== "/" && pathname !== "/onboarding"

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
            {showNav && <Navbar />}
            {showNav && <Sidebar />}

            <main className={`flex-1 p-8 w-full transition-all duration-300 ${showNav ? 'lg:pl-72' : ''}`}>
                <div className="mx-auto max-w-7xl space-y-8">
                    {pathname !== "/dashboard" && pathname !== "/" && (
                        <BackButton />
                    )}
                    {children}
                </div>
            </main>
        </div>
    )
}
