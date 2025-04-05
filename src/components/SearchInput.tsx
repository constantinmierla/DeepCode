import React, { useState } from "react";
import Button from "./ui/Button";

interface SearchInputProps {
  gene: string;
  setGene: (value: string) => void;
  onSearch: () => void;
}

const geneSuggestions = [
  "BRCA1",
  "TP53",
  "EGFR",
  "PIK3CA",
  "AKT1",
  "PTEN",
  "KRAS",
  "NRAS",
  "HRAS",
  "BRAF",
  "ERBB2",
  "CDKN2A",
  "RB1",
  "MYC",
  "MTOR",
  "CTNNB1",
  "SMAD4",
  "APC",
  "ATM",
  "BRCA2",
  "CDH1",
  "NTRK1",
  "FGFR1",
  "IDH1",
  "VHL",
  "ERBB4",
  "GRB7",
  "NRG1",
  "ERBIN",
  "GRB2",
  "SHC1",
  "ERBB3",
  "CD44",
  "SRC",
  "SFN",
  "EP300",
  "HIF1A",
  "HDAC1",
  "HSP90AA1",
  "MDM4",
  "CHEK2",
  "BCL2",
  "BCL2L1",
  "MDC1",
  "PALB2",
  "RAD50",
  "BARD1",
  "MRE11",
  "ABRAXAS1",
  "FANCD2",
  "H2AX",
];
const SearchInput: React.FC<SearchInputProps> = ({
  gene,
  setGene,
  onSearch,
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setGene(input);

    if (input) {
      const filtered = geneSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().startsWith(input.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setGene(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={gene}
          onChange={handleInputChange}
          placeholder="Enter gene (e.g., TP53)"
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <Button onClick={onSearch} variant="primary" btnSize="md">
          Explore
        </Button>
      </div>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 border border-gray-300 rounded-lg bg-white shadow-md max-h-40 overflow-y-auto w-full mt-12 max-w-64">
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 cursor-pointer hover:bg-blue-100"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
