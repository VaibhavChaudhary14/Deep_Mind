import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/dashboard/header"
import { DeepWorkTimer } from "@/components/features/deep-work/timer"

export default function DeepWorkPage() {
    return (
        <Shell>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold mb-8">Focus Session</h2>
                <DeepWorkTimer />
            </div>
        </Shell>
    )
}
