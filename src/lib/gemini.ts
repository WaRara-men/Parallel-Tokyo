import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
// Note: Even with the free tier, it's best practice to use a backend proxy.
// However, for this client-side demo, we will use the key directly.
// The user will need to provide a GOOGLE_API_KEY in their .env or Vercel settings.
// Gemini's free tier has rate limits but is free of charge.

export const generateUrbanLegend = async (apiKey: string, context: string = "Tokyo") => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Generate a short, creepy, and surreal urban legend about a specific location in ${context}.
    The story should feel like a "glitch in reality" or a "secret hidden in plain sight".
    Keep it under 200 characters.
    Style: Cyberpunk, SCP Foundation, Creepypasta.
    Output ONLY the story text. Do not include any intro or outro.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text || "The signal is too weak... reality is stable here.";
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to breach the system.");
  }
};
