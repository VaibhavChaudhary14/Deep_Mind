import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/dashboard/header"
import { ProjectBoard } from "@/components/features/projects/project-board"

export default function ProjectsPage() {
    return (
        <Shell>
            <Header />
            <ProjectBoard />
        </Shell>
    )
}
