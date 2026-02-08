"use server"

import { aiModel } from "@/lib/ai"

export async function generateColdEmail(company: string, recipient: string, role: string, myProfile: string) {
    try {
        const prompt = `
        Act as an elite career strategist. Draft a cold email for a high-value opportunity.
        
        Target: ${recipient} at ${company}
        Role: ${role}
        My Background: ${myProfile}
        
        Output Structure (JSON):
        {
          "subject_lines": ["Option A (Creative)", "Option B (Direct)", "Option C (Value-Driven)"],
          "hook": "A strong opening sentence that grabs attention immediately.",
          "value_prop": "The core argument of why I am the best fit.",
          "call_to_action": "A low-friction closing ask.",
          "full_body": "The complete, cohesive email draft."
        }
        
        Tone: Professional, confident, concise (under 150 words).
        RETURN ONLY VALID JSON.
        `

        const result = await aiModel.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()

        return { success: true, data: JSON.parse(cleanText) }
    } catch (error) {
        console.error("AI Generation Error:", error)
        return { success: false, error: "Failed to generate email." }
    }
}
