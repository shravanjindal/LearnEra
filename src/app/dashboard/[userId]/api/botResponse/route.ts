import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY_FREE!;
const GROQ_INFERENCE = process.env.GROQ_INFERENCE!;
const GROQ_MODEL = process.env.GROQ_MODEL!;

export async function POST(req: NextRequest) {
  try {
    const { message, progressData, history }: { 
      message: string; 
      progressData: { skill: string; progress: number }[]; 
      history: { sender: string; text: string }[]; 
    } = await req.json();

    // Format the progress data to add it to the prompt
    const skillInfo = progressData.map(p => `- ${p.skill}: ${p.progress}% complete`).join("\n");

    // Format conversation history
    const context = history
      .map((msg) => `${msg.sender === "user" ? "User" : "Bot"}: ${msg.text}`)
      .join("\n");

    // Construct the full prompt for the bot, combining progress data and conversation history
    const prompt = `You're a motivational learning coach. The user is progressing in the following skills:\n\n${skillInfo}\n\nConversation so far:\n${context}\n\nUser: ${message}\nBot:`;

    const response = await fetch(GROQ_INFERENCE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a friendly, energetic AI coach who motivates learners based on their progress.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("GROQ API Error:", text);
      return NextResponse.json({ error: "GROQ API error" }, { status: 500 });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Bot response error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
