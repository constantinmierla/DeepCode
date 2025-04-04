import React, { useState } from "react";
import mockData from "../genes.json";

interface GeneInfo {
  fullName: string;
  function: string;
  diseases: string[];
}

const GeneOverview: React.FC = () => {
  const [gene, setGene] = useState("");
  const [geneInfo, setGeneInfo] = useState<GeneInfo | null>(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    const geneKey = gene.toUpperCase();
    const result = (mockData as Record<string, GeneInfo>)[geneKey];

    if (result) {
      setGeneInfo(result);
      setError("");
    } else {
      setGeneInfo(null);
      setError("Gene not found.");
    }
  };

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
