
"use server"

import { aiModel } from "@/lib/ai"

export async function generateInterviewQuestion(role: string, level: string, history: string[]) {
    try {


        const prompt = `
        Act as a Senior Technical Interviewer at a FAANG company.
        Conduct a mock interview for a ${level} ${role}.
        
        Conversation History:
        ${history.join("\n")}
        
        Output Structure (JSON):
        {
          "feedback": "Constructive critique of the previous answer (if any). Be specific about what was good/bad. If start, leave empty.",
          "next_question": "The next technical question or follow-up.",
          "hint": "A subtle hint or keyword list if the user gets stuck (optional).",
          "difficulty": "Easy/Medium/Hard"
        }
        
        Rules:
        - Keep "next_question" concise (under 30 words).
        - "feedback" should be encouraging but rigorous.
        - RETURN ONLY VALID JSON.
        `

        // Use a chat session is redundant if we pass full history every time in prompt, 
        // but `aiModel.startChat` manages context better for long conversations. 
        // However, with JSON constraint, single-shot prompt with history might be more reliable for format.
        // Let's stick to single-shot with history injection for structure control.

        const result = await aiModel.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()

        return { success: true, data: JSON.parse(cleanText) }
    } catch (error) {
        console.error("AI Generation Error:", error)
        return { success: false, error: "Interview initialization failed." }
    }
}
