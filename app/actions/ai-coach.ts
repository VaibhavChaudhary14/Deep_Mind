"use server"

import { aiModel } from "@/lib/ai"
import { db } from "@/lib/db"

interface CoachContext {
    targetRole: string;
    primarySkill: string;
    primaryProject: string;
    blockerDescription: string;
    recentConsistency: number; // e.g. out of 30 days
}

export async function diagnoseBlocker(context: CoachContext) {
    if (!process.env.GEMINI_API_KEY) {
        return { error: 'OpenAI API key not configured' }
    }

    try {
        const prompt = `
            You are a brutal, highly strategic career coach for elite software engineers. 
            Your client is currently in a 90-Day Sprint to become a ${context.targetRole}. 
            Their primary skill focus is ${context.primarySkill} and their main project is ${context.primaryProject}.
            Their recent consistency score is ${context.recentConsistency}/30.
            
            They have reported the following blocker/issue:
            "${context.blockerDescription}"

            RESPOND WITH:
            1. A brutal truth diagnosis (Why are they stuck? Is it technical, psychological, or an excuse?). Keep it under 2 sentences.
            2. A strategic unblocking pivot.
            3. 3 immediate, tiny actionable execution steps to regain momentum today.

            Format your response in plain text with clear headers (Truth, Pivot, Action). Do NOT write fluff. Be direct and hold them accountable.
        `;

        const result = await aiModel.generateContent(prompt);
        const text = result.response.text();

        return { success: true, analysis: text }
    } catch (error) {
        console.error('AI Coach Error:', error)
        return { success: false, error: 'Failed to diagnose blocker' }
    }
}
