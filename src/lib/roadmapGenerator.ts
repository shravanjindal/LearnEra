import { ChatOpenAI } from "@langchain/openai"; // Use ChatOpenAI for GPT-4
import { PromptTemplate } from "@langchain/core/prompts";

// Define and export types
export interface Resource {
  type: string;
  title: string;
  url: string;
}

export interface Topic {
  name: string;
  prerequisites: string[];
  resources: Resource[];
}

export interface Roadmap {
  topics: Topic[];
}

// Initialize ChatOpenAI LLM
const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
});

// Define the prompt template
const promptTemplate = new PromptTemplate({
  inputVariables: ["goal"],
  template: `
    You are an expert in creating learning roadmaps. For the goal "{{goal}}", generate a list of topics, their prerequisites, and learning resources in the following JSON format:

    {{
      "topics": [
        {{
          "name": "Topic Name",
          "prerequisites": ["Prerequisite Topic 1", "Prerequisite Topic 2"],
          "resources": [
            {{
              "type": "Article",
              "title": "Resource Title",
              "url": "https://example.com/resource"
            }}
          ]
        }}
      ]
    }}
  `,
});


// Function to generate roadmap
export async function generateRoadmap(goal: string): Promise<Roadmap> {
  try {
    // // Format the prompt with the goal
    // const prompt = await promptTemplate.format({ goal });
    // console.log("Prompt:", prompt); // Log the prompt for debugging

    // // Invoke the LLM with the prompt
    // const response = await llm.invoke(prompt);
    // console.log("LLM Response:", response); // Log the response for debugging

    // Parse the response content as JSON
    const roadmap = {
      "topics": [
        {
          "name": "Arrays",
          "prerequisites": [],
          "resources": [
            {
              "type": "Article",
              "title": "Introduction to Arrays",
              "url": "https://example.com/arrays"
            },
            {
              "type": "Video",
              "title": "Arrays Explained",
              "url": "https://example.com/arrays-video"
            }
          ]
        },
        {
          "name": "Linked Lists",
          "prerequisites": ["Arrays"],
          "resources": [
            {
              "type": "Article",
              "title": "Linked Lists Basics",
              "url": "https://example.com/linked-lists"
            },
            {
              "type": "Lab",
              "title": "Practice Linked Lists",
              "url": "https://example.com/linked-lists-lab"
            }
          ]
        },
        {
          "name": "Trees",
          "prerequisites": ["Linked Lists"],
          "resources": [
            {
              "type": "Article",
              "title": "Introduction to Trees",
              "url": "https://example.com/trees"
            },
            {
              "type": "Quiz",
              "title": "Trees Quiz",
              "url": "https://example.com/trees-quiz"
            }
          ]
        }
      ]
    } as Roadmap;
    return roadmap;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw new Error("Failed to generate roadmap.");
  }
}
