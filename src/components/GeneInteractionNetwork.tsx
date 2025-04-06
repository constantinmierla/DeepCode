import React, { useEffect, useRef, useState } from "react";
import cytoscape, { Core } from "cytoscape";
import { geneInteractionsMap, geneData } from "./info.js";
import GeneSimilarityChart from "./PlotComponent";
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

const combinedData = {
  central_genes: ["TP53", "BRCA1"],
  relations: [
    // Relations for TP53
    { source: "TP53", target: "CDKN1A", type: "activation", gene: "TP53" },
    { source: "CASP8", target: "TP53", type: "activation", gene: "TP53" },
    { source: "MDM2", target: "TP53", type: "inhibition", gene: "TP53" },
    { source: "ATM", target: "TP53", type: "activation", gene: "TP53" },
    { source: "MDM2", target: "TP53", type: "inhibition", gene: "TP53" },
    { source: "ATM", target: "TP53", type: "activation", gene: "TP53" },
    { source: "SIRT1", target: "TP53", type: "inhibition", gene: "TP53" },
    { source: "MDM2", target: "TP53", type: "inhibition", gene: "TP53" },
    { source: "TP53", target: "CDKN2A", type: "activation", gene: "TP53" },
    { source: "TP53", target: "CDKN2C", type: "activation", gene: "TP53" },
    { source: "TP53", target: "CDKN1A", type: "activation", gene: "TP53" },
    { source: "TP53", target: "CDKN1B", type: "activation", gene: "TP53" },
    { source: "CDKN2C", target: "CDK4", type: "inhibition", gene: "TP53" },
    { source: "CDKN2A", target: "MDM2", type: "inhibition", gene: "TP53" },
    { source: "MDM2", target: "RB1", type: "inhibition", gene: "TP53" },
    { source: "MDM4", target: "MDM2", type: "activation", gene: "TP53" },
    { source: "TP53", target: "MDM2", type: "activation", gene: "TP53" },
    { source: "CASP8", target: "ATM", type: "activation", gene: "TP53" },
    { source: "CDKN1A", target: "CDK4", type: "inhibition", gene: "TP53" },
    { source: "AKT3", target: "CDKN1A", type: "inhibition", gene: "TP53" },
    { source: "CDKN1A", target: "CASP3", type: "inhibition", gene: "TP53" },
    { source: "CDKN1A", target: "MAP3K5", type: "inhibition", gene: "TP53" },
    { source: "CDKN2A", target: "CDK4", type: "inhibition", gene: "TP53" },
    { source: "MYC", target: "CDKN2A", type: "activation", gene: "TP53" },

    // Relations for BRCA1
    { source: "BRCA1", target: "TP53", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "RAD51", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "BRCA2", type: "activation", gene: "BRCA1" },
    { source: "ATM", target: "BRCA1", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "CHEK2", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "PALB2", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "CDKN1A", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "CDK2", type: "inhibition", gene: "BRCA1" },
    { source: "BRCA1", target: "MCM2", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "ATR", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "RAD52", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "MRN", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "BARD1", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "FANCD2", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "CHK1", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "P53", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "GADD45A", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "BRCC3", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "NF-kB", type: "inhibition", gene: "BRCA1" },
    { source: "BRCA1", target: "PTEN", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "SENP6", type: "inhibition", gene: "BRCA1" },
    { source: "BRCA1", target: "PML", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "JNK", type: "activation", gene: "BRCA1" },
    { source: "BRCA1", target: "Cdc25A", type: "inhibition", gene: "BRCA1" },
    { source: "BRCA1", target: "Bcl-2", type: "inhibition", gene: "BRCA1" },
  ],
  stats: {
    total_relations: 48, // 24 for TP53 + 24 for BRCA1
    unique_genes: 39, // Count of unique genes involved
  },
};

const GeneInteractionNetwork: React.FC<GeneInteractionNetworkProps> = ({
  geneName,
}) => {
  const cyRef = useRef<Core | null>(null);
  const [selectedGeneDetails, setSelectedGeneDetails] =
    useState<GeneDetails | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const interactingGenes = geneInteractionsMap[geneName] || [];

  // Filter the data for the plot
  const filteredData = {
    ...combinedData,
    relations: combinedData.relations.filter(
      (relation) =>
        relation.gene === geneName ||
        combinedData.central_genes.includes(relation.gene)
    ),
  };

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

      const { x, y } = event.renderedPosition || { x: 0, y: 0 };

      const cyContainer = document.getElementById("cy");
      if (!cyContainer) return;

      const rect = cyContainer.getBoundingClientRect();

      // Adjust the position relative to the page/document
      const adjustedX = rect.left + x;
      const adjustedY = rect.top + y;

      setPopupPosition({ x: adjustedX, y: adjustedY });
    });

    cyRef.current.on("mouseout", "node", () => {
      setSelectedGeneDetails(null);
      setPopupPosition(null);
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

      {selectedGeneDetails && popupPosition && (
        <div
          style={{
            position: "absolute",
            left: popupPosition.x,
            top: popupPosition.y,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: 4,
            padding: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            zIndex: 10,
            maxWidth: "300px",
            transform: "translate(-50%, -100%)", // moves it above and centered horizontally
          }}
        >
          <h3 style={{ marginTop: 0 }}>{selectedGeneDetails.fullName}</h3>
          <p>
            <strong>Function:</strong> {selectedGeneDetails.function}
          </p>
          <p>
            <strong>Diseases:</strong>
          </p>
          <ul style={{ marginTop: 0 }}>
            {selectedGeneDetails.diseases.map((disease, index) => (
              <li key={index}>{disease}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GeneInteractionNetwork;
