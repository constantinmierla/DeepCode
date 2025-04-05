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
      <div className="flex justify-center">
        <img src="/path/to/your/image.png" alt="Logo" className="h-10" />
      </div>
      <div className="flex justify-center">
        <SearchInput gene={gene} setGene={setGene} onSearch={handleSearch} />
      </div>
      <div></div>
    </div>
  );
};

export default Header;
