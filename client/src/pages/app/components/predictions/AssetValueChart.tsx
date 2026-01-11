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
  labels: string[];
  datasets: any[];
}

export function AssetValueChart({ labels, datasets }: AssetValueChartProps) {
  const { theme } = useTheme();

  // Force re-render when theme changes by using it in a key or just by hook presence
  // The hook presence causes re-render, so options will be re-evaluated.
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: theme === "dark" ? "#fff" : "#000",
        },
      },
      title: {
        display: false,
        text: "Asset Value Prediction",
        color: theme === "dark" ? "#fff" : "#000",
      },
    },
    scales: {
      y: {
        stacked: true,
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
    datasets,
  };

  return <Line options={options} data={data} />;
}
