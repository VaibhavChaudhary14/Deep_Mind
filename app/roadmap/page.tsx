import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/dashboard/header"
import { RoadmapView } from "@/components/features/roadmap/view"

export default function RoadmapPage() {
    return (
        <Shell>
            <Header />
            <RoadmapView />
        </Shell>
    )
}
