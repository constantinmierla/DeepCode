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
    BRCA1: {
      fullName: "Breast Cancer 1",
      function: "Involved in DNA repair, regulation of cell cycle, and tumor suppression.",
      diseases: ["Breast Cancer", "Ovarian Cancer", "Hereditary Breast-Ovarian Cancer Syndrome"],
    },
    PIK3CA: {
      fullName: "Phosphatidylinositol-4,5-bisphosphate 3-kinase catalytic subunit alpha",
      function: "Catalytic subunit of the PI3-kinase, involved in cell signaling and growth.",
      diseases: ["Cancer", "Overgrowth Syndromes", "Colorectal Cancer"],
    },
    MTOR: {
      fullName: "Mechanistic Target of Rapamycin",
      function: "Regulates cell growth, cell cycle progression, and metabolism.",
      diseases: ["Cancer", "Tuberous Sclerosis", "Lymphangioleiomyomatosis"],
    },
    PTEN: {
      fullName: "Phosphatase and Tensin Homolog",
      function: "Tumor suppressor that negatively regulates the PI3K/AKT signaling pathway.",
      diseases: ["Cowden Syndrome", "Cancer"],
    },
    FOXO3: {
      fullName: "Forkhead Box O3",
      function: "Regulates gene expression involved in apoptosis, cell-cycle regulation, and stress response.",
      diseases: ["Cancer", "Cardiovascular Disease"],
    },
    GSK3B: {
      fullName: "Glycogen Synthase Kinase 3 Beta",
      function: "Regulates the Wnt signaling pathway and is involved in metabolism, cell development, and apoptosis.",
      diseases: ["Alzheimer's Disease", "Diabetes", "Cancer"],
    },
    TSC2: {
      fullName: "Tuberous Sclerosis Complex 2",
      function: "Regulates cell growth and size by inhibiting the mTOR pathway.",
      diseases: ["Tuberous Sclerosis Complex", "Cancer"],
    },
    BAD: {
      fullName: "Bcl-2 Antagonist of Cell Death",
      function: "Pro-apoptotic protein that regulates apoptosis through interaction with Bcl-2 family members.",
      diseases: ["Cancer", "Neurodegenerative Diseases"],
    },
    BCL2: {
      fullName: "B-cell CLL/lymphoma 2",
      function: "Regulates cell apoptosis by inhibiting cell death.",
      diseases: ["Cancer", "Lymphoma", "Leukemia"],
    },
    PDK1: {
      fullName: "3-Phosphoinositide-Dependent Protein Kinase-1",
      function: "Regulates cell metabolism, growth, and survival.",
      diseases: ["Cancer", "Neurological Disorders"],
    },
    NFKB1: {
      fullName: "Nuclear Factor Kappa B Subunit 1",
      function: "Transcription factor involved in immune response, inflammation, and cell survival.",
      diseases: ["Cancer", "Inflammatory Diseases", "Autoimmune Diseases"],
    },
    RAD51: {
      fullName: "RAD51 Recombinase",
      function: "Involved in DNA repair, homologous recombination, and maintenance of genomic integrity.",
      diseases: ["Cancer", "DNA Repair Disorders"],
    },
    BARD1: {
      fullName: "BRCA1-Associated RING Domain 1",
      function: "Interacts with BRCA1 to regulate DNA repair and cell cycle progression.",
      diseases: ["Cancer", "Hereditary Breast-Ovarian Cancer Syndrome"],
    },
    PALB2: {
      fullName: "Partner and Localizer of BRCA2",
      function: "Involved in DNA repair by homologous recombination, interacts with BRCA2.",
      diseases: ["Breast Cancer", "Ovarian Cancer"],
    },
    CHEK2: {
      fullName: "Checkpoint Kinase 2",
      function: "Involved in DNA damage response and tumor suppression.",
      diseases: ["Cancer", "Li-Fraumeni Syndrome"],
    },
    FANCD2: {
      fullName: "Fanconi Anemia, Complementation Group D2",
      function: "Involved in DNA repair and the Fanconi anemia pathway.",
      diseases: ["Fanconi Anemia", "Cancer"],
    },
    BRCA2: {
      fullName: "Breast Cancer 2",
      function: "Regulates DNA repair by homologous recombination and tumor suppression.",
      diseases: ["Breast Cancer", "Ovarian Cancer"],
    },
    NBN: {
      fullName: "Nijmegen Breakage Syndrome 1",
      function: "Involved in DNA double-strand break repair and genomic stability.",
      diseases: ["Nijmegen Breakage Syndrome", "Cancer"],
    },
    MRE11: {
      fullName: "MRE11 Homolog, Double Strand Break Repair Nuclease",
      function: "Involved in DNA repair and maintenance of genome stability.",
      diseases: ["Cancer", "Ataxia Telangiectasia-like Disorder"],
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
