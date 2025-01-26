"use client"
import React, { useEffect, useState } from "react";
import RoadmapGraph from "@/components/roadmap/RoadmapGraph";
import { fetchRoadmap, transformRoadmapData } from "@/lib/neo4jUtils";

const Dashboard: React.FC = () => {
  const [nodes, setNodes] = useState<{ data: { id: string; label: string } }[]>([]);
  const [edges, setEdges] = useState<{ data: { id: string; source: string; target: string } }[]>([]);

  useEffect(() => {
    const loadRoadmap = async () => {
      const neo4jInstanceId = "679424493a7a4987ceb1d219"; // Replace with the actual user ID
      const roadmapData = await fetchRoadmap(neo4jInstanceId);
      const { nodes, edges } = transformRoadmapData(roadmapData);
      setNodes(nodes);
      setEdges(edges);
    };

    loadRoadmap();
  }, []);

  return (
    <div>
      <h1>Your Learning Roadmap</h1>
      <RoadmapGraph nodes={nodes} edges={edges} />
    </div>
  );
};

export default Dashboard;