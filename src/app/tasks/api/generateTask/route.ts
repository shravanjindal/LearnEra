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

async function callGroq(messages: any[]) {
  const response = await fetch(`${GROQ_INFERENCE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Groq API Error:", response.status, errorText);
    throw new Error(`Groq call failed: ${response.status}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "";
}

export async function POST(req: NextRequest) {
  try {
    const { skill, topic, description }: TaskInput = await req.json();

    // Step 1: Generate learning plan as free text
    const inputPrompt = `Given the user's learning request:
    Skill: ${skill}
    Topic: ${topic}
    Description: ${description}

    Generate a structured Content, task, and few links with:
    1. Content: Theory, syntax, examples, best practices
    2. Task: A coding exercise to practice the concept
    3. Links: At least 3 useful resources

    The task should be of the form {
      "topic": "Topic Name",
      "content": "Detailed explanation",
      "task": "Coding task",
      "links": ["Link 1", "Link 2", "Link 3"]
    }
    
    You just have to create one such task, to understand the topic clearly. The objective is that user reads the content to understand the topic, then does the task to practice the concept, and finally checks the links for more information.
    `;

    const learningPlan = await callGroq([
      {
        role: "system",
        content: "You are a helpful assistant that creates detailed task with theory and links to help user understand a give topic.",
      },
      {
        role: "user",
        content: inputPrompt,
      },
    ]);

    // Step 2: Parse the free text into structured JSON
    const jsonParsePrompt = `Convert the following task into JSON format strictly as:
    {
      "topic": "Topic Name",
      "content": "Detailed explanation",
      "task": "Coding task",
      "links": ["Link 1", "Link 2", "Link 3"]
    }

    Text:
    ${learningPlan}`;
    const parsedJsonText = await callGroq([
      {
        role: "system",
        content: "You are a helpful assistant that only returns valid JSON with no explanation or markdown.",
      },
      {
        role: "user",
        content: jsonParsePrompt,
      },
    ]);
    console.log("Parsed JSON:", parsedJsonText);
    let generatedTask;
    try {
      generatedTask = JSON.parse(parsedJsonText);
    } catch (err) {
      console.error("Failed to parse JSON:", parsedJsonText);
      return NextResponse.json({ error: "Could not parse JSON output" }, { status: 500 });
    }

    if (!generatedTask || Object.keys(generatedTask).length === 0) {
      return NextResponse.json({ error: "Empty task generated" }, { status: 500 });
    }

    const newTask = new Task({ ...generatedTask, skill });
    const saved = await newTask.save();
    return NextResponse.json(saved);
  } catch (err) {
    console.error("Task generation error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
