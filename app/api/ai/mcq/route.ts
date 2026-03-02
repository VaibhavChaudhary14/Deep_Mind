import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { history } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        let prompt = "";
        const contextStr = history ? history.map((item: any, i: number) => `Q${i + 1}: ${item.question}\nA: ${item.answer}`).join('\n') : "";

        if (!history || history.length === 0) {
            prompt = `Role: Strategic Career Coach.
Action: Generate the FIRST multiple-choice question to determine the user's specific target Job Role (e.g., Frontend Engineer, Data Scientist, Product Manager).
Format Requirement: Return strictly a valid JSON object with {"question": "...", "options": ["...", "...", "...", "..."]}
Keep the question short and direct. Maximum 4 options.`;
        } else if (history.length === 1) {
            prompt = `Role: Strategic Career Coach.
Context: User wants to become a ${history[0].answer}.
Action: Generate the SECOND multiple-choice question to determine their target Post/Title level (e.g., Junior, Mid-Level, Senior, Staff/Lead).
Format Requirement: Return strictly a valid JSON object with {"question": "...", "options": ["...", "...", "...", "..."]}
Keep the question short and direct. Maximum 4 options.`;
        } else if (history.length === 2) {
            prompt = `Role: Strategic Career Coach.
Context:
${contextStr}
Action: Generate the THIRD multiple-choice question to assess their CURRENT previous experience in the relevant tech stack (e.g., Absolute Beginner, 1-2 Years, Solid Grasp, Expert).
Format Requirement: Return strictly a valid JSON object with {"question": "...", "options": ["...", "...", "...", "..."]}
Keep the question short and direct. Maximum 4 options.`;
        } else if (history.length === 3) {
            prompt = `Role: Strategic Career Coach.
Context:
${contextStr}
Action: Generate the FOURTH multiple-choice question to determine the level of Hardness/Intensity they want for this 90-day plan (e.g., Sustainable, Hard, Extreme, Absolute Brutal).
Format Requirement: Return strictly a valid JSON object with {"question": "...", "options": ["...", "...", "...", "..."]}
Keep the question short and direct. Maximum 4 options.`;
        }

        const result = await model.generateContent(prompt);
        let text = result.response.text();
        console.log("RAW GEMINI RESPONSE ->", text);

        const data = JSON.parse(text);

        return NextResponse.json({
            question: data.question,
            options: data.options
        });

    } catch (error) {
        console.error("AI MCQ error:", error)
        return NextResponse.json({ error: "Failed to generate question" }, { status: 500 })
    }
}
