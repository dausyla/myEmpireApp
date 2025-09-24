import { Pie } from "react-chartjs-2";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";

export function AssetRepartition() {
  const { portfolio } = usePortfolio();
  if (!portfolio) return null;

  const labels = portfolio.assets.map((a) => a.name);
  const data = portfolio.assets.map((a) => a.values[a.values.length - 1]);

  return (
    <Pie
      data={{
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              "#36A2EB",
              "#FF6384",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false, // let it fill the container
        plugins: {
          legend: {
            position: "top",
          },
        },
      }}
    />
  );
}
