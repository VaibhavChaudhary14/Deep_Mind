"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
    LayoutDashboard,
    Target,
    Zap,
    Trophy,
    FolderKanban,
    ListTodo,
    Menu,
    X
} from "lucide-react"
import { SIDEBAR_ITEMS } from "@/components/layout/sidebar"

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
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="border-b-4 border-black bg-white px-8 py-4 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-1 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className="w-8 h-8 bg-black"></div>
                    <span className="font-black text-xl tracking-tighter uppercase">Deep Mind</span>
                </div>

                <div className="hidden lg:flex items-center gap-6">
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
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="absolute top-[72px] left-0 right-0 bg-white border-b-4 border-black p-4 flex flex-col gap-2 lg:hidden shadow-[0px_4px_0px_0px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-2">
                        {[...NAV_ITEMS, ...SIDEBAR_ITEMS].map((item) => {
                            const isActive = pathname.startsWith(item.href)
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-2 p-3 font-bold font-mono text-xs uppercase border-2 transition-all",
                                        isActive
                                            ? "bg-[#FFD600] border-black text-black"
                                            : "border-gray-100 text-gray-500 hover:border-black hover:text-black"
                                    )}
                                >
                                    <Icon size={16} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </nav>
    )
}
