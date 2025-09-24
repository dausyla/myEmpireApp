import { Bar } from "react-chartjs-2";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";

export function MonthlyInputs() {
  const { portfolio } = usePortfolio();
  if (!portfolio) return null;

  const labels = portfolio.dates.map((d) => new Date(d).toLocaleDateString());

  const data = portfolio.dates.map((_, i) =>
    portfolio.assets.reduce((acc, asset) => acc + (asset.inputs[i] || 0), 0)
  );

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Monthly Inputs",
            data,
            backgroundColor: "#36A2EB",
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
