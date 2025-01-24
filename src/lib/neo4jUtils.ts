import neo4j, { Driver, Session } from "neo4j-driver";
import { Roadmap } from "./roadmapGenerator";

// Initialize Neo4j driver
const driver: Driver = neo4j.driver(
  process.env.NEO4J_URI as string,
  neo4j.auth.basic(process.env.NEO4J_USER as string, process.env.NEO4J_PASSWORD as string)
);

// Function to create a new Neo4j instance for the user
export async function createNeo4jInstance(userId: string, roadmap: Roadmap): Promise<void> {
  const session: Session = driver.session();

  try {
    // Create topics and relationships
    for (const topic of roadmap.topics) {
      await session.run(
        `
        MERGE (t:Topic {name: $name})
        WITH t
        UNWIND $resources AS resource
        MERGE (r:Resource {url: resource.url})
        SET r.type = resource.type, r.title = resource.title
        MERGE (t)-[:HAS_RESOURCE]->(r)
        WITH t
        UNWIND $prerequisites AS prereq
        MERGE (p:Topic {name: prereq})
        MERGE (p)-[:PREREQUISITE {weight: 0}]->(t)
        `,
        {
          name: topic.name,
          resources: topic.resources || [], // Array of resource objects
          prerequisites: topic.prerequisites || [],
        }
      );
    }

    console.log("Neo4j instance created successfully!");
  } catch (error) {
    console.error("Error creating Neo4j instance:", error);
  } finally {
    await session.close();
  }
}