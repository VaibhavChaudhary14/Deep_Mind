"use client"

import * as React from "react"

interface DeepWorkContextType {
    isDeepWork: boolean
    toggleDeepWork: () => void
}

const DeepWorkContext = React.createContext<DeepWorkContextType | undefined>(undefined)

export function DeepWorkProvider({ children }: { children: React.ReactNode }) {
    const [isDeepWork, setIsDeepWork] = React.useState(false)

    React.useEffect(() => {
        if (isDeepWork) {
            document.body.classList.add("deep-work-mode")
        } else {
            document.body.classList.remove("deep-work-mode")
        }
    }, [isDeepWork])

    const toggleDeepWork = () => setIsDeepWork((prev) => !prev)

    return (
        <DeepWorkContext.Provider value={{ isDeepWork, toggleDeepWork }}>
            {children}
        </DeepWorkContext.Provider>
    )
}

export function useDeepWork() {
    const context = React.useContext(DeepWorkContext)
    if (context === undefined) {
        throw new Error("useDeepWork must be used within a DeepWorkProvider")
    }
    return context
}
