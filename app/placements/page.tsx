import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/dashboard/header"
import { PlacementTracker } from "@/components/features/placements/tracker"

export default function PlacementsPage() {
    return (
        <Shell>
            <Header />
            <PlacementTracker />
        </Shell>
    )
}
