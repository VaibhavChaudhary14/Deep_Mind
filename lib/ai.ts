
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Falling back to 'gemini-flash-latest' (stable 1.5-flash) for better quota limits
export const aiModel = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
