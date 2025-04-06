import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CombinedData {
  central_genes: string[];
  relations: { source: string; target: string; type: string; gene: string }[];
  stats: { total_relations: number; unique_genes: number };
}

interface GeneSimilarityChartProps {
  data: CombinedData;
  gene: string; // Add the gene property
}

const GeneSimilarityChart: React.FC<GeneSimilarityChartProps> = ({
  data,
  gene,
}) => {
  const { relations } = data;

  // Helper function to filter relations for a specific central gene
  const filterRelationsByGene = (gene: string) =>
    relations.filter((relation) => relation.gene === gene);

  // Helper function to calculate gene compatibility
  const calculateGeneCompatibility = (
    relations: { source: string; target: string; type: string }[]
  ): { [key: string]: number } => {
    return relations.reduce((acc, relation) => {
      const targetGene = relation.target;

      // Define the compatibility score based on the interaction type
      const compatibilityScore =
        relation.type === "activation"
          ? 1
          : relation.type === "inhibition"
          ? -1
          : 0;

      // Sum the scores for each gene
      acc[targetGene] = (acc[targetGene] || 0) + compatibilityScore;
      return acc;
    }, {} as { [key: string]: number });
  };

  // Helper function to generate chart data
  const generateChartData = (geneCompatibility: { [key: string]: number }) => ({
    labels: Object.keys(geneCompatibility),
    datasets: [
      {
        label: "Gene Compatibility",
        data: Object.values(geneCompatibility),
        backgroundColor: (context: any) => {
          const value = context.raw;
          return value > 0
            ? "rgba(75, 192, 192, 0.6)"
            : "rgba(255, 99, 132, 0.6)";
        },
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  // Helper function to generate chart options
  const generateChartOptions = (gene: string) => ({
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Gene Compatibility with ${gene}`,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const percentage =
              tooltipItem.raw === 1 || tooltipItem.raw === -1
                ? `${tooltipItem.raw * 100}%`
                : "0%";
            return `Compatibility: ${percentage}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Gene Names",
        },
      },
      y: {
        title: {
          display: true,
          text: "Compatibility Score",
        },
        min: -1,
        max: 1,
        ticks: {
          stepSize: 0.5,
        },
      },
    },
  });

  const filteredRelations = filterRelationsByGene(gene);
  const geneCompatibility = calculateGeneCompatibility(filteredRelations);
  const chartData = generateChartData(geneCompatibility);
  const chartOptions = generateChartOptions(gene);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default GeneSimilarityChart;
