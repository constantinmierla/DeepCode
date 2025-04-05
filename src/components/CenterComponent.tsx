import React from "react";
import GeneInteractionNetwork from "./src/components/GeneInteractionNetwork";

type GeneInfo = {
  fullName: string;
  function: string;
  diseases: string[];
};

interface GeneDetailsProps {
  gene: string;
  geneInfo: GeneInfo | null;
}

const CenterComponent: React.FC<GeneDetailsProps> = ({ gene, geneInfo }) => (
  <div className="mt-6 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
    {" "}
    <h3 className="text-2xl font-bold text-gray-900 mb-4">Center Component</h3>
    <GeneInteractionNetwork />
  </div>
);

export default CenterComponent;
