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

const GeneInteractionNetwork: React.FC = () => {
  // Hardcoded data for gene of interest and interacting genes
  const geneOfInterest = "TP53";
  const interactingGenes: GeneInteraction[] = [
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
  ];

  // Simulated gene data for display on node click
  const geneData: { [key: string]: GeneDetails } = {
    "TP53": {
      fullName: "Tumor Protein P53",
      function: "Regulates the cell cycle and functions as a tumor suppressor.",
      diseases: ["Cancer", "Li-Fraumeni Syndrome"],
    },
    "MDM2": {
      fullName: "Mdm2 Proto-Oncogene",
      function: "Inhibitor of p53 tumor suppressor protein.",
      diseases: ["Cancer", "Sarcoma"],
    },
    "EP300": {
      fullName: "EP300 Transcriptional Coactivator",
      function: "Co-activates transcription of various genes.",
      diseases: ["Cancer", "Histone Acetyltransferase Deficiency"],
    },
    "ATM": {
      fullName: "Ataxia Telangiectasia Mutated",
      function: "Regulates the cell cycle, DNA repair, and apoptosis.",
      diseases: ["Ataxia Telangiectasia"],
    },
    // Add more genes as needed
  };

  const cyRef = useRef<Core | null>(null);
  const [selectedGeneDetails, setSelectedGeneDetails] = useState<GeneDetails | null>(null);

  useEffect(() => {
    // Initialize Cytoscape when the component mounts
    cyRef.current = cytoscape({
      container: document.getElementById("cy"), // The container div for Cytoscape

      elements: [
        // The gene of interest (add as a node first)
        { data: { id: geneOfInterest } },

        // Interacting genes (add as nodes first)
        ...interactingGenes.map((interaction) => ({
          data: { id: interaction.gene },
        })),

        // Then create edges between the gene of interest and interacting genes
        ...interactingGenes.map((interaction) => ({
          data: {
            id: `${geneOfInterest}-${interaction.gene}`, // Optional edge ID
            source: geneOfInterest,
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
            "label": "data(id)",
            "width": 50,
            "height": 50,
            "font-size": 12,
            "text-valign": "center",
            "text-halign": "center",
          },
        },
        {
          selector: "edge",
          style: {
            "width": 3,
            "line-color": "#ccc",
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#ccc",
            "label": "data(interactionType)",
          },
        },
      ],

      layout: {
        name: "concentric",
        // Specify TP53 as the central node
        radius: 300, // Adjust the radius as needed
        minNodeSpacing: 20, // Space between nodes
      },
    });

    // Set up the click event listener for the nodes
    cyRef.current.on("tap", "node", (event) => {
      const nodeId = event.target.id();
      const geneDetails = geneData[nodeId];
      setSelectedGeneDetails(geneDetails || null);
    });

    return () => {
      cyRef.current?.destroy();
    };
  }, [geneOfInterest, interactingGenes]);

  return (
    <div className="gene-interaction-network">
      <div id="cy" style={{ height: "600px", width: "100%" }}></div>

      {/* Display selected gene details */}
      {selectedGeneDetails && (
        <div className="gene-details">
          <h3>Gene Details</h3>
          <p><strong>Full Name:</strong> {selectedGeneDetails.fullName}</p>
          <p><strong>Function:</strong> {selectedGeneDetails.function}</p>
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
