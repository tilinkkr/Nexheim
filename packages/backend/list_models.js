const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const fs = require('fs');
const logStream = fs.createWriteStream('results.log', { flags: 'a' });

function log(msg) {
    console.log(msg);
    logStream.write(msg + '\n');
}

async function listModels() {
    try {
        log("Testing gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        log("gemini-pro success: " + result.response.text());
    } catch (error) {
        log("gemini-pro failed: " + error.message);
    }

    try {
        log("Testing gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        log("gemini-1.5-flash success: " + result.response.text());
    } catch (error) {
        log("gemini-1.5-flash failed: " + error.message);
    }

    try {
        log("Testing gemini-1.0-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent("Hello");
        log("gemini-1.0-pro success: " + result.response.text());
    } catch (error) {
        log("gemini-1.0-pro failed: " + error.message);
    }

    try {
        log("Testing gemini-1.5-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent("Hello");
        log("gemini-1.5-pro success: " + result.response.text());
    } catch (error) {
        log("gemini-1.5-pro failed: " + error.message);
    }
}

listModels();
