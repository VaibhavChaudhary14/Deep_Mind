const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Role: Strategic Career Coach.
Action: Generate the FIRST multiple-choice question to determine the user's specific target Job Role (e.g., Frontend Engineer, Data Scientist, Product Manager).
Format Requirement: Return strictly a valid JSON object with {"question": "...", "options": ["...", "...", "...", "..."]}
Keep the question short and direct. Maximum 4 options.`;

    try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        console.log("RAW GEMINI RESPONSE ->", text);
        const data = JSON.parse(text);
        console.log("PARSED DATA ->", data);
    } catch (e) {
        console.error("ERROR ->", e);
    }
}
test();
