import React from "react";
import Button from "./ui/Button";

interface SearchInputProps {
  gene: string;
  setGene: (value: string) => void;
  onSearch: () => void;
}

//TODO: implement auto complete/suggestion, practic in momentul cand el scrie sa zicem t, sa apara "tp53", "tp63"...
//poate fi implementat asa: facem un json cu toate denumirile si facem cu aho corasick

//TODO: adauga un spinner cat timp se incarca
const SearchInput: React.FC<SearchInputProps> = ({ gene, setGene, onSearch }) => (
  <div className="mb-4">
    <input
      type="text"
      value={gene}
      onChange={(e) => setGene(e.target.value)}
      placeholder="Enter gene (e.g., TP53)"
      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      onClick={onSearch}
      className="ml-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Search
    </button>
    <Button
      onClick={onSearch}
      variant="primary"
      btnSize="xs"
    >
      Search
    </Button>
  </div>
);

export default SearchInput;
