import { NextRequest, NextResponse } from "next/server";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

interface UserData {
  skill: string;
  topicsLearnt: string[];
  tasksDone: string[];
  purpose: string;
}

export async function POST(req: NextRequest) {
  try {
    const { user_data }: { user_data: UserData } = await req.json();

    const inputText = `Given the user's learning progress:
    Skill: ${user_data.skill}
    Topics Completed: ${user_data.topicsLearnt.join(", ")}
    Recent Tasks: ${user_data.tasksDone.join(", ")}
    Learning Goal: ${user_data.purpose}
    
    Generate 2-3 logical next sub-topics that:
    1. Build directly on their most recently completed topics
    2. Represent incremental, achievable next steps
    3. Follow a natural learning progression toward their goal
    
    For example, if they just completed "CSS Flexbox", suggest "CSS Grid" rather than jumping to "Advanced JavaScript".
    
    Return your recommendations as a JSON array:
    [
      {
        "topic": "Topic Name",
        "description": "Brief explanation of what this topic covers and why it's valuable for their goal",
        "prerequisites": ["Any specific prerequisite knowledge"]
      },
      ...
    ]`;

    const response = await fetch("https://api-inference.huggingface.co/models/google/gemma-3-27b-it", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: inputText,
        parameters: { max_length: 500 },
      }),
    });

    if (!response.ok) {
      const responseBody = await response.text();
      console.error("Hugging Face API Error:", response.status, responseBody);
      throw new Error(`Failed to fetch from Hugging Face: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data?.[0]?.generated_text || "";

    // console.log("Raw Generated Text:", generatedText);

    // Extract JSON array (strict regex)
    const topicsRegex = /\[\s*\{[\s\S]*?\}\s*\]/;
    const match = generatedText.match(topicsRegex);

    let topics = [];

    if (match) {
      try {
        topics = JSON.parse(match[0]); // Parse the valid JSON
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.error("Extracted JSON Attempt:", match[0]);
        return NextResponse.json({ error: "Failed to parse generated topics" }, { status: 500 });
      }
    }

    if (!Array.isArray(topics) || topics.length === 0) {
      console.error("No valid topics found.");
      return NextResponse.json({ error: "No topics generated" }, { status: 500 });
    }

    console.log("Extracted Topics:", topics);
    return NextResponse.json({ topics });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json({ error: "Failed to generate topics" }, { status: 500 });
  }
}
