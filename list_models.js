const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: 'packages/backend/.env' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        // Note: The Node.js SDK might not expose listModels directly on genAI instance easily without looking at docs.
        // But usually it's on the model manager or similar.
        // Actually, for this SDK version, we might not have listModels easily accessible.
        // Let's try a simple generation with 'gemini-pro' again but log everything.

        // Wait, let's try to use the model that IS working in the other endpoint?
        // I assumed masumi-chat works. Let's test masumi-chat!

        console.log("Testing gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("gemini-pro success:", result.response.text());
    } catch (error) {
        console.error("gemini-pro failed:", error.message);
    }

    try {
        console.log("Testing gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.5-flash success:", result.response.text());
    } catch (error) {
        console.error("gemini-1.5-flash failed:", error.message);
    }
}

listModels();
