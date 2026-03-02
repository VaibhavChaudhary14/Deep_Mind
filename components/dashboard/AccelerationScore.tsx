"use client";

import { useAccelerationScore } from "@/hooks/use-acceleration-score";
import { Activity, Info } from "lucide-react";
import { Tooltip } from "react-tooltip";

export function AccelerationScore() {
    const {
        compositeScore,
        executionConsistency,
        deepWorkPercent,
        roadmapPercent,
        skillDelta
    } = useAccelerationScore();

    return (
        <div className="neo-card bg-[#FFD600] flex flex-col justify-between relative overflow-hidden h-full">
            <div className="flex justify-between items-start z-10">
                <span className="text-black font-black text-sm font-mono uppercase border-b-2 border-black pb-1 flex items-center gap-2">
                    Acceleration Score
                    <Info size={14} className="cursor-pointer" id="acceleration-tooltip" />
                </span>
                <Activity size={24} className="text-black" />
            </div>

            <div className="mt-4 z-10">
                <div className="text-5xl font-black font-mono tracking-tighter text-black">{compositeScore}</div>
                <div className="text-xs font-bold font-mono text-black mt-1">VELOCITY STABLE</div>
            </div>

            {/* Background flavor graphic */}
            <div className="absolute -bottom-4 -right-4 opacity-10">
                <Activity size={120} />
            </div>

            <Tooltip anchorSelect="#acceleration-tooltip" place="bottom" className="z-50 !bg-black !text-white !font-mono !font-bold !text-xs !p-3 !border-2 !border-white">
                <div className="space-y-2 uppercase">
                    <div>40% Execution: {Math.round(executionConsistency)}%</div>
                    <div>30% Deep Work: {Math.round(deepWorkPercent)}%</div>
                    <div>20% Roadmap: {roadmapPercent}%</div>
                    <div>10% Skill Delta: {skillDelta}%</div>
                </div>
            </Tooltip>
        </div>
    );
}
