import OpenAI from 'openai';

// Initialize OpenAI client
// Note: In a production app, you should use a backend proxy to protect your API key.
// For this MVP/Hackathon, we'll use client-side instantiation with a user-provided key or env var.
// We'll use the dangerouslyAllowBrowser option.

export const generateUrbanLegend = async (apiKey: string, context: string = "Tokyo") => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  const prompt = `
    Generate a short, creepy, and surreal urban legend about a specific location in ${context}.
    The story should feel like a "glitch in reality" or a "secret hidden in plain sight".
    Keep it under 200 characters.
    Style: Cyberpunk, SCP Foundation, Creepypasta.
    Output ONLY the story text.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an AI that narrates the hidden, darker side of reality." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 100,
    });

    return response.choices[0].message.content || "The signal is too weak... reality is stable here.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to breach the system.");
  }
};
