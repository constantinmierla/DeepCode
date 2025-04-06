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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GeneData {
  central_gene: string;
  relations: { source: string; target: string; type: string }[];
  stats: { total_relations: number; unique_genes: number };
}

interface GeneSimilarityChartProps {
  data: GeneData;
}

const GeneSimilarityChart: React.FC<GeneSimilarityChartProps> = ({ data }) => {
  const geneCompatibility = calculateGeneCompatibility(data.relations);

  const chartData = generateChartData(geneCompatibility);
  const chartOptions = generateChartOptions();

  return (
    <div>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

const calculateGeneCompatibility = (
  relations: { source: string; target: string; type: string }[]
): { [key: string]: number } => {
  return relations.reduce((acc, relation) => {
    const targetGene = relation.target;

    const compatibilityScore =
      relation.type === "activation"
        ? 1
        : relation.type === "inhibition"
          ? -1
          : 0;

    acc[targetGene] = (acc[targetGene] || 0) + compatibilityScore;
    return acc;
  }, {} as { [key: string]: number });
};

const generateChartData = (geneCompatibility: { [key: string]: number }) => ({
  labels: Object.keys(geneCompatibility),
  datasets: [
    {
      label: "Gene Compatibility with TP53",
      data: Object.values(geneCompatibility),
      backgroundColor: (context: any) => {
        // Dynamically set the color based on whether it's positive or negative
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

const generateChartOptions = () => ({
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Gene Compatibility with TP53",
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem: any) => {
          // Display compatibility as percentage
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

export default GeneSimilarityChart;
