import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

import { useTheme } from "../../../../contexts/ThemeContext/ThemeContextHook";

interface AssetValueChartProps {
  historicalData: number[];
  predictionData: number[];
  labels: string[];
}

export function AssetValueChart({
  historicalData,
  predictionData,
  labels,
}: AssetValueChartProps) {
  const { theme } = useTheme();

  // Force re-render when theme changes by using it in a key or just by hook presence
  // The hook presence causes re-render, so options will be re-evaluated.
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: theme === "dark" ? "#fff" : "#000",
        },
      },
      title: {
        display: true,
        text: "Asset Value Prediction",
        color: theme === "dark" ? "#fff" : "#000",
      },
    },
    scales: {
      y: {
        ticks: { color: theme === "dark" ? "#fff" : "#000" },
        grid: { color: theme === "dark" ? "#555" : "#ccc" },
      },
      x: {
        ticks: { color: theme === "dark" ? "#fff" : "#000" },
        grid: { color: theme === "dark" ? "#555" : "#ccc" },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Historical Value",
        data: historicalData,
        borderColor: "#8a2387",
        backgroundColor: "rgba(138, 35, 135, 0.5)",
        tension: 0.3,
      },
      {
        label: "Projected Value",
        data: predictionData,
        borderColor: "#e94057",
        backgroundColor: "rgba(233, 64, 87, 0.5)",
        tension: 0.3,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
