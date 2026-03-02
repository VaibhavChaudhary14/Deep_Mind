"use client"

import * as React from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { Save, User as UserIcon, Edit2, CheckCircle2 } from "lucide-react"
import { Shell } from "@/components/layout/shell"
import { syncData } from "@/lib/sync"

export default function AdminPage() {
    const settings = useLiveQuery(() => db.settings.orderBy('id').first())
    const [formData, setFormData] = React.useState({
        username: '',
        role: '',
        level: '',
        theme: 'light' as any
    })
    const [isSaving, setIsSaving] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const [showSuccess, setShowSuccess] = React.useState(false)

    React.useEffect(() => {
        if (settings) {
            setFormData({
                username: settings.username || '',
                role: settings.role || '',
                level: settings.level || '',
                theme: settings.theme || 'light'
            })
        }
    }, [settings])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            if (settings?.id) {
                await db.settings.update(settings.id, {
                    username: formData.username,
                    role: formData.role,
                    level: formData.level,
                    theme: formData.theme
                })
            } else {
                await db.settings.add({
                    username: formData.username,
                    role: formData.role,
                    level: formData.level,
                    theme: formData.theme,
                    streak: 0,
                    execution_score: 0,
                    deep_work_mode: false
                })
            }
            // Wait for Dexie operation to complete
            setTimeout(async () => {
                // Instantly sync the new profile data up to Supabase
                await syncData()

                setIsSaving(false)
                setIsEditing(false)

                // Show a quick success flash
                setShowSuccess(true)
                setTimeout(() => setShowSuccess(false), 2000)
            }, 300)

        } catch (error) {
            console.error("Failed to save settings:", error)
            setIsSaving(false)
        }
    }

    if (!settings && settings !== undefined) {
        return <div className="p-8 font-mono animate-pulse">Loading Profile Core...</div>
    }

    return (
        <Shell>
            <div className="max-w-3xl mx-auto space-y-6">
                <header className="pb-6 mb-8 border-b-4 border-black flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-black flex items-center justify-center text-white">
                            <UserIcon size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight font-mono uppercase">Admin Profile</h1>
                            <p className="text-gray-500 font-bold mt-2">Manage your core identity parameters and configuration.</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-white border-4 border-black px-6 py-3 font-black font-mono uppercase text-sm shadow-[4px_4px_0_#000] hover:bg-[#FFD600] flex items-center gap-2 transition-all active:translate-y-[2px] active:shadow-none"
                        >
                            <Edit2 size={16} /> Edit Profile
                        </button>
                    )}
                </header>

                <form onSubmit={handleSave} className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_#000] space-y-6">

                    {showSuccess && (
                        <div className="bg-[#00FF94] border-4 border-black p-4 font-bold font-mono text-center flex items-center justify-center gap-2">
                            <CheckCircle2 size={20} /> Settings Saved and Synced Successfully
                        </div>
                    )}

                    <div>
                        <label className="font-bold font-mono text-xs uppercase block mb-2 text-gray-500">Codename/Username</label>
                        {isEditing ? (
                            <input
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full bg-[#FBF9F1] border-4 border-black p-4 font-bold font-mono focus:bg-white focus:outline-none transition-colors"
                                placeholder="e.g. John Doe"
                            />
                        ) : (
                            <div className="w-full bg-gray-50 border-4 border-black p-4 font-bold font-mono text-lg">
                                {formData.username || 'Not set'}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="font-bold font-mono text-xs uppercase block mb-2 text-gray-500">Current Role</label>
                            {isEditing ? (
                                <input
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-[#FBF9F1] border-4 border-black p-4 font-bold font-mono focus:bg-white focus:outline-none transition-colors"
                                    placeholder="e.g. Frontend Engineer"
                                />
                            ) : (
                                <div className="w-full bg-gray-50 border-4 border-black p-4 font-bold font-mono text-lg">
                                    {formData.role || 'Not set'}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="font-bold font-mono text-xs uppercase block mb-2 text-gray-500">Seniority Level</label>
                            {isEditing ? (
                                <input
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    className="w-full bg-[#FBF9F1] border-4 border-black p-4 font-bold font-mono focus:bg-white focus:outline-none transition-colors"
                                    placeholder="e.g. Mid-Level"
                                />
                            ) : (
                                <div className="w-full bg-gray-50 border-4 border-black p-4 font-bold font-mono text-lg">
                                    {formData.level || 'Not set'}
                                </div>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="pt-6 border-t-4 border-black border-dashed flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="w-1/3 bg-gray-200 text-black font-black uppercase font-mono px-8 py-5 border-4 border-black hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-2/3 bg-[#FFD600] text-black font-black uppercase font-mono px-8 py-5 border-4 border-black hover:bg-black hover:text-[#FFD600] transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSaving ? <span className="animate-spin">⏳</span> : <Save size={24} />}
                                Save & Sync
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </Shell>
    )
}
