import React from "react";
import GeneInteractionNetwork from "./GeneInteractionNetwork";
import GeneSimilarityChart from "./PlotComponent";
import GeneTP53 from "./GeneTP53";
import GeneEGFR from "./GeneEGFR";

type GeneInfo = {
  fullName: string;
  function: string;
  diseases: string[];
};

interface GeneDetailsProps {
  gene: string;
  geneInfo: GeneInfo | null;
}

const data = {
  central_gene: "TP53",
  relations: [
    { source: "TP53", target: "CDKN1A", type: "activation" },
    { source: "CASP8", target: "TP53", type: "activation" },
    { source: "MDM2", target: "TP53", type: "inhibition" },
    { source: "ATM", target: "TP53", type: "activation" },
    { source: "MDM2", target: "TP53", type: "inhibition" },
    { source: "ATM", target: "TP53", type: "activation" },
    { source: "SIRT1", target: "TP53", type: "inhibition" },
    { source: "MDM2", target: "TP53", type: "inhibition" },
    { source: "TP53", target: "CDKN2A", type: "activation" },
    { source: "TP53", target: "CDKN2C", type: "activation" },
    { source: "TP53", target: "CDKN1A", type: "activation" },
    { source: "TP53", target: "CDKN1B", type: "activation" },
    { source: "CDKN2C", target: "CDK4", type: "inhibition" },
    { source: "CDKN2A", target: "MDM2", type: "inhibition" },
    { source: "MDM2", target: "RB1", type: "inhibition" },
    { source: "MDM4", target: "MDM2", type: "activation" },
    { source: "TP53", target: "MDM2", type: "activation" },
    { source: "CASP8", target: "ATM", type: "activation" },
    { source: "CDKN1A", target: "CDK4", type: "inhibition" },
    { source: "AKT3", target: "CDKN1A", type: "inhibition" },
    { source: "CDKN1A", target: "CASP3", type: "inhibition" },
    { source: "CDKN1A", target: "MAP3K5", type: "inhibition" },
    { source: "CDKN2A", target: "CDK4", type: "inhibition" },
    { source: "MYC", target: "CDKN2A", type: "activation" },
  ],
  stats: {
    total_relations: 24,
    unique_genes: 16,
  },
};

const CenterComponent: React.FC<GeneDetailsProps> = ({ gene, geneInfo }) => {
  return (
    <div
      className="mt-3 p-6 bg-white shadow-lg rounded-xl border border-gray-200 animate-fade-in"
      style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Center Component
      </h3>

      {gene === "TP53" && (
        <div style={{ width: "100%", height: "600px" }}>
          {" "}
          <GeneTP53 />
        </div>
      )}

      {gene === "EGFR" && (
        <div style={{ width: "100%", height: "600px" }}>
          {" "}
          <GeneEGFR />
        </div>
      )}

      <div style={{ width: "100%", height: "600px" }}>
        {" "}
        <GeneInteractionNetwork geneName={gene} />
        <GeneSimilarityChart data={data}></GeneSimilarityChart>
      </div>
    </div>
  );
};

export default CenterComponent;
