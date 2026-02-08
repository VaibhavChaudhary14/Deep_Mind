"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
    isAuthenticated: boolean
    login: () => void
    logout: () => void
    isOnboarding: boolean
    checkAuth: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false)
    const [isOnboarding, setIsOnboarding] = React.useState(true) // Default to guarding
    const router = useRouter()
    const pathname = usePathname()

    const checkAuth = React.useCallback(() => {
        const auth = localStorage.getItem("mc_auth")
        if (auth === "true") {
            setIsAuthenticated(true)
        } else {
            setIsAuthenticated(false)
        }
        setIsOnboarding(false)
    }, [])

    React.useEffect(() => {
        checkAuth()
    }, [checkAuth])

    const login = () => {
        localStorage.setItem("mc_auth", "true")
        setIsAuthenticated(true)
        router.push("/dashboard")
    }

    const logout = () => {
        localStorage.removeItem("mc_auth")
        setIsAuthenticated(false)
        router.push("/")
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isOnboarding, checkAuth }}>
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
