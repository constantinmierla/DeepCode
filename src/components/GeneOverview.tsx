import React, { useState } from "react";
import mockData from "../genes.json";
import { exec } from 'child_process';

type GeneInfo = {
  fullName: string;
  function: string;
  diseases: string[];
}

const GeneOverview: React.FC = () => {
  const [gene, setGene] = useState("");
  const [geneInfo, setGeneInfo] = useState<GeneInfo | null>(null);
  const [error, setError] = useState("");

  //const handleSearch = () => {
  //  const geneKey = gene.toUpperCase();
  //  const result = (mockData as Record<string, GeneInfo>)[geneKey];

  //  if (result) {
  //    setGeneInfo(result);
  //    setError("");
  //  } else {
  //    setGeneInfo(null);
  //    setError("Gene not found.");
  //  }
  //};

  const handleSearch = async () => {
    try {
      const result = await (window as any).electronAPI.getGeneInfo(gene);
      const validJsonString = result.replace(/'/g, '"');

      // Now parse the string into an object
      const resultJson = JSON.parse(validJsonString);
      // Extract the fullName from the parsed object
      const fullName = resultJson["fullName"];
      const functionInfo = resultJson["function"];
      let diseases = resultJson["diseases"];
      if (diseases && typeof diseases === 'string') {
        diseases = diseases
          .split("\n") // Split the string by newlines
          .map((disease) => {
            // Remove the number prefix and extra spaces
            return disease.replace(/^\d+\.\s*/, "").trim();
          })
          .filter((disease) => disease.length > 0); // Filter out any empty strings
      }

      // You can log or concatenate information as needed
      const fullString = `Gene: ${fullName} - Function: ${functionInfo} - Diseases: ${diseases.join(", ")}`;

      const geneInfoObj: GeneInfo = {
        fullName: fullName,
        function: functionInfo,
        diseases: diseases
      }

      setGeneInfo(geneInfoObj);

    }
    catch (err) {
      console.error("Failed to run Python script", err);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🔬 Gene Explorer</h2>
      <input
        type="text"
        value={gene}
        onChange={(e) => setGene(e.target.value)}
        placeholder="Enter gene (e.g., TP53)"
        style={{ padding: 8, width: "200px" }}
      />
      <button onClick={handleSearch} style={{ marginLeft: 10, padding: 8 }}>
        Search
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {geneInfo && (
        <div style={{ marginTop: 20 }}>
          <h3>Gene: {gene.toUpperCase()}</h3>
          <p><strong>Full Name:</strong> {geneInfo.fullName}</p>
          <p><strong>Function:</strong> {geneInfo.function}</p>
          <p><strong>Associated Diseases:</strong> {geneInfo.diseases.join(", ")}</p>
        </div>
      )}


    </div>
  );
};

export default GeneOverview;
