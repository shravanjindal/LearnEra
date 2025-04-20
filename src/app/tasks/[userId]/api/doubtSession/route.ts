import { Message } from "@/components/tasks/TutorChatbot";
import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_INFERENCE = process.env.GROQ_INFERENCE;
const GROQ_MODEL = process.env.GROQ_MODEL;

interface TaskData {
  _id: string;
  skill: string;
  topic: string;
  content: string;
  task: string;
  links: string[];
  createdAt: Date;
}

export async function POST(req: NextRequest) {
  try {
    const { message, context, input }: { message: Message[]; context: TaskData, input: String } = await req.json();
    const prompt = `You are a tutor chatbot helping a student with a specific task.

    Context:
    - Skill: ${context.skill}
    - Topic: ${context.topic}
    - Task: ${context.task}
    - Content: ${context.content}
    - Helpful Links: ${context.links.join(", ")}

    Conversation History of user and you:
    ${
      message.length === 5 
        ? message.slice(-4, -1).map(msg => `${msg.sender}: ${msg.text}`).join('\n') 
        : message.slice(0, -1).map(msg => `${msg.sender}: ${msg.text}`).join('\n')
    }

    > user messages are student messages
    > bot messages are your messages.

    User's Doubt:
    "${input}"

    Based on the content the user is studying and conversation history of user and you,
    provide a helpful and concise response to the user's doubt.`;


    const response = await fetch(`${GROQ_INFERENCE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: `${GROQ_MODEL}`,
        messages: [
          {
            role: "system",
            content: "You are an expert tutor assistant who provides clear, concise and encouraging help to students based on their current learning task.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error("GROQ API Error:", response.status, responseText);
      throw new Error("Failed to fetch from GROQ API");
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "I'm here to help, but I didn't catch that. Can you try rephrasing?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error in doubtSession route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
