import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { history } = await req.json();

        if (!history || history.length < 1) {
            return NextResponse.json({ error: "Missing required history" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const contextStr = history.map((item: any, i: number) => `Q${i + 1}: ${item.question}\nA: ${item.answer}`).join('\n');

        // Extract a "Role" from the first answer to use as the title
        const targetRole = history[0].answer;

        const prompt = `You are a brutal, highly-effective technical coach building a 90-day execution protocol for a client.
Their profile and goals, based on a strategic diagnostic:
${contextStr}

Output a structured JSON array of EXACTLY 90 objects, representing continuous daily tasks. 
Each object must have exactly these keys:
- day: number (1 to 90)
- title: string (A highly specific, actionable task for the day. Under 60 characters.)
- priority: string (Must be exactly 'High', 'Medium', or 'Low')

Do not include general advice. Make the tasks progressive (learning -> building -> shipping). 
Output ONLY valid JSON. No markdown formatting, no backticks. Just the raw array starting with [ and ending with ].`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();

        // Strip markdown code blocks if gemini adds them despite instructions
        if (text.startsWith('\`\`\`json')) {
            text = text.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
        } else if (text.startsWith('\`\`\`')) {
            text = text.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
        }

        const roadmap = JSON.parse(text);

        return NextResponse.json({ roadmap, targetRole });

    } catch (error) {
        console.error("AI Generate Error:", error);
        return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
    }
}
