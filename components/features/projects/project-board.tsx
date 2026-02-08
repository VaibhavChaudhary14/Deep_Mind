"use client"

import * as React from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { db, Project } from "@/lib/db"
import { motion } from "framer-motion"
import { Github, Globe, Plus, Trash2, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProjectModal } from "./project-modal"

export function ProjectBoard() {
    const projects = useLiveQuery(() => db.projects.toArray())
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [projectToEdit, setProjectToEdit] = React.useState<Project | undefined>(undefined)

    const handleEdit = (project: Project) => {
        setProjectToEdit(project)
        setIsModalOpen(true)
    }

    const handleAdd = () => {
        setProjectToEdit(undefined)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm("Delete project?")) await db.projects.delete(id)
    }

    if (!projects) return <div>Loading...</div>

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black font-mono uppercase tracking-tight bg-[#00FF94] inline-block px-3 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                    Build Gallery
                </h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-[#FF5C00] hover:text-black transition-all font-bold uppercase font-mono text-sm"
                >
                    <Plus size={16} /> New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, i) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={i}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))}
            </div>

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectToEdit={projectToEdit}
            />
        </div>
    )
}

function ProjectCard({ project, index, onDelete, onEdit }: { project: Project, index: number, onDelete: any, onEdit: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full"
        >
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={() => onEdit(project)}
                    className="p-1.5 hover:bg-[#00C2FF] hover:border-black hover:text-black border-2 border-transparent transition-all rounded-none text-gray-400"
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={() => onDelete(project.id)}
                    className="p-1.5 hover:bg-red-500 hover:border-black hover:text-white border-2 border-transparent transition-all rounded-none text-gray-400"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="mb-4">
                <div className={cn(
                    "inline-block px-2 py-0.5 border-2 border-black text-xs font-black uppercase mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                    project.status === 'Ship' ? "bg-[#00FF94]" : "bg-[#FFD600]"
                )}>
                    {project.status}
                </div>
                <h3 className="text-2xl font-black leading-tight uppercase mb-2 text-black break-words pr-16">{project.name}</h3>
                <p className="text-sm font-medium text-gray-600 line-clamp-3 mb-4 font-mono leading-relaxed">
                    {project.metrics || "No description provided."}
                </p>
            </div>

            <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech_stack.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-[#F3C5D8] border-2 border-black text-[10px] font-bold uppercase tracking-wide">
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="flex gap-4 border-t-2 border-black pt-4">
                    {project.github_url && (
                        <a href={project.github_url} className="flex items-center gap-2 font-bold hover:underline decoration-2 decoration-black">
                            <Github size={18} /> Code
                        </a>
                    )}
                    {project.demo_url && (
                        <a href={project.demo_url} className="flex items-center gap-2 font-bold hover:underline decoration-2 decoration-black">
                            <Globe size={18} /> Live Demo
                        </a>
                    )}
                    {!project.github_url && !project.demo_url && (
                        <span className="text-gray-400 font-mono text-xs italic">No links added</span>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
