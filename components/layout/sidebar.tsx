"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Map,
    Briefcase,
    Zap,
    GraduationCap,
    Shield
} from "lucide-react"

const SIDEBAR_ITEMS = [
    { label: 'Roadmap', href: '/roadmap', icon: Map },
    { label: 'Career', href: '/career-connect', icon: Briefcase },
    { label: 'Skills', href: '/skills', icon: Zap },
    { label: 'Placement', href: '/placements', icon: GraduationCap },
    { label: 'Admin', href: '/admin', icon: Shield },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-[76px] bottom-0 w-64 bg-[#FBF9F1] border-r-4 border-black p-4 hidden lg:flex flex-col gap-2 z-40">

            <div className="mb-4 px-4">
                <h3 className="font-black font-mono text-xs uppercase text-gray-400">Secondary Protocols</h3>
            </div>

            {SIDEBAR_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const Icon = item.icon

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 font-bold font-mono uppercase text-sm transition-all border-2 border-transparent",
                            isActive
                                ? "bg-[#FFD600] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px]"
                                : "text-gray-500 hover:text-black hover:bg-white hover:border-black"
                        )}
                    >
                        <Icon size={18} strokeWidth={isActive ? 3 : 2} />
                        {item.label}
                    </Link>
                )
            })}
        </aside>
    )
}
