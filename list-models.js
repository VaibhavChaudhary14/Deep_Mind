
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load env vars if running locally with dotenv, or just expect process.env to be populated if run via next's context or manually
// For simplicity in this environment, I'll assume I need to pass the key or read it.
// I will read .env.local manually since this is a standalone script.
const fs = require('fs');
const path = require('path');

try {
    const envPath = path.resolve(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.log("Could not read .env.local, assuming env vars are set");
}

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Using Key:", process.env.GEMINI_API_KEY ? "Found" : "Missing");

    try {
        // For v1beta (default in some SDK versions)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // Using the manager to list specific models isn't directly on the model instance.
        // We need to access the listModels method via the client if exposed, or make a direct fetch.
        // The Node SDK exposes it via the GoogleGenerativeAI instance? No, it's usually on the class or via a separate manager.
        // Let's check the SDK docs pattern or just try a direct REST call to be sure.

        // Direct REST call is fail-safe.
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`));
        } else {
            console.log("No models found or error:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
