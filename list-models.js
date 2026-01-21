/* eslint-disable @typescript-eslint/no-require-imports */
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    // For some reason the library might not expose listModels directly on the main class or it's on the client.
    // Actually, the easiest way to debug implies checking what models *are* available if the standard ones fail.
    // But standard SDK usage:
    try {
        // Direct HTTP call might be easier if SDK is obscure about listing
        const key = process.env.GOOGLE_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();
        console.log("Available Models:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
