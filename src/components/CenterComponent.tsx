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

const CenterComponent: React.FC<GeneDetailsProps> = ({ gene, geneInfo }) => {
  return (
    <div
      className="mt-3 p-6 bg-white shadow-lg rounded-xl border border-gray-200 animate-fade-in"
      style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Gene Connections for{" "}
        <span className="text-blue-600">{gene.toUpperCase()}</span>
      </h3>

      {/* Conditionally render GeneTP53 only when gene name is TP53 */}
      {gene === "TP53" && (
        <div style={{ width: "100%", height: "600px" }}>
          {" "}
          {/* Adjust the height and width for zoom */}
          <GeneTP53 />
        </div>
      )}

      {/* Conditionally render GeneEGFR only when gene name is EGFR */}
      {gene === "EGFR" && (
        <div style={{ width: "100%", height: "600px" }}>
          {" "}
          {/* Adjust the height and width for zoom */}
          <GeneEGFR />
        </div>
      )}

      {/* Render the GeneInteractionNetwork component regardless of the gene name */}
      <div style={{ width: "100%", height: "600px" }}>
        {" "}
        {/* Adjust the height and width for zoom */}
        <GeneInteractionNetwork geneName={gene} />
      </div>
    </div>
  );
};

export default CenterComponent;
