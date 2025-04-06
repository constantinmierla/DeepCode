import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineElement, // Import LineElement
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import { TooltipItem } from "chart.js"; // Import TooltipItem type

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Filler,
  LineElement, // Register LineElement
  Filler
);

interface ClusteringPlotProps {
  drugSuggestions: string;
}

export const ClusteringPlot: React.FC<ClusteringPlotProps> = ({
  drugSuggestions,
}) => {
  let parsedDrugs: any = null;

  try {
    if (drugSuggestions) {
      parsedDrugs = JSON.parse(drugSuggestions);
    }
  } catch (error) {
    console.error("Invalid JSON in drugSuggestions:", error);
  }

  const data = {
    datasets:
      parsedDrugs?.suggestions.map((item: any, index: number) => ({
        label: `${index + 1}. ${item.medicament_name}`,
        data: [
          { x: 0, y: index + 1 },
          { x: item.score, y: index + 1 },
        ],
        backgroundColor:
          item.score >= 70
            ? "rgba(34, 193, 34, 0.6)"
            : item.score >= 50
              ? "rgba(255, 193, 7, 0.6)"
              : "rgba(244, 67, 54, 0.6)",
        borderColor:
          item.score >= 70
            ? "rgba(34, 193, 34, 1)"
            : item.score >= 50
              ? "rgba(255, 193, 7, 1)"
              : "rgba(244, 67, 54, 1)",
        borderWidth: 2,
        showLine: true,
        pointRadius: 0,
      })) || [],
  };

  return (
    <div className="mt-6">
      <div
        className="chart-container"
        style={{
          position: "relative",
          height: "calc(100vh - 200px)",
          width: "100%",
        }}
      >
        <Scatter
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Clustering of Drug Suggestions Based on Scores",
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem: TooltipItem<"scatter">) => {
                    return `Score: ${tooltipItem.parsed.x}`;
                  },
                },
              },
            },
            scales: {
              x: {
                min: Math.min(
                  ...(parsedDrugs?.suggestions.map(
                    (item: any) => item.score - 5
                  ) || [0])
                ),
                max: Math.max(
                  ...(parsedDrugs?.suggestions.map(
                    (item: any) => item.score
                  ) || [100])
                ),
                title: {
                  display: true,
                  text: "Score",
                },
              },
              y: {
                min: 1,
                max: parsedDrugs?.suggestions.length || 20,
                title: {
                  display: true,
                  text: "Medicament Index",
                },
                ticks: {
                  stepSize: 1,
                },
              },
            },
            elements: {
              line: {
                borderWidth: 2,
                tension: 0,
              },
              point: {
                radius: 0,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ClusteringPlot;
