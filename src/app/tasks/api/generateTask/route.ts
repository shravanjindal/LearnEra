import { Task } from "@/models/task";
import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_INFERENCE = process.env.GROQ_INFERENCE;
const GROQ_MODEL = process.env.GROQ_MODEL;

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

    const response = await fetch(`${GROQ_INFERENCE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: `${GROQ_MODEL}`, // or "llama3-70b-8192" for larger model
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates structured learning plans.",
          },
          {
            role: "user",
            content: inputText,
          }
        ],
        max_tokens: 1000, // increase if needed
        temperature: 0.7
      }),
    });


    if (!response.ok) {
      const responseBody = await response.text();
      console.error("Groq API Error:", response.status, responseBody);
      throw new Error(`Failed to fetch from Groq: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data?.choices?.[0]?.message?.content || "";

    // Regex to match JSON objects (same pattern but for multiple occurrences)
    const jsonRegex = /\{\s*"topic"\s*:\s*"[^"]*"\s*,\s*"content"\s*:\s*"[^"]*"\s*,\s*"task"\s*:\s*"[^"]*"\s*,\s*"links"\s*:\s*\[\s*"[^"]*"\s*(?:,\s*"[^"]*")*\s*\]\s*\}/g;

    // Extract all JSON matches
    const matches = [...generatedText.matchAll(jsonRegex)];
    let generatedTask = {};

    let extractedJson = matches[matches.length - 1]?.[0];

    if (extractedJson) {
      // Remove control characters except standard escapes
      extractedJson = extractedJson.replace(/[\x00-\x1F\x7F]/g, "");

      try {
        generatedTask = JSON.parse(extractedJson);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.error("Cleaned Extracted JSON Attempt:", extractedJson);
        return NextResponse.json({ error: "Failed to parse generated task" }, { status: 500 });
      }
    }
    if (!generatedTask || Object.keys(generatedTask).length === 0) {
      console.error("No valid task generated.");
      return NextResponse.json({ error: "No task generated" }, { status: 500 });
    }

    console.log("Generated Task:", generatedTask);
    const newTask = new Task({...generatedTask, skill});
    const addedTask = await newTask.save();
    return NextResponse.json(addedTask);
  } catch (error) {
    console.error("Error generating task:", error);
    return NextResponse.json({ error: "Failed to generate task" }, { status: 500 });
  }
}
