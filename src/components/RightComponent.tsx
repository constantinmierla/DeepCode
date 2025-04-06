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
  const [isClusteringView, setIsClusteringView] = useState<boolean>(false);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  let parsedDrugs: any = null;

  try {
    if (textDrugs) {
      parsedDrugs = JSON.parse(textDrugs);
    }
  } catch (error) {
    console.error("Invalid JSON in textDrugs:", error);
  }

  const toggleView = () => {
    setIsFlipping(true); // Start flipping animation
    setTimeout(() => {
      setIsClusteringView(!isClusteringView);
      setIsFlipping(false); // End flipping animation
    }, 350); // Match the duration of the flip animation
  };

  return (
    <div
      className="mt-3 p-6 bg-white shadow-lg rounded-xl border border-gray-200 animate-fade-in"
      style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
    >
      {/* Header with title and button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900">Drug Suggestions</h3>
        <button
          onClick={toggleView}
          className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md"
        >
          {isClusteringView ? "Show Plot" : "Show Drug Suggestions"}
        </button>
      </div>

      {/* Conditional Rendering with Flip Animation */}
      <div
        className={`relative w-full h-[500px] md:h-[600px] transition-transform duration-1000 ${
          isFlipping ? "flip" : ""
        }`}
      >
        {isClusteringView ? (
          <div className="absolute inset-0 backface-hidden">
            <ClusteringPlot drugSuggestions={textDrugs} />
          </div>
        ) : isFetchingDrug ? (
          <div
            className="flex justify-center items-center absolute inset-0 backface-hidden"
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
          <p className="text-gray-800 italic absolute inset-0 backface-hidden">
            No drug suggestions available.
          </p>
        ) : (
          <div className="mt-4 absolute inset-0 backface-hidden">
            <h4 className="text-xl font-semibold mb-2 text-gray-800">
              Suggestions for{" "}
              <span className="text-blue-600 font-bold">
                {parsedDrugs.gene}
              </span>
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
                        item.gene.map(
                          (geneSymbol: string, geneIndex: number) => (
                            <li
                              key={geneIndex}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium shadow-sm hover:bg-blue-200 transition font-mono"
                            >
                              {geneSymbol}
                            </li>
                          )
                        )
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

      <style>
        {`
          .relative {
            perspective: 1000px; /* Add perspective for 3D effect */
          }
          .flip {
            transform: rotateY(180deg);
            transform-style: preserve-3d; /* Preserve 3D transformations */
          }
          .backface-hidden {
            backface-visibility: hidden;
            position: absolute;
            width: 100%;
            height: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default RightComponent;
