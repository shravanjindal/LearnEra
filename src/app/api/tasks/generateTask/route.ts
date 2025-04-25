import dbConnect from "@/lib/dbConnect";
import { Task } from "@/models/task";
import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY_FREE;
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
    const inputPrompt = `The user wants to learn a specific programming concept. Please generate a structured learning unit based on their request:

    - **Skill**: ${skill}
    - **Topic**: ${topic}
    - **Description**: ${description}
    
    Create one learning module in the following JSON format:
    
    {
      "topic": "Name of the topic",
      "content": "A well-structured markdown section covering theory, syntax, examples, and best practices for the topic.",
      "task": "A coding exercise that allows the user to practice and reinforce their understanding of the topic.",
      "links": [
        "A relevant and high-quality resource link 1",
        "Link 2",
        "Link 3"
      ]
    }
    
    ### Guidelines:
    1. **Content** should be written in markdown and include:
      - A clear explanation of the concept (theory)
      - Syntax and common patterns
      - Real-world examples
      - Best practices or common pitfalls
    
    2. **Task** should be:
      - Practical and relevant to the topic
      - Clearly explained with expected outcomes
      - Beginner-friendly unless specified otherwise
    
    3. **Links**:
      - Only include links to **reputable, publicly accessible sources** such as:
        - Official documentation (e.g., MDN, React Docs, Python Docs, Node.js Docs)
        - Educational platforms (e.g., freeCodeCamp.org, GeeksforGeeks, W3Schools, CSS-Tricks)
        - Developer blogs (e.g., Dev.to, Medium posts by recognized authors or organizations)
        - Research papers (e.g., arXiv.org, Google Scholar, academic.edu)
        - Do **not** include: YouTube links, fake or placeholder links, login-required content, or unrelated material.
    
    The goal is for the user to read the content to understand the topic, complete the task to apply their knowledge, and use the links for deeper exploration.
    
    You must return only JSON without any additional text or explanation. 
    The JSON should be well-structured and valid. If you cannot generate a task, return an empty JSON object {}. 
    The JSON should not contain any new lines or extra spaces. 
    The JSON should be parsable without any errors. The JSON should be in a single line without any indentation. 
    There should be no bad escaping characters. I will parse this text using json.parse() in JavaScript. 
    It should have good UI when wrapped in a <ReactMarkdown> component.`;
    


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
    console.log(learningPlan);
    let sanitizedLearningPlan = learningPlan.replace(/\n/g, '').replace(/\r/g, '');
    
    let generatedTask;
    try {
      generatedTask = JSON.parse(sanitizedLearningPlan.trim());
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      return NextResponse.json({ error: "Could not parse JSON output" }, { status: 500 });
    }

    if (!generatedTask || Object.keys(generatedTask).length === 0) {
      return NextResponse.json({ error: "Empty task generated" }, { status: 500 });
    }
    dbConnect();
    const newTask = new Task({ ...generatedTask, skill });
    const saved = await newTask.save();
    return NextResponse.json(saved);
  } catch (err) {
    console.error("Task generation error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
