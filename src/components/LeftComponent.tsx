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
  <div className="mt-6 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
    <h3 className="text-2xl font-bold text-gray-900 mb-4">
      Gene: <span className="text-blue-600">{gene.toUpperCase()}</span>
    </h3>
    {isFetching ? (
      <div className="flex justify-center items-center h-full">
        <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
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
              <span className="font-medium text-gray-900">Full Name:</span>{" "}
              {geneInfo.fullName}
            </p>
            <p className="text-gray-800">
              <span className="font-medium text-gray-900">Function:</span>{" "}
              {geneInfo.function}
            </p>
            <p className="text-gray-800">
              <span className="font-medium text-gray-900">
                Associated Diseases:
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
