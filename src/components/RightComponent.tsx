import React from "react";

interface DrugSuggestionsProps {
  isFetchingDrug: boolean;
  drugSuggestions: string;
}

const RightComponent: React.FC<DrugSuggestionsProps> = ({
  isFetchingDrug,
  drugSuggestions,
}) => (
  <div className="mt-6 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
    <h3 className="text-2xl font-bold text-gray-900 mb-4">Drug Suggestions</h3>
    {isFetchingDrug ? (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    ) : drugSuggestions.length === 0 ? (
      <p className="text-gray-800 italic">No drug suggestions available.</p>
    ) : (
      <ul className="list-disc list-inside text-blue-600">{drugSuggestions}</ul>
    )}
  </div>
);

export default RightComponent;
