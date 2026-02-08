"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { Activity, Clock, CheckCircle } from "lucide-react"

export function ActivityFeed() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        setLoading(true)
        // Fetch last 20 logs. 
        // Note: If you have foreign keys set up, you could do: .select('*, profiles(username)')
        // For now, we'll just show the logs.
        const { data } = await supabase
            .from('logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20)

        if (data) setLogs(data)
        setLoading(false)
    }

    return (
        <div className="space-y-6">
            <h3 className="font-black font-mono uppercase text-2xl flex items-center gap-2">
                <Activity className="text-blue-500" />
                Network Activity Stream
            </h3>

            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 min-h-[400px]">
                {loading ? (
                    <div className="text-center font-mono font-bold animate-pulse py-12">Intercepting Signals...</div>
                ) : (
                    <div className="space-y-4">
                        {logs.map((log) => (
                            <div key={log.id} className="flex items-start gap-4 p-4 border-b-2 border-dashed border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                                <div className="p-2 bg-black text-white rounded-full">
                                    <Clock size={16} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold font-mono text-sm uppercase">
                                            {log.focus_area || "General Task"}
                                        </p>
                                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {log.created_at ? formatDistanceToNow(new Date(log.created_at), { addSuffix: true }) : 'Just now'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Logged <span className="font-bold">{log.hours_studied}h</span> of deep work.
                                    </p>
                                    {log.tasks_completed && (
                                        <div className="mt-2 text-xs flex items-center gap-1 text-green-600 font-bold">
                                            <CheckCircle size={12} />
                                            Goals Accomplished
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {logs.length === 0 && (
                            <div className="text-center py-12 text-gray-400 font-mono font-bold">No recent activity detected.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
