import React, { useEffect, useRef, useState } from "react";
import cytoscape, { Core } from "cytoscape";

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
  const geneInteractionsMap: Record<string, GeneInteraction[]> = {
    TP53: [
      { gene: "MDM2", interactionType: "inhibitory" },
      { gene: "EP300", interactionType: "co-expression" },
      { gene: "ATM", interactionType: "regulatory" },
      { gene: "BRCA1", interactionType: "regulatory" },
      { gene: "CHEK2", interactionType: "inhibitory" },
      { gene: "BAX", interactionType: "regulatory" },
      { gene: "CDKN1A", interactionType: "co-expression" },
      { gene: "SFN", interactionType: "co-expression" },
      { gene: "HIF1A", interactionType: "regulatory" },
      { gene: "BCL2", interactionType: "inhibitory" },
    ],
    AKT1: [
      { gene: "PIK3CA", interactionType: "regulatory" },
      { gene: "MTOR", interactionType: "co-expression" },
      { gene: "PTEN", interactionType: "inhibitory" },
      { gene: "FOXO3", interactionType: "inhibitory" },
      { gene: "GSK3B", interactionType: "regulatory" },
      { gene: "TSC2", interactionType: "inhibitory" },
      { gene: "BAD", interactionType: "inhibitory" },
      { gene: "BCL2", interactionType: "regulatory" },
      { gene: "PDK1", interactionType: "co-expression" },
      { gene: "NFKB1", interactionType: "regulatory" },
    ],
    BRCA1: [
      { gene: "RAD51", interactionType: "regulatory" },
      { gene: "BARD1", interactionType: "co-expression" },
      { gene: "TP53", interactionType: "regulatory" },
      { gene: "PALB2", interactionType: "co-expression" },
      { gene: "CHEK2", interactionType: "regulatory" },
      { gene: "ATM", interactionType: "regulatory" },
      { gene: "FANCD2", interactionType: "regulatory" },
      { gene: "BRCA2", interactionType: "co-expression" },
      { gene: "NBN", interactionType: "regulatory" },
      { gene: "MRE11", interactionType: "regulatory" },
    ],
  };

  const geneData: { [key: string]: GeneDetails } = {
    TP53: {
      fullName: "Tumor Protein P53",
      function: "Regulates the cell cycle and functions as a tumor suppressor.",
      diseases: ["Cancer", "Li-Fraumeni Syndrome"],
    },
    MDM2: {
      fullName: "Mdm2 Proto-Oncogene",
      function: "Inhibitor of p53 tumor suppressor protein.",
      diseases: ["Cancer", "Sarcoma"],
    },
    EP300: {
      fullName: "EP300 Transcriptional Coactivator",
      function: "Co-activates transcription of various genes.",
      diseases: ["Cancer", "Histone Acetyltransferase Deficiency"],
    },
    ATM: {
      fullName: "Ataxia Telangiectasia Mutated",
      function: "Regulates the cell cycle, DNA repair, and apoptosis.",
      diseases: ["Ataxia Telangiectasia"],
    },
  };

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
