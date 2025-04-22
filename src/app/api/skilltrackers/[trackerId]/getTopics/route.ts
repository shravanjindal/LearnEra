import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { SkillTracker } from "@/models/skillTracker";
const GROQ_API_KEY = process.env.GROQ_API_KEY_FREE;
const GROQ_INFERENCE = process.env.GROQ_INFERENCE;
const GROQ_MODEL = process.env.GROQ_MODEL;


export async function GET(req: NextRequest,
  context: { params: Promise<{ trackerId: string }> }
) {
  try {
    const { trackerId } = await context.params;
    await dbConnect();
    const tracker_data = await SkillTracker.findById(trackerId)
    .populate("userId") // Populate the top-level userId
    .populate({
      path: "tasksDone.taskId", // Go into tasksDone array and populate taskId
      select: "task",           // Only select the 'task' field from Task
    });
    
    const inputText = `You are a personalized learning assistant helping users progress in their skill development journey.

    Based on the following user profile:
    - Learning Goal: ${tracker_data.userId.purpose.join(", ")}
    - User's Role : ${tracker_data.userId.currentRole}
    ------------------------------------------------------------------------------------------------------------------------------------------
    - Recently Completed Tasks:
    ${tracker_data.tasksDone
  .slice(-5) // get last 5 tasks
  .map((task:any, i:number) => 
    `#${i + 1}). """${task.taskDone || ''}"""\n\n(Topic: ${task.topic}, Rating: ${task.rating}, Feedback: "${task.feedback}")`
  )
  .join('\n############################################################################################')}
    ------------------------------------------------------------------------------------------------------------------------------------------
    Your task is to suggest 3-4 next logical sub-topics for user to upskill in the field of " ${tracker_data.skill}". The recommendations should:
    
    1. Build directly on recently completed topics
    2. Be achievable, incremental next steps
    3. Give priority to user feedback and ratings (e.g., suggest reinforcement for low-rated or negatively-reviewed topics)
    4. Follow a natural progression toward the user's learning goal
    5. Be relevant to the user's current role and aspirations
    6. Next topics should cover different concepts of the skill and not just focus on specific areas.
    7. Also generate a topic which is not related to the recently completed tasks but is a fundamental concept of the skill.
    Note : If no tasks are available in recently completed task,then start from the very basic fundamental concepts.

    
    Respond with a JSON array in the following format:
    [
      {
        "skill": ${tracker_data.skill},
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