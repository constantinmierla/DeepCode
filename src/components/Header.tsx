import React, { useState } from "react";
import SearchInput from "./SearchInput";

const Header: React.FC<{ onSearchResult: (gene: string) => void }> = ({
  onSearchResult,
}) => {
  const [gene, setGene] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", gene);
    onSearchResult(gene);
  };

  return (
    <div className="grid grid-cols-3 items-center h-16 bg-gray-100">
      <div className="flex justify-center items-center text-2xl font-bold text-blue-600 font-sans">
        Deep<span className="text-stone-800">{`{Code}`}</span>
      </div>
      <div className="flex justify-center items-center">
        <SearchInput gene={gene} setGene={setGene} onSearch={handleSearch} />
      </div>
      <div className="flex justify-center items-center"></div>
    </div>
  );
};

export default Header;
