import React, { useState } from "react";
import { DNA } from "react-loader-spinner";
import ClusteringPlot from "./ClusteringPlot";

type DrugSuggestionsProps = {
  isFetchingDrug: boolean;
  drugSuggestions: string;
  textDrugs: string;
};

const RightComponent: React.FC<DrugSuggestionsProps> = ({
  isFetchingDrug,
  textDrugs,
}) => {
  const [isClusteringView, setIsClusteringView] = useState<boolean>(false); // Track view mode
  let parsedDrugs: any = null;

  try {
    if (textDrugs) {
      parsedDrugs = JSON.parse(textDrugs);
    }
  } catch (error) {
    console.error("Invalid JSON in textDrugs:", error);
  }

  // Button click handler to toggle views
  const toggleView = () => {
    setIsClusteringView(!isClusteringView);
  };

  return (
    <div
      className="mt-3 p-6 bg-white shadow-lg rounded-xl border border-gray-200 animate-fade-in"
      style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Drug Suggestions
      </h3>

      {/* Button to toggle between views */}
      <div className="mb-4">
        <button
          onClick={toggleView}
          className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md"
        >
          {isClusteringView ? "Show Drug Suggestions" : "Show Clustering Plot"}
        </button>
      </div>

      {/* Conditional Rendering */}
      {isClusteringView ? (
        <div className="w-full h-[500px] md:h-[600px]">
          {/* Clustering Plot */}
          <ClusteringPlot drugSuggestions={textDrugs} />
        </div>
      ) : isFetchingDrug ? (
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
      ) : !parsedDrugs || !parsedDrugs.suggestions?.length ? (
        <p className="text-gray-800 italic">No drug suggestions available.</p>
      ) : (
        <div className="mt-4">
          <h4 className="text-xl font-semibold mb-2 text-gray-800">
            Suggestions for{" "}
            <span className="text-blue-600 font-bold">{parsedDrugs.gene}</span>
          </h4>
          <ul className="space-y-4 animate-fade-in">
            {parsedDrugs.suggestions.map((item: any, index: number) => (
              <li
                key={index}
                className="border rounded-md p-4 bg-gray-50 hover:shadow-lg transition-shadow duration-300"
              >
                <p>
                  <strong>Name:</strong> {item.medicament_name}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                    item.score >= 70
                      ? "bg-green-100 text-green-700"
                      : item.score >= 50
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.score}
                </span>

                <p>
                  <strong>Indication:</strong> {item.indication}
                </p>
                <p>
                  <strong>Mechanism:</strong> {item.mechanism}
                </p>
                <div>
                  <strong>Associated Gene:</strong>
                  <ul className="flex flex-wrap gap-2 mt-1">
                    {Array.isArray(item.gene) ? (
                      item.gene.map((geneSymbol: string, geneIndex: number) => (
                        <li
                          key={geneIndex}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium shadow-sm hover:bg-blue-200 transition font-mono"
                        >
                          {geneSymbol}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-600 text-sm">{item.gene}</li>
                    )}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RightComponent;
