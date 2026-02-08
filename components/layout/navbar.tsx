"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Target,
    Zap,
    Trophy,
    FolderKanban,
    ListTodo
} from "lucide-react"

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
    { label: 'Tasks', href: '/todos', icon: ListTodo },
    { label: 'Deep Work', href: '/deep-work', icon: Zap },
    { label: 'Goals', href: '/goals', icon: Target },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
]

export function Navbar() {
    const pathname = usePathname()

    return (
        <nav className="border-b-4 border-black bg-white px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black"></div>
                <span className="font-black text-xl tracking-tighter uppercase">Deep Mind</span>
            </div>

            <div className="flex items-center gap-6">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 font-bold font-mono text-sm uppercase transition-colors hover:text-[#00C2FF]",
                                isActive ? "text-black border-b-2 border-black" : "text-gray-400"
                            )}
                        >
                            <Icon size={16} />
                            <span className="hidden md:inline">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
