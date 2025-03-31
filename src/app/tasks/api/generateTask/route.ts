import { NextRequest, NextResponse } from "next/server";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

interface TaskInput {
  skill: string;
  topic: string;
  description: string;
}

export async function POST(req: NextRequest) {
  try {
    const { skill, topic, description }: TaskInput = await req.json();

    const inputText = `Given the user's learning request:
    Skill: ${skill}
    Topic: ${topic}
    Description: ${description}

    Generate a structured learning plan with:
    1. **Content** - A detailed explanation of the topic, covering the theory, syntax, examples, and best practices.
    2. **Task** - A coding exercise that allows the user to practice this concept.
    3. **Links** - At least 3 useful links (docs, tutorials, articles) for deeper learning.

    Return the response in **JSON format**:
    {
      "topic": "Topic Name",
      "content": "Detailed explanation of the topic, including theory, syntax, examples, and best practices.",
      "task": "A small or medium coding exercise to practice the topic.",
      "links": ["Helpful resource 1", "Helpful resource 2", "Helpful resource 3"]
    }`;

    const response = await fetch("https://api-inference.huggingface.co/models/google/gemma-3-27b-it", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: inputText,
        parameters: { max_length: 1000 },
      }),
    });

    if (!response.ok) {
      const responseBody = await response.text();
      console.error("Hugging Face API Error:", response.status, responseBody);
      throw new Error(`Failed to fetch from Hugging Face: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data?.[0]?.generated_text || "";

    // Extract JSON using a strict regex pattern
    const jsonRegex = /\{\s*"topic"\s*:\s*"[^"]*"\s*,\s*"content"\s*:\s*"[^"]*"\s*,\s*"task"\s*:\s*"[^"]*"\s*,\s*"links"\s*:\s*\[\s*"[^"]*"\s*(?:,\s*"[^"]*")*\s*\]\s*\}/;
    const match = generatedText.match(jsonRegex);

    let generatedTask = {};

    if (match) {
      try {
        generatedTask = JSON.parse(match[0]); // Parse the valid JSON
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.error("Extracted JSON Attempt:", match[0]);
        return NextResponse.json({ error: "Failed to parse generated task" }, { status: 500 });
      }
    }

    if (!generatedTask || Object.keys(generatedTask).length === 0) {
      console.error("No valid task generated.");
      return NextResponse.json({ error: "No task generated" }, { status: 500 });
    }

    console.log("Generated Task:", generatedTask);
    return NextResponse.json(generatedTask);
  } catch (error) {
    console.error("Error generating task:", error);
    return NextResponse.json({ error: "Failed to generate task" }, { status: 500 });
  }
}
