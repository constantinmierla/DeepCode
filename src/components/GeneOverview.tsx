import React, { useState } from "react";
import GeneHeader from "./GeneHeader";
import SearchInput from "./SearchInput";
import GeneDetails from "./GeneDetails";

type GeneInfo = {
  fullName: string;
  function: string;
  diseases: string[];
}

//TODO: implement validation , if not found
const GeneOverview: React.FC = () => {
  const [gene, setGene] = useState("");
  const [geneInfo, setGeneInfo] = useState<GeneInfo | null>(null);

  const handleSearch = async () => {
    try {
      const result = await (window as any).electronAPI.getGeneInfo(gene);
      const validJsonString = result.replace(/'/g, '"');
      const resultJson = JSON.parse(validJsonString);

      let diseases = resultJson["diseases"];
      if (typeof diseases === 'string') {
        diseases = diseases
          .split("\n")
          .map(d => d.replace(/^\d+\.\s*/, "").trim())
          .filter(Boolean);
      }

      setGeneInfo({
        fullName: resultJson["fullName"],
        function: resultJson["function"],
        diseases: diseases,
      });

    } catch (err) {
      console.error("Failed to run Python script", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <GeneHeader />
      <SearchInput gene={gene} setGene={setGene} onSearch={handleSearch} />
      {geneInfo && <GeneDetails gene={gene} geneInfo={geneInfo} />}
    </div>
  );
};

export default GeneOverview;
