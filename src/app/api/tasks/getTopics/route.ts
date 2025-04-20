import { NextRequest, NextResponse } from "next/server";
const GROQ_API_KEY = process.env.GROQ_API_KEY_FREE;
const GROQ_INFERENCE = process.env.GROQ_INFERENCE;
const GROQ_MODEL = process.env.GROQ_MODEL;

interface TasksDone {
  taskDone : string;
  topic : string;
  rating : number;
  feedback : string;
}
interface UserData {
  skill: string;
  tasksDone: TasksDone[];
  purpose: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { user_data }: { user_data: UserData } = await req.json();
    const inputText = `You are a personalized learning assistant helping users progress in their skill development journey.

    Based on the following user profile:
    - Skill: ${user_data.skill}
    - Learning Goal: ${user_data.purpose.join(", ")}
    - Recently Completed Tasks:
    ${user_data.tasksDone.map((task, i) => `  ${i + 1}. "${task.taskDone}" (Topic: ${task.topic}, Rating: ${task.rating}, Feedback: "${task.feedback}")`).join('\n')}
    
    Your task is to suggest atleast 3 next logical sub-topics to learn. The recommendations should:
    
    1. Build directly on recently completed topics
    2. Be achievable, incremental next steps
    3. Give priority to user feedback and ratings (e.g., suggest reinforcement for low-rated or negatively-reviewed topics)
    4. Follow a natural progression toward the user's learning goal
    5. If no tasks are available, start from the very fundamental concepts of the skill
    
    Respond with a JSON array in the following format:
    [
      {
        "topic": "Sub-topic Name",
        "description": "What this topic covers and how it supports the user's goal",
        "prerequisites": ["List any specific prerequisite concepts, or leave empty if none"]
      },
      ...
    ]`;    

    const response = await fetch(`${GROQ_INFERENCE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: `${GROQ_MODEL}`, // or "llama3-70b-8192"
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that suggests logical next learning topics based on a user's recent progress.",
          },
          {
            role: "user",
            content: inputText,
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const responseBody = await response.text();
      console.error("Groq API Error:", response.status, responseBody);
      throw new Error(`Failed to fetch from Groq API: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data?.choices?.[0]?.message?.content || "";

    // Extract JSON from the response
    const jsonRegex = /\{\s*"topic"\s*:\s*"[^"]*"\s*,\s*"description"\s*:\s*"[^"]*"\s*,\s*"prerequisites"\s*:\s*\[\s*"[^"]*"\s*(?:,\s*"[^"]*")*\s*\]\s*\}/g;
    const matches = [...generatedText.matchAll(jsonRegex)];

    if (!matches || matches.length === 0) {
      console.error("No JSON pattern found in the generated text");
      return NextResponse.json({ error: "No topics generated" }, { status: 500 });
    }
    matches.shift();
    // console.log("Extracted JSON String:", matches);

    try {
      const topics = matches.map(match => JSON.parse(match));
      // console.log("Extracted Topics:", topics);
      return NextResponse.json({ topics });
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.error("Sanitized JSON String:", matches);
      return NextResponse.json({ error: "Failed to parse JSON" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json({ error: "Failed to generate topics" }, { status: 500 });
  }
}