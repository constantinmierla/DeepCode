import React, { useState } from "react";
import Header from "./Header";
import LeftComponent from "./LeftComponent";
import CenterComponent from "./CenterComponent";
import RightComponent from "./RightComponent";

type GeneInfo = {
  fullName: string;
  function: string;
  diseases: string[];
};

const MainComponent: React.FC = () => {
  const [gene, setGene] = useState("");
  const [geneInfo, setGeneInfo] = useState<GeneInfo | null>(null);

  const handleSearch = async () => {
    try {
      const result = await (window as any).electronAPI.getGeneInfo(gene);
      const validJsonString = result.replace(/'/g, '"');
      const resultJson = JSON.parse(validJsonString);

      let diseases = resultJson["diseases"];
      if (typeof diseases === "string") {
        diseases = diseases
          .split("\n")
          .map((d) => d.replace(/^\d+\.\s*/, "").trim())
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
    <div>
      <Header
        onSearchResult={async (gene) => {
          setGene(gene);
          await handleSearch();
        }}
      />
      <div className="grid grid-cols-3 gap-4">
        <LeftComponent gene={gene} geneInfo={geneInfo}></LeftComponent>
        <CenterComponent gene={gene} geneInfo={geneInfo}></CenterComponent>
        <RightComponent gene={gene} geneInfo={geneInfo}></RightComponent>
      </div>
    </div>
  );
};

export default MainComponent;
