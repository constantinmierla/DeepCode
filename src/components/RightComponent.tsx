import React from "react";
// Import the DNA loading component
import { DNA } from "react-loader-spinner";

type DrugSuggestionsProps = {
  isFetchingDrug: boolean;
  drugSuggestions: string;
  textDrugs: string;
};

const RightComponent: React.FC<DrugSuggestionsProps> = ({
  isFetchingDrug,
  textDrugs,
}) => {
  let parsedDrugs: any = null;

  try {
    if (textDrugs) {
      parsedDrugs = JSON.parse(textDrugs);
    }
  } catch (error) {
    console.error("Invalid JSON in textDrugs:", error);
  }

  return (
    <div className="mt-6 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Drug Suggestions
      </h3>

      {isFetchingDrug ? (
        <div className="flex justify-center items-center h-full">
          <style>
            {`
              svg.dna-wrapper circle:nth-child(odd) { fill: #155dfc !important; }
              svg.dna-wrapper circle:nth-child(even) { fill: #292524 !important; }
            `}
          </style>
          <DNA
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      ) : !parsedDrugs || !parsedDrugs.suggestions?.length ? (
        <p className="text-gray-800 italic">No drug suggestions available.</p>
      ) : (
        <div className="mt-4">
          <h4 className="text-xl font-semibold mb-2 text-gray-800">
            Suggestions for{" "}
            <span className="text-blue-700">{parsedDrugs.gene}</span>
          </h4>
          <ul className="space-y-4">
            {parsedDrugs.suggestions.map((item: any, index: number) => (
              <li key={index} className="border rounded-md p-4 bg-gray-50">
                <p>
                  <strong>Name:</strong> {item.medicament_name}
                </p>
                <p>
                  <strong>Score:</strong> {item.score}
                </p>
                <p>
                  <strong>Indication:</strong> {item.indication}
                </p>
                <p>
                  <strong>Mechanism:</strong> {item.mechanism}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RightComponent;
