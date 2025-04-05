import React from "react";

type GeneInfo = {
  fullName: string;
  function: string;
  diseases: string[];
};

interface GeneDetailsProps {
  gene: string;
  geneInfo: GeneInfo;
}

const GeneDetails: React.FC<GeneDetailsProps> = ({ gene, geneInfo }) => (
  <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
    <h3 className="text-xl font-semibold text-gray-800">Gene: {gene.toUpperCase()}</h3>
    <p className="text-gray-700"><strong>Full Name:</strong> {geneInfo.fullName}</p>
    <p className="text-gray-700"><strong>Function:</strong> {geneInfo.function}</p>
    <p className="text-gray-700"><strong>Associated Diseases:</strong> {geneInfo.diseases.join(", ")}</p>
  </div>
);

export default GeneDetails;

