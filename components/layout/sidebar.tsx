"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    Timer,
    Settings,
    Briefcase,
    Code2,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Globe,
    Map,
    Sparkles,
    Kanban,
    Target,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Goals", icon: Target, href: "/goals" },
    { name: "Roadmap", icon: Map, href: "/roadmap" },
    { name: "Tasks", icon: Kanban, href: "/todos" },
    { name: "Projects", icon: Code2, href: "/projects" },
    { name: "Skills", icon: BarChart3, href: "/skills" },
    { name: "Placements", icon: Briefcase, href: "/placements" },
    { name: "Deep Work", icon: Timer, href: "/deep-work" },
    { name: "Settings", icon: Settings, href: "/settings" },
]

import { useSidebar } from "@/components/providers/sidebar-provider"

// ... imports

import { EditProfileModal } from "@/components/features/settings/edit-profile-modal"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { useAuth } from "@/components/providers/auth-provider"

export function Sidebar() {
    const pathname = usePathname()
    const { isCollapsed, toggleSidebar } = useSidebar()
    const { logout } = useAuth()
    const [isProfileOpen, setIsProfileOpen] = React.useState(false)

    // Fetch user settings (first record)
    const settings = useLiveQuery(() => db.settings.orderBy('id').first())

    const username = settings?.role || "Engineer"
    const title = settings?.title || "L3 • SDE II"

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 260 }}
            className="fixed left-0 top-0 h-screen z-50 flex flex-col border-r-2 border-black bg-[var(--color-mint)] transition-all duration-300"
        >
            {/* Header Area */}
            <div className="flex h-20 items-center justify-between px-4 border-b-2 border-black bg-[var(--color-cream)]">
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
                        >
                            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-mono font-bold rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] text-lg">
                                DM
                            </div>
                            <span className="font-mono font-bold text-lg leading-none tracking-tight">DEEP<br />MIND</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={toggleSidebar}
                    className="p-1.5 bg-white hover:bg-black hover:text-white rounded border-2 border-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-3 font-bold transition-all border-2",
                                isActive
                                    ? "bg-[var(--color-mustard)] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black translate-x-1"
                                    : "bg-transparent border-transparent text-gray-700 hover:bg-white hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                                isCollapsed && "justify-center px-0 bg-transparent border-transparent"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-black" : "text-gray-600")} />
                            {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer User Profile */}
            <div className="p-4 border-t-2 border-black bg-[var(--color-cream)] space-y-2">
                {!isCollapsed ? (
                    <>
                        <div
                            onClick={() => setIsProfileOpen(true)}
                            className="p-3 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 cursor-pointer hover:bg-[#FFC0CB] transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#00C2FF] border-2 border-black flex-shrink-0 flex items-center justify-center font-bold text-white text-xs">
                                {username.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-xs font-black truncate uppercase">{username}</div>
                                <div className="text-[9px] text-gray-500 font-mono font-bold">{title}</div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full py-1.5 flex items-center justify-center gap-2 bg-black text-white text-xs font-bold uppercase border-2 border-transparent hover:bg-red-600 transition-colors"
                        >
                            <LogOut size={12} /> Logout
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col gap-2 items-center">
                        <div
                            onClick={() => setIsProfileOpen(true)}
                            className="w-8 h-8 rounded-full bg-[#00C2FF] border-2 border-black cursor-pointer hover:scale-110 transition-transform flex items-center justify-center font-bold text-white text-xs"
                        >
                            {username.charAt(0)}
                        </div>
                        <button onClick={logout} className="text-gray-500 hover:text-red-500">
                            <LogOut size={16} />
                        </button>
                    </div>
                )}
            </div>

            <EditProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </motion.aside>
    )
}
