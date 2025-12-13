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
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "var(--text-primary)",
        },
      },
      title: {
        display: true,
        text: "Asset Value Prediction",
        color: "var(--text-primary)",
      },
    },
    scales: {
      y: {
        ticks: { color: "var(--text-secondary)" },
        grid: { color: "var(--border-color)" },
      },
      x: {
        ticks: { color: "var(--text-secondary)" },
        grid: { color: "var(--border-color)" },
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
