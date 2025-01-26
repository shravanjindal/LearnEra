"use client"
import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

interface RoadmapGraphProps {
  nodes: { data: { id: string; label: string } }[];
  edges: { data: { id: string; source: string; target: string } }[];
}

const RoadmapGraph: React.FC<RoadmapGraphProps> = ({ nodes, edges }) => {
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!cyRef.current) {
      cyRef.current = cytoscape({
        container: document.getElementById("cy"),
        elements: [...nodes, ...edges],
        style: [
          {
            selector: "node",
            style: {
              label: "data(label)",
              "background-color": "#666",
              "text-valign": "center",
              "text-halign": "center",
            },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              "line-color": "#999",
              "curve-style": "bezier",
            },
          },
        ],
        layout: {
          name: "breadthfirst",
          directed: true,
          padding: 10,
          spacingFactor: 1.5,
        },
      });

      cyRef.current.fit();
    }

    return () => {
      cyRef.current?.destroy();
    };
  }, [nodes, edges]);

  return <div id="cy" style={{ width: "100%", height: "500px", border: "1px solid #ccc" }} />;
};

export default RoadmapGraph;