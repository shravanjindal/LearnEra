import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY_FREE;
const GROQ_INFERENCE = process.env.GROQ_INFERENCE;
const GROQ_MODEL = process.env.GROQ_MODEL;

export async function POST(req: NextRequest) {
    try {
      const { role, skill, learningGoal, currentLevel } = await req.json();
  
      const inputText = `
  You are a personalized learning assistant helping users progress in their skill development journey.
  
  Based on the following user profile:
  - Role: ${role}
  - Skill: ${skill}
  - Learning Goal: ${learningGoal}
  - Current Level: ${currentLevel}
  
  Your task is to suggest 3-4 logical sub-topics for the user to upskill in the field of "${skill}". The recommendations should:
  
  1. Build directly on the user's current level
  2. Be achievable, incremental next steps
  3. Follow a natural progression toward the learning goal
  4. Be relevant to the user's role and aspirations
  5. Cover different concepts of the skill (not just specific areas)
  6. Include one fundamental topic also.
  
  Respond with a JSON array in the following format:
  [
    {
      "skill": "${skill}",
      "topic": "Sub-topic Name",
      "description": "What this topic covers and how it supports the user's goal",
      "prerequisites": ["List of prerequisite concepts or leave empty"]
    },
    ...
  ]
  
  You must return only JSON without any additional text or explanation.
  The JSON must be valid, in a single line, with no bad escaping characters or extra spaces.
      `;
  
      const response = await fetch(`${GROQ_INFERENCE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that suggests logical next learning topics based on a user's current skill level and goals.",
            },
            {
              role: "user",
              content: inputText,
            },
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });
  
      if (!response.ok) {
        const responseBody = await response.text();
        console.error("Groq API Error:", response.status, responseBody);
        throw new Error(`Groq API error: ${response.status}`);
      }
  
      const data = await response.json();
      const generatedText = data?.choices?.[0]?.message?.content || "";
  
      const sanitized = generatedText.replace(/\n/g, '').replace(/\r/g, '').trim();
  
      let generatedTopics;
      try {
        generatedTopics = JSON.parse(sanitized);
        return NextResponse.json({ generatedTopics });
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        return NextResponse.json({ error: "Could not parse Groq output" }, { status: 500 });
      }
    } catch (error) {
      console.error("POST route error:", error);
      return NextResponse.json({ error: "Failed to generate topics" }, { status: 500 });
    }
  }
  