import React, { useState } from "react";
import Header from "./Header";
import LeftComponent from "./LeftComponent";
import CenterComponent from "./CenterComponent";
import RightComponent from "./RightComponent";
import { text } from "stream/consumers";

type GeneInfo = {
  fullName: string;
  function: string;
  diseases: string[];
};

const MainComponent: React.FC = () => {
  const [gene, setGene] = useState("");
  const [geneInfo, setGeneInfo] = useState<GeneInfo | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingDrug, setIsFetchingDrug] = useState(false);
  const [drugSuggestions, setDrugSuggestions] = useState<string>("");
  const [textDrugs, setTextDrugs] = useState<string>("");

  const handleSearch = async (searchGene: string) => {
    try {
      const result = await (window as any).electronAPI.getGeneInfo(searchGene);
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

  const handleDrug = async (searchGene: string) => {
    //try {
    //  const result = await (window as any).electronAPI.getDrugTop(searchGene);
    //  const validJsonString = result.replace(/'/g, '"');
    //  const resultJson = JSON.parse(validJsonString);

    //  setDrugSuggestions(resultJson.join(", "));
    //} catch (err) {
    //  console.error("Failed to fetch drug suggestions", err);
    //}
    try {
      const result = await (window as any).electronAPI.getDrugTop(searchGene);
      setTextDrugs(result);
    }
    catch (err) {
      console.error("Failed to fetch drug suggestions", err);
    }
  };

  const handleSearchAndDrug = async (searchGene: string) => {
    setIsFetching(true);
    setIsFetchingDrug(true);
    try {
      await Promise.all([handleSearch(searchGene), handleDrug(searchGene)]);
    } catch (err) {
      console.error("Error occurred while fetching data", err);
    } finally {
      setIsFetching(false);
      setIsFetchingDrug(false);
    }
  };

  return (
    <div>
      <Header
        onSearchResult={async (gene) => {
          setGene(gene);
          setGeneInfo(null);
          setDrugSuggestions("");
          await handleSearchAndDrug(gene);
        }}
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 min-h-[calc(100vh-100px)] px-4">
        <LeftComponent
          gene={gene}
          geneInfo={geneInfo}
          isFetching={isFetching}
        ></LeftComponent>
        <CenterComponent gene={gene} geneInfo={geneInfo}></CenterComponent>
        <RightComponent
          isFetchingDrug={isFetchingDrug}
          drugSuggestions={drugSuggestions}
          textDrugs={textDrugs}
        ></RightComponent>
        {textDrugs &&
          <div>
            {textDrugs}
          </div>}
      </div>
    </div>
  );
};

export default MainComponent;
