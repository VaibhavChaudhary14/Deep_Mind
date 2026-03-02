import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { targetRole } = await req.json();

        if (!targetRole) {
            return NextResponse.json({ error: "Target role is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Role: Strategic Coach.
Target: Client wants to become a "${targetRole}".
Action: Ask exactly 2 short, simple, necessary questions to understand their current skill level and daily time capacity.
Format: Output only the 2 questions separated by a newline. Keep them very brief and direct.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ questions: text });

    } catch (error) {
        console.error("AI Clarify Error:", error);
        return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
    }
}
