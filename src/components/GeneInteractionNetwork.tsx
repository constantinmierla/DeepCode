import React, { useEffect, useRef, useState } from "react";
import cytoscape, { Core } from "cytoscape";
import { geneInteractionsMap, geneData } from "./info.js";

// Type definition for the interaction network
type GeneInteraction = {
  gene: string;
  interactionType: string;
};

type GeneDetails = {
  fullName: string;
  function: string;
  diseases: string[];
};

type GeneInteractionNetworkProps = {
  geneName: string;
};

const GeneInteractionNetwork: React.FC<GeneInteractionNetworkProps> = ({
  geneName,
}) => {

  const cyRef = useRef<Core | null>(null);
  const [selectedGeneDetails, setSelectedGeneDetails] =
    useState<GeneDetails | null>(null);

  const interactingGenes = geneInteractionsMap[geneName] || [];

  useEffect(() => {
    if (!geneName) return;

    cyRef.current = cytoscape({
      container: document.getElementById("cy"),
      elements: [
        { data: { id: geneName } },
        ...interactingGenes.map((interaction) => ({
          data: { id: interaction.gene },
        })),
        ...interactingGenes.map((interaction) => ({
          data: {
            id: `${geneName}-${interaction.gene}`,
            source: geneName,
            target: interaction.gene,
            interactionType: interaction.interactionType,
          },
        })),
      ],
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#0074D9",
            label: "data(id)",
            width: 50,
            height: 50,
            "font-size": 12,
            "text-valign": "center",
            "text-halign": "center",
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#ccc",
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#ccc",
            label: "data(interactionType)",
            "text-rotation": "autorotate",
            "text-margin-y": -10,
            "font-size": 10,
            "text-background-color": "#ffffff",
            "text-background-opacity": 0.8,
          },
        },
      ],
      layout: {
        name: "concentric",
        spacingFactor: 1.5,
        minNodeSpacing: 20,
      },
    });

    cyRef.current.on("tap", "node", (event) => {
      const nodeId = event.target.id();
      const geneDetails = geneData[nodeId];
      setSelectedGeneDetails(geneDetails || null);
    });

    return () => {
      cyRef.current?.destroy();
    };
  }, [geneName, interactingGenes]);

  if (!geneName) {
    return <div className="text-gray-800 italic">No data available</div>;
  }

  return (
    <div className="gene-interaction-network">
      <div id="cy" style={{ height: "600px", width: "100%" }}></div>
      {selectedGeneDetails && (
        <div className="gene-details">
          <h3>Gene Details</h3>
          <p>
            <strong>Full Name:</strong> {selectedGeneDetails.fullName}
          </p>
          <p>
            <strong>Function:</strong> {selectedGeneDetails.function}
          </p>
          <p>
            <strong>Associated Diseases:</strong>
            <ul>
              {selectedGeneDetails.diseases.map((disease, index) => (
                <li key={index}>{disease}</li>
              ))}
            </ul>
          </p>
        </div>
      )}
    </div>
  );
};

export default GeneInteractionNetwork;
