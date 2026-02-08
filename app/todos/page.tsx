import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/dashboard/header"
import { TodoBoard } from "@/components/features/todos/board"

export default function TodoPage() {
    return (
        <Shell>
            <Header />
            <div className="space-y-4 h-full flex flex-col">
                <div>
                    <h2 className="text-2xl font-bold">Task Board</h2>
                    <p className="text-[var(--color-text-secondary)]">Drag cards right to progress. Click priority to cycle.</p>
                </div>
                <TodoBoard />
            </div>
        </Shell>
    )
}
