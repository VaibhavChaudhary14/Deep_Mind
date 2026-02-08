"use client"

import * as React from "react"
import { db, Project } from "@/lib/db"
import { AnimatePresence } from "framer-motion"
import { Save, Rocket } from "lucide-react"
import { Modal } from "@/components/ui/modal"

interface ProjectModalProps {
    isOpen: boolean
    onClose: () => void
    projectToEdit?: Project
}

export function ProjectModal({ isOpen, onClose, projectToEdit }: ProjectModalProps) {
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [status, setStatus] = React.useState<Project['status']>("Idea")
    const [techStack, setTechStack] = React.useState("")
    const [githubUrl, setGithubUrl] = React.useState("")
    const [demoUrl, setDemoUrl] = React.useState("")

    React.useEffect(() => {
        if (projectToEdit) {
            setTitle(projectToEdit.name) // Note: Interface says 'name' but previous mock used 'title'. Checking db.ts... interface says 'name'.
            setDescription(projectToEdit.metrics || "") // Project interface uses 'metrics' for text? No, looking closely at db.ts... Project has 'name', 'status', 'tech_stack', 'hire_signal', 'checklist', 'metrics'.
            // Wait, let's re-verify db.ts Project interface.
            // checking...
            // export interface Project { id?: number; name: string; status: 'Idea' | 'Build' | 'Polish' | 'Ship' | 'Archived'; tech_stack: string[]; ... }
            // The ProjectBoard used 'title' and 'description'. It seems I might have a mismatch between the seed data in Board and the DB interface.
            // I will adhere to the DB Interface from db.ts: name, status, tech_stack.
            // I'll treat 'metrics' as the description for now or add a description field to DB if needed.
            // Let's assume 'metrics' is description-like or adding description to DB is better.
            // For now, I'll map 'description' to 'metrics' to avoid DB schema change unless essential. 
            // Actually, 'metrics' implies numbers. Let's add 'description' to DB schema in next step if checking db.ts shows it missing.
            // Reviewing db.ts content from previous turn...
            // interface Project { id?, name, status, tech_stack, github_url, demo_url, hire_signal, checklist, metrics, last_updated }
            // It lacks 'description'. I should add 'description' to db.ts first.
            setTechStack(projectToEdit.tech_stack.join(", "))
            setGithubUrl(projectToEdit.github_url || "")
            setDemoUrl(projectToEdit.demo_url || "")
        } else {
            setTitle("")
            setDescription("")
            setStatus("Idea")
            setTechStack("")
            setGithubUrl("")
            setDemoUrl("")
        }
    }, [projectToEdit, isOpen])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        const stackArray = techStack.split(",").map(s => s.trim()).filter(Boolean)

        const projectData = {
            name: title,
            status,
            tech_stack: stackArray,
            github_url: githubUrl,
            demo_url: demoUrl,
            hire_signal: false,
            checklist: { readme: false, demo: false, metrics: false, social: false },
            metrics: description, // Using metrics as description for now
            last_updated: new Date()
        }

        if (projectToEdit?.id) {
            await db.projects.update(projectToEdit.id, projectData)
        } else {
            await db.projects.add(projectData as any)
        }
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    title={projectToEdit ? "Edit Protocol" : "New Protocol"}
                    headerColor="bg-[#00FF94]"
                >
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="font-bold font-mono text-xs uppercase block mb-1">Project Name</label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                                placeholder="e.g. Chaos GPT"
                                required
                            />
                        </div>

                        <div>
                            <label className="font-bold font-mono text-xs uppercase block mb-1">Status</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value as any)}
                                className="w-full border-2 border-black p-3 font-bold outline-none focus:bg-[#E0F2E9]"
                            >
                                <option value="Idea">Idea</option>
                                <option value="Build">Build</option>
                                <option value="Polish">Polish</option>
                                <option value="Ship">Ship</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-bold font-mono text-xs uppercase block mb-1">Description / Metrics</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full border-2 border-black p-3 font-medium outline-none focus:bg-[#E0F2E9] h-24 resize-none"
                                placeholder="What does this protocol do?"
                            />
                        </div>

                        <div>
                            <label className="font-bold font-mono text-xs uppercase block mb-1">Tech Stack (comma separated)</label>
                            <input
                                value={techStack}
                                onChange={e => setTechStack(e.target.value)}
                                className="w-full border-2 border-black p-3 font-mono text-sm outline-none focus:bg-[#E0F2E9]"
                                placeholder="Next.js, Python, LangChain..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-bold font-mono text-xs uppercase block mb-1">Github URL</label>
                                <input
                                    value={githubUrl}
                                    onChange={e => setGithubUrl(e.target.value)}
                                    className="w-full border-2 border-black p-3 text-sm outline-none focus:bg-[#E0F2E9]"
                                    placeholder="https://github.com/..."
                                />
                            </div>
                            <div>
                                <label className="font-bold font-mono text-xs uppercase block mb-1">Demo URL</label>
                                <input
                                    value={demoUrl}
                                    onChange={e => setDemoUrl(e.target.value)}
                                    className="w-full border-2 border-black p-3 text-sm outline-none focus:bg-[#E0F2E9]"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white font-mono font-bold uppercase py-4 border-2 border-transparent hover:bg-[#FF5C00] hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            <Save size={18} /> {projectToEdit ? "Update System" : "Initialize System"}
                        </button>
                    </form>
                </Modal>
            )}
        </AnimatePresence>
    )
}
