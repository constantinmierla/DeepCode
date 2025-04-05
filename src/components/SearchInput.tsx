import React, { useState } from "react";
import Button from "./ui/Button";

interface SearchInputProps {
  gene: string;
  setGene: (value: string) => void;
  onSearch: () => void;
}

const geneSuggestions = ["TP53", "TP63", "BRCA1", "BRCA2", "EGFR", "KRAS"];

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
    <div className="mb-4 flex flex-col gap-2 relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={gene}
          onChange={handleInputChange}
          placeholder="Enter gene (e.g., TP53)"
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <Button onClick={onSearch} variant="primary" btnSize="xs">
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
