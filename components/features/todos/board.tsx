"use client"

import * as React from "react"
import { db, Todo } from "@/lib/db"
import { useLiveQuery } from "dexie-react-hooks"
import { useXP } from "@/store/use-xp"
import { XP_VALUES } from "@/lib/gamification"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { Plus, GripVertical, Trash2, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const COLUMNS = [
    { id: 'Todo', title: 'To Do', color: 'bg-[#00C2FF]', borderColor: 'border-black' }, // Cyan
    { id: 'In Progress', title: 'In Progress', color: 'bg-[#FFD600]', borderColor: 'border-black' }, // Yellow
    { id: 'Done', title: 'Done', color: 'bg-[#00FF94]', borderColor: 'border-black' } // Mint
] as const

const PRIORITY_COLORS = {
    'High': 'text-white bg-[#FF00FF] border-black', // Pink
    'Medium': 'text-black bg-[#FF5C00] border-black', // Orange
    'Low': 'text-black bg-white border-black'
}

export function TodoBoard() {
    const todos = useLiveQuery(() => db.todos.toArray())

    const handleAdd = async (status: Todo['status'], title: string) => {
        if (!title.trim()) return
        await db.todos.add({
            title,
            status,
            priority: 'Medium',
            position: Date.now(),
            created_at: new Date()
        })
    }

    const handleUpdateStatus = async (id: number, newStatus: Todo['status']) => {
        const task = todos?.find(t => t.id === id)
        await db.todos.update(id, { status: newStatus })

        if (newStatus === 'Done' && task?.status !== 'Done') {
            useXP.getState().addXP(XP_VALUES.TASK_COMPLETE, "Task Completed")
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('Delete this task?')) {
            await db.todos.delete(id)
        }
    }

    if (!todos) return <div className="font-mono text-xl font-bold">Loading board...</div>

    return (
        <div className="h-[calc(100vh-140px)] flex gap-8 overflow-x-auto pb-4">
            {COLUMNS.map(col => (
                <Column
                    key={col.id}
                    column={col}
                    todos={todos.filter(t => t.status === col.id)}
                    onAdd={(title: string) => handleAdd(col.id, title)}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    )
}

function Column({ column, todos, onAdd, onUpdateStatus, onDelete }: any) {
    const [newTitle, setNewTitle] = React.useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAdd(newTitle)
        setNewTitle('')
    }

    return (
        <div className={cn(
            "flex-1 min-w-[320px] flex flex-col rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white max-h-full transition-all hover:translate-y-[-2px]"
        )}>
            {/* Header */}
            <div className={cn("p-4 border-b-4 border-black flex justify-between items-center sticky top-0 z-10", column.color)}>
                <h3 className="font-mono font-black text-xl flex items-center gap-3 uppercase tracking-tight text-black">
                    {column.id === 'Todo' && <AlertCircle size={24} className="text-black" strokeWidth={3} />}
                    {column.id === 'In Progress' && <Clock size={24} className="text-black" strokeWidth={3} />}
                    {column.id === 'Done' && <CheckCircle size={24} className="text-black" strokeWidth={3} />}
                    {column.title}
                    <span className="w-8 h-8 flex items-center justify-center rounded-none bg-black text-white text-sm font-bold border border-black">
                        {todos.length}
                    </span>
                </h3>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {todos.map((todo: Todo) => (
                        <TaskCard
                            key={todo.id}
                            todo={todo}
                            onUpdateStatus={onUpdateStatus}
                            onDelete={onDelete}
                        />
                    ))}
                </AnimatePresence>

                {/* Add Task Input */}
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="relative group flex items-center gap-2">
                        <input
                            className="w-full bg-white border-2 border-black rounded-none p-4 text-sm font-mono font-bold focus:bg-gray-50 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400 text-black"
                            placeholder="ADD TASK..."
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!newTitle.trim()}
                            className="absolute right-3 p-1.5 rounded-none bg-black text-white hover:bg-[#FFD600] hover:text-black disabled:opacity-20 transition-colors border border-black"
                        >
                            <Plus size={20} strokeWidth={3} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function TaskCard({ todo, onUpdateStatus, onDelete }: { todo: Todo, onUpdateStatus: any, onDelete: any }) {

    // Swipe logic
    const onDragEnd = (event: any, info: PanInfo) => {
        const threshold = 100
        if (info.offset.x > threshold) {
            // Dragged Right
            if (todo.status === 'Todo') onUpdateStatus(todo.id, 'In Progress')
            else if (todo.status === 'In Progress') onUpdateStatus(todo.id, 'Done')
        } else if (info.offset.x < -threshold) {
            // Dragged Left
            if (todo.status === 'Done') onUpdateStatus(todo.id, 'In Progress')
            else if (todo.status === 'In Progress') onUpdateStatus(todo.id, 'Todo')
        }
    }

    const cyclePriority = async () => {
        const next = todo.priority === 'Low' ? 'Medium' : todo.priority === 'Medium' ? 'High' : 'Low'
        await db.todos.update(todo.id!, { priority: next })
    }

    return (
        <motion.div
            layout
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            whileDrag={{ scale: 1.05, cursor: 'grabbing', zIndex: 50, rotate: 2 }}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-grab active:cursor-grabbing hover:bg-[#FBF9F1] transition-colors"
        >
            <div className="flex justify-between items-start mb-3">
                <p className="font-bold text-sm leading-snug font-mono text-black">{todo.title}</p>
                <button onClick={() => onDelete(todo.id)} className="text-black hover:text-[#FF00FF] opacity-100 transition-colors">
                    <Trash2 size={16} strokeWidth={2.5} />
                </button>
            </div>

            <div className="flex justify-between items-center mt-2">
                <button
                    onClick={cyclePriority}
                    className={cn("text-[10px] uppercase font-black px-2 py-1 border-2 transition-all hover:brightness-110", PRIORITY_COLORS[todo.priority])}
                >
                    {todo.priority}
                </button>

                <GripVertical size={16} className="text-gray-400 group-hover:text-black" />
            </div>
        </motion.div>
    )
}
