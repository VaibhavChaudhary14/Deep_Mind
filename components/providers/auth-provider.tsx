"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

interface AuthContextType {
    isAuthenticated: boolean
    user: User | null
    login: () => void // For now, we'll keep this but it might need to trigger a UI
    logout: () => void
    isOnboarding: boolean
    checkAuth: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null)
    const [isOnboarding, setIsOnboarding] = React.useState(true)
    const router = useRouter()
    const pathname = usePathname()

    React.useEffect(() => {
        // Check active session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
            setIsOnboarding(false)
        }

        checkSession()

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (!session && pathname !== "/" && !pathname.includes("/auth")) {
                router.push("/")
            }
        })

        return () => subscription.unsubscribe()
    }, [router, pathname])

    const login = async () => {
        // Temporary: Aggregate login wrapper
        // In reality, this should be called by a Login component
        console.log("Login triggered - implement actual UI for email/password or OAuth")
    }

    const logout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!user,
            user,
            login,
            logout,
            isOnboarding,
            checkAuth: () => { } // No-op now as it's reactive
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = React.useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
