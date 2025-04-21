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
  currentRole : string;
}

export async function POST(req: NextRequest) {
  try {
    const { user_data }: { user_data: UserData } = await req.json();
    const inputText = `You are a personalized learning assistant helping users progress in their skill development journey.

    Based on the following user profile:
    - Learning Goal: ${user_data.purpose.join(", ")}
    - User's Role : ${user_data.currentRole}
    ------------------------------------------------------------------------------------------------------------------------------------------
    - Recently Completed Tasks:
    ${user_data.tasksDone.map((task, i) => `  #${i + 1}). """${task.taskDone}""" \n\n (Topic: ${task.topic}, Rating: ${task.rating}, Feedback: "${task.feedback}")`).join('\n############################################################################################')}
    ------------------------------------------------------------------------------------------------------------------------------------------
    Your task is to suggest 3-4 next logical sub-topics for user to upskill in the field of " ${user_data.skill}". The recommendations should:
    
    1. Build directly on recently completed topics
    2. Be achievable, incremental next steps
    3. Give priority to user feedback and ratings (e.g., suggest reinforcement for low-rated or negatively-reviewed topics)
    4. Follow a natural progression toward the user's learning goal

    Note : If no tasks are available in recently completed task,then start from the very basic fundamental concepts.

    
    Respond with a JSON array in the following format:
    [
      {
        "topic": "Sub-topic Name",
        "description": "What this topic covers and how it supports the user's goal",
        "prerequisites": ["List any specific prerequisite concepts, or leave empty if none"]
      },
      ...
    ]

    You must return only JSON without any additional text or explanation. 
    The JSON should be well-structured and valid. If you cannot generate a task, return an empty JSON object {}. 
    The JSON should not contain any new lines or extra spaces. 
    The JSON should be parsable without any errors. The JSON should be in a single line without any indentation. 
    There should be no bad escaping characters. I will parse this text using json.parse() in JavaScript. 
    It should have good UI when wrapped in a <ReactMarkdown> component.`;    
    // console.log("prompt : " +inputText)
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
    // console.log("generated text : " + generatedText)

    let sanitizedLearningPlan = generatedText.replace(/\n/g, '').replace(/\r/g, '');
    
    let generatedTopics;
    try {
      generatedTopics = JSON.parse(sanitizedLearningPlan.trim());
      // console.log("topics : " + JSON.stringify(generatedTopics))
      return NextResponse.json({ generatedTopics });

    } catch (err) {
      console.error("Failed to parse JSON:", err);
      return NextResponse.json({ error: "Could not parse JSON output" }, { status: 500 });
    }

    // if (!generatedTopics || Object.keys(generatedTopics).length === 0) {
    //   return NextResponse.json({ error: "Empty topics generated" }, { status: 500 });
    // }
    // Extract JSON from the response
    // const jsonRegex = /\{\s*"topic"\s*:\s*"[^"]*"\s*,\s*"description"\s*:\s*"[^"]*"\s*,\s*"prerequisites"\s*:\s*\[\s*"[^"]*"\s*(?:,\s*"[^"]*")*\s*\]\s*\}/g;
    // const matches = [...generatedText.matchAll(jsonRegex)];

    // if (!matches || matches.length === 0) {
    //   console.error("No JSON pattern found in the generated text");
    //   return NextResponse.json({ error: "No topics generated" }, { status: 500 });
    // }
    // matches.shift();
    // console.log("Extracted JSON String:", matches);

    // try {
    //   const topics = matches.map(match => JSON.parse(match));
    //   // console.log("Extracted Topics:", topics);
    //   return NextResponse.json({ topics });
    // } catch (error) {
    //   console.error("Error parsing JSON:", error);
    //   console.error("Sanitized JSON String:", matches);
    //   return NextResponse.json({ error: "Failed to parse JSON" }, { status: 500 });
    // }
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json({ error: "Failed to generate topics" }, { status: 500 });
  }
}