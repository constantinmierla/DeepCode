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
  Legend,
  Filler
);

interface ClusteringPlotProps {
  drugSuggestions: string;
}

export const ClusteringPlot: React.FC<ClusteringPlotProps> = ({ drugSuggestions }) => {
  let parsedDrugs: any = null;

  try {
    if (drugSuggestions) {
      parsedDrugs = JSON.parse(drugSuggestions);
    }
  } catch (error) {
    console.error("Invalid JSON in drugSuggestions:", error);
  }

  const data = {
    datasets: parsedDrugs?.suggestions.map((item: any) => ({
      label: item.medicament_name,
      data: [{ x: item.score, y: Math.random() * 100, r: 100 }], // Randomize y-axis, score on x-axis
      backgroundColor:
        item.score >= 70
          ? "rgba(34, 193, 34, 0.6)"
          : item.score >= 50
            ? "rgba(255, 193, 7, 0.6)"
            : "rgba(244, 67, 54, 0.6)",
    })) || [],
  };

  return (
    <div className="mt-6">
      <h4 className="text-4xl font-semibold text-gray-800 mb-2">
        Clustering Plot of Drug Suggestions
      </h4>
      <div className="chart-container" style={{ position: 'relative', height: '1000px', width: '100%' }}>
        <Scatter
          data={data}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Clustering of Drug Suggestions Based on Scores",
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem: TooltipItem<'scatter'>) => {
                    return `Score: ${tooltipItem.parsed.x}`;
                  },
                },
              },
            },
            scales: {
              x: {
                min: 0,
                max: 100,
                title: {
                  display: true,
                  text: "Score",
                },
              },
              y: {
                min: 0,
                max: 100,
                title: {
                  display: true,
                  text: "Random Y (for cluster spacing)",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ClusteringPlot;
