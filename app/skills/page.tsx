import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/dashboard/header"
import { SkillMatrix } from "@/components/features/skills/skill-matrix"

export default function SkillsPage() {
    return (
        <Shell>
            <Header />
            <SkillMatrix />
        </Shell>
    )
}
