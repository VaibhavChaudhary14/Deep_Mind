import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/dashboard/header"
import { ExportControls } from "@/components/features/settings/export-controls"
import { Settings as SettingsIcon } from "lucide-react"

export default function SettingsPage() {
    return (
        <Shell>
            <Header />

            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                <div className="neo-card bg-[#FFD600] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
                    <div className="p-3 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <SettingsIcon size={32} strokeWidth={3} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black font-mono uppercase tracking-tighter">System Config</h2>
                        <p className="font-bold font-mono text-sm">Manage data persistence and environment variables.</p>
                    </div>
                </div>

                <section className="neo-card bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-black font-mono uppercase mb-6 border-b-4 border-black pb-2 inline-block">Data Management</h3>
                    <ExportControls />
                </section>

                <section className="neo-card bg-red-50 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-black font-mono uppercase mb-6 text-red-600 border-b-4 border-red-600 pb-2 inline-block">Danger Zone</h3>
                    <div className="p-6 border-4 border-red-200 bg-red-100/50">
                        <h4 className="font-black font-mono text-lg mb-2 uppercase text-red-900">Nuke Database</h4>
                        <p className="font-bold font-mono text-sm text-red-800 mb-6">
                            This will result in catastrophic data loss. All logs, skills, and project artifacts will be purged.
                        </p>
                        <button
                            disabled
                            className="px-6 py-3 bg-red-600 text-white font-black font-mono uppercase border-4 border-black opacity-50 cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                            Execute Purge (Locked)
                        </button>
                    </div>
                </section>
            </div>
        </Shell>
    )
}
