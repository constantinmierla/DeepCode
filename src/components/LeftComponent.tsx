import React from "react";
// Import the DNA loading component
import { DNA } from "react-loader-spinner";

type GeneInfo = {
  fullName: string;
  function: string;
  diseases: string[];
};

interface GeneDetailsProps {
  gene: string;
  geneInfo: GeneInfo | null;
  isFetching: boolean; // Add a prop to indicate if data is being fetched
}

const LeftComponent: React.FC<GeneDetailsProps> = ({
  gene,
  geneInfo,
  isFetching,
}) => (
  <div
    className="mt-3 p-6 bg-white shadow-lg rounded-xl border border-gray-200 animate-fade-in"
    style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
  >
    <h3 className="text-2xl font-bold text-gray-900 mb-4">
      Gene: <span className="text-blue-600">{gene.toUpperCase()}</span>
    </h3>
    {isFetching ? (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "70vh" }}
      >
        <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
        <style>
          {`
        svg.dna-wrapper circle:nth-child(odd) { fill: #155dfc !important; }
        svg.dna-wrapper circle:nth-child(even) { fill: #292524 !important; }
          `}
        </style>
      </div>
    ) : geneInfo === null ? (
      <p className="text-gray-800 italic">
        Please provide a gene name to fetch data.
      </p>
    ) : (
      <div className="space-y-4">
        {geneInfo.fullName === "No data found for the given gene name." ? (
          <p className="text-gray-800 italic">No data has been found</p>
        ) : (
          <>
            <p className="text-gray-800">
              <span className="font-medium text-gray-900">
                <strong>Full Name:</strong>
              </span>{" "}
              {geneInfo.fullName}
            </p>
            <p className="text-gray-800">
              <span className="font-medium text-gray-900">
                <strong>Function</strong>:
              </span>{" "}
              {geneInfo.function}
            </p>
            <p className="text-gray-800">
              <span className="font-medium text-gray-900">
                <strong>Associated Diseases:</strong>
              </span>{" "}
              <ul className="list-disc list-inside text-red-600">
                {geneInfo.diseases.map((disease, index) => (
                  <li key={index}>{disease}</li>
                ))}
              </ul>
            </p>
          </>
        )}
      </div>
    )}
  </div>
);

export default LeftComponent;
