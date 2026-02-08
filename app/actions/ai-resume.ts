"use server"

import { aiModel } from "@/lib/ai"

export async function generateResumePoints(skill: string, level: string, project: string) {
    try {
        const prompt = `
        Act as an expert Resume Writer for elite tech roles (FAANG, HFT, AI Labs).
        Create 3 distinct, high-impact resume bullet points based on:
        Skill: ${skill} (Level: ${level})
        Context: ${project}
        
        Output Structure (JSON Array):
        [
          {
            "action": "Strong Verb (e.g. Architected, Engineered)",
            "impact": "The key metric or result (e.g. reduced latency by 40%)",
            "detail": "The technical implementation details",
            "full_point": "The complete, polished bullet point ready for a resume"
          }
        ]
        
        Requirements:
        - Be aggressive with metrics and engineering terminology.
        - Use "Cyber/High-Performance" tone.
        - RETURN ONLY VALID JSON.
        `

        const result = await aiModel.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Clean markdown
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()

        return { success: true, data: JSON.parse(cleanText) }
    } catch (error) {
        console.error("AI Generation Error:", error)
        return { success: false, error: "Failed to generate resume points." }
    }
}
