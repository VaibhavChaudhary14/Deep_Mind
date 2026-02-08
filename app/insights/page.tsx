import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/dashboard/header"
import { InsightsView } from "@/components/features/insights/view"

export default function InsightsPage() {
    return (
        <Shell>
            <Header />
            <InsightsView />
        </Shell>
    )
}
