import neo4j, { Driver, Session } from "neo4j-driver";
import { Roadmap } from "./roadmapGenerator";

// Initialize Neo4j driver
const driver: Driver = neo4j.driver(
  process.env.NEO4J_URI || "neo4j+s://c6fce008.databases.neo4j.io",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "your_password"
  )
);
// Function to create a new Neo4j instance for the user
export async function createNeo4jInstance(userId: string, roadmap: Roadmap): Promise<void> {
  const session: Session = driver.session();

  try {
    // Create topics and relationships
    for (const topic of roadmap.topics) {
      await session.run(
        `
        MERGE (t:Topic {name: $name, neo4jInstanceId: $neo4jInstanceId})
        WITH t
        UNWIND $resources AS resource
        MERGE (r:Resource {url: resource.url})
        SET r.type = resource.type, r.title = resource.title
        MERGE (t)-[:HAS_RESOURCE]->(r)
        WITH t
        UNWIND $prerequisites AS prereq
        MERGE (p:Topic {name: prereq, neo4jInstanceId: $neo4jInstanceId})
        MERGE (p)-[:PREREQUISITE {weight: 0}]->(t)
        `,
        {
          name: topic.name,
          resources: topic.resources || [],
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

export async function fetchRoadmap(neo4jInstanceId: string) {
  const session: Session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (t:Topic {neo4jInstanceId: $neo4jInstanceId})-[:PREREQUISITE]->(p:Topic)
      RETURN t.name AS topic, p.name AS prerequisite
      `,
      { neo4jInstanceId }
    );

    const roadmap = result.records.map((record) => ({
      topic: record.get("topic"),
      prerequisite: record.get("prerequisite"),
    }));

    return roadmap;
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    throw error;
  } finally {
    await session.close();
  }
}

export function transformRoadmapData(roadmap: { topic: string; prerequisite: string }[]) {
  const nodes = new Set<string>();
  const edges: { data: { id: string; source: string; target: string } }[] = [];

  roadmap.forEach((relation, index) => {
    nodes.add(relation.topic);
    nodes.add(relation.prerequisite);
    edges.push({
      data: {
        id: `e${index}`,
        source: relation.prerequisite,
        target: relation.topic,
      },
    });
  });

  return {
    nodes: Array.from(nodes).map((node) => ({
      data: { id: node, label: node },
    })),
    edges,
  };
}